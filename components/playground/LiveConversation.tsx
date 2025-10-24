import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { Button } from '../Button';
import { MicIcon, StopCircleIcon, UserCircleIcon, SparklesIcon, ZapIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

// Audio Encoding & Decoding functions from guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Function Declaration for LinkedIn tool
const postToLinkedInFunction: FunctionDeclaration = {
    name: 'postToLinkedIn',
    description: 'Opens the LinkedIn website with a pre-filled dialog to share a post. Use this when the user wants to share content on LinkedIn.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            postContent: {
                type: Type.STRING,
                description: 'The text content of the post to be shared on LinkedIn.',
            },
        },
        required: ['postContent'],
    },
};

type TranscriptEntry = {
    id: number;
    role: 'user' | 'model' | 'tool' | 'status';
    text: string;
    isFinal: boolean;
};


export const LiveConversation: React.FC = () => {
  const { addToast } = useToast();
  const [isLive, setIsLive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  
  const aiRef = useRef<GoogleGenAI | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRefs = useRef<{ input: AudioContext | null, output: AudioContext | null }>({ input: null, output: null });
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  let nextStartTime = 0;
  let transcriptIdCounter = 0;

  useEffect(() => {
    try {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch(e) {
      addToast(e instanceof Error ? e.message : 'Error initializing AI', 'error');
    }
    
    return () => { stopConversation(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast]);
  
  const addOrUpdateTranscript = (role: TranscriptEntry['role'], text: string, isFinal: boolean) => {
    setTranscript(prev => {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry && lastEntry.role === role && !lastEntry.isFinal) {
            // Update the last entry
            const updatedTranscript = [...prev];
            updatedTranscript[updatedTranscript.length - 1] = { ...lastEntry, text: lastEntry.text + text, isFinal };
            return updatedTranscript;
        } else {
            // Add a new entry
            return [...prev, { id: transcriptIdCounter++, role, text, isFinal }];
        }
    });
  };

  const stopConversation = () => {
    setIsLive(false);
    addOrUpdateTranscript('status', 'Connection closed.', true);
    
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    streamSourceRef.current?.disconnect();
    streamSourceRef.current = null;

    if (audioContextRefs.current.input?.state !== 'closed') audioContextRefs.current.input?.close();
    if (audioContextRefs.current.output?.state !== 'closed') audioContextRefs.current.output?.close();
    audioContextRefs.current = { input: null, output: null };

    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const startConversation = async () => {
    if (!aiRef.current || !navigator.mediaDevices?.getUserMedia) {
        addToast('AI client not initialized or browser not supported.', 'error');
        return;
    }
    
    setIsLive(true);
    setTranscript([{ id: transcriptIdCounter++, role: 'status', text: 'Connecting...', isFinal: true }]);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        audioContextRefs.current.input = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRefs.current.output = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = audioContextRefs.current.output.createGain();
        outputNode.connect(audioContextRefs.current.output.destination);

        const sessionPromise = aiRef.current.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    addOrUpdateTranscript('status', 'Connected. Start speaking...', true);
                    const inputCtx = audioContextRefs.current.input!;
                    const source = inputCtx.createMediaStreamSource(stream);
                    streamSourceRef.current = source;
                    const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;
                    
                    scriptProcessor.onaudioprocess = (event) => {
                        const inputData = event.inputBuffer.getChannelData(0);
                        const blob: Blob = {
                            data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32768)).buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromiseRef.current?.then((session) => session.sendRealtimeInput({ media: blob }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputCtx.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    if (msg.serverContent?.inputTranscription) {
                        const { text } = msg.serverContent.inputTranscription;
                        addOrUpdateTranscript('user', text, false);
                    }
                    if (msg.serverContent?.outputTranscription) {
                        const { text } = msg.serverContent.outputTranscription;
                        addOrUpdateTranscript('model', text, false);
                    }
                    if (msg.toolCall) {
                        for (const fc of msg.toolCall.functionCalls) {
                            if (fc.name === 'postToLinkedIn' && typeof fc.args.postContent === 'string') {
                                const content = fc.args.postContent;
                                addOrUpdateTranscript('tool', `Opening LinkedIn to share: "${content}"`, true);
                                const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
                                window.open(url, '_blank');
                                sessionPromiseRef.current?.then((session) => {
                                    session.sendToolResponse({
                                        functionResponses: { id: fc.id, name: fc.name, response: { result: "ok, opened link" } }
                                    });
                                });
                            }
                        }
                    }
                    const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio && audioContextRefs.current.output) {
                        const outputCtx = audioContextRefs.current.output;
                        nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sourcesRef.current.add(source);
                    }
                    if (msg.serverContent?.interrupted) {
                        for (const source of sourcesRef.current.values()) {
                            source.stop();
                            sourcesRef.current.delete(source);
                        }
                        nextStartTime = 0;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    addToast(`Connection error: ${e.message}`, 'error');
                    stopConversation();
                },
                onclose: (e: CloseEvent) => {
                    stopConversation();
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                tools: [{ functionDeclarations: [postToLinkedInFunction] }],
            },
        });
        sessionPromiseRef.current = sessionPromise;
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start audio stream.';
        addToast(message, 'error');
        stopConversation();
    }
  };
  
  const TranscriptDisplay = ({ entries }: { entries: TranscriptEntry[] }) => (
    <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 h-64 overflow-y-auto space-y-4 text-left">
        {entries.map(entry => (
            <div key={entry.id} className={`flex items-start gap-3 text-sm ${entry.role === 'status' ? 'justify-center' : ''}`}>
                {entry.role === 'user' && <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500"><UserCircleIcon className="w-4 h-4" /></div>}
                {entry.role === 'model' && <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900 text-teal-500"><SparklesIcon className="w-4 h-4" /></div>}
                {entry.role === 'tool' && <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500"><ZapIcon className="w-4 h-4" /></div>}
                <p className={`${entry.role === 'status' ? 'text-slate-500 italic' : entry.role === 'tool' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {entry.text}
                </p>
            </div>
        ))}
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
      <h2 className="text-xl font-semibold mb-4">Live Conversation</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Have a real-time voice conversation with Gemini. Try saying "Post to LinkedIn that I'm building with the Gemini API."</p>
      <div className="flex justify-center items-center gap-4">
        {!isLive ? (
          <Button onClick={startConversation} className="gap-2">
            <MicIcon className="w-5 h-5" />
            Start Conversation
          </Button>
        ) : (
          <Button onClick={stopConversation} variant="secondary" className="gap-2 border-red-500/50 text-red-600 dark:border-red-500/30 dark:text-red-400">
            <StopCircleIcon className="w-5 h-5" />
            Stop Conversation
          </Button>
        )}
      </div>
      <TranscriptDisplay entries={transcript} />
    </div>
  );
};