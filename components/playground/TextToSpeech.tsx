import React, { useState, useRef } from 'react';
import { Button } from '../Button';
import { generateSpeech } from '../../services/geminiService';
import { LoaderIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

// decode and decodeAudioData functions from guidelines, for playing audio
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


export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!text) {
      addToast('Please enter some text.', 'error');
      return;
    }
    setIsLoading(true);
    setCanPlay(false);
    audioBufferRef.current = null;
    
    try {
      const audioB64 = await generateSpeech(text);
      
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const audioBytes = decode(audioB64);
      const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      audioBufferRef.current = buffer;
      setCanPlay(true);
      playAudio(); // Autoplay after generation

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(`Speech generation failed: ${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const playAudio = () => {
      if (!audioBufferRef.current || !audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
       if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const source = ctx.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(ctx.destination);
      source.start();
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Text to Speech</h2>
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Hello, world! Welcome to the AI playground."
            className="w-full h-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={!text}>
            Generate Speech
          </Button>
        </div>
      </div>
      {(isLoading || canPlay) && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-center items-center min-h-[100px]">
          {isLoading ? (
            <LoaderIcon className="w-8 h-8 animate-spin text-teal-500" />
          ) : canPlay ? (
            <Button onClick={playAudio} variant="secondary">Play Generated Audio</Button>
          ) : null}
        </div>
      )}
    </div>
  );
};
