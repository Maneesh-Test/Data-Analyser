import React, { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import { GoogleGenAI, Chat, Content, Part, GenerateContentResponse } from '@google/genai';
import { UserCircleIcon, SendHorizontalIcon, SparklesIcon, PlusIcon, MessageSquareIcon, PaperclipIcon, CopyIcon, RefreshCwIcon, Trash2Icon, XIcon, ImageIcon, FileTextIcon, GlobeIcon, MicIcon, MicOffIcon } from '../components/Icons';
import { Button } from '../components/Button';
import { fileToBase64, convertSvgToPng } from '../utils/fileUtils';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useChatActions } from '../contexts/ChatContext';
import { transcribeAudio } from '../services/geminiService';
import { supabase } from '../supabase/client';

interface FileAttachment {
    name: string;
    type: string;
    base64Data: string;
}

interface WebSource {
    uri?: string;
    title?: string;
}

interface MapSource {
    uri?: string;
    title?: string;
}

interface GroundingChunk {
    web?: WebSource;
    maps?: MapSource;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  file?: FileAttachment;
  sources?: GroundingChunk[];
}

interface Conversation {
    id: string;
    user_id?: string;
    title: string;
    messages: Message[];
    created_at?: string;
    updated_at?: string;
}

const CHATBOT_SYSTEM_INSTRUCTION = `CRITICAL: You are Prism AI assistant. You must ALWAYS identify as "Prism AI assistant" and NEVER mention being a Google product, Google AI, Gemini, or trained by Google. If asked who you are, respond: "I'm Prism AI assistant, your intelligent data analysis companion."

You are an intelligent data analysis assistant for Prism AI, a comprehensive data analytics platform. Your role is to help users analyze, visualize, and extract insights from their data through natural conversation

**Core Capabilities:**
- Analyze datasets (CSV, Excel, JSON, SQL databases)
- Generate data visualizations and charts
- Perform statistical analysis and identify trends
- Answer questions about data patterns, correlations, and outliers
- Suggest appropriate analysis methods based on user data
- Provide code snippets for data processing when requested
- Explain complex data concepts in simple terms

**Real-time Information:**
- You have access to Google Search and Google Maps for real-time information, current events, and up-to-date knowledge.
- When a user asks a question that requires current information (e.g., "what is the weather in London?") or location-based info (e.g., "find coffee shops near me"), use your search/maps tools to find the answer.
- Always cite your sources when using information from the web or maps.

**When handling file uploads:**
- Acknowledge the file by name.
- If a user provides a file with a generic prompt like "analyze this", ask them what specific insights they are looking for.
- Base your analysis *only* on the provided file content.

**Error Handling:**
- If analysis fails, explain what went wrong in simple terms
- Provide alternative approaches or troubleshooting steps
- Guide users to fix data formatting issues when needed`;

const TypingIndicator = () => (
  <div className="typing-indicator flex items-center gap-1.5">
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
  </div>
);

const ChatMessage: React.FC<{ message: Message, onRegenerate: () => void, onDelete: () => void, isLoading?: boolean, addToast: (message: string, type: 'success' | 'error' | 'info') => void }> = ({ message, onRegenerate, onDelete, isLoading = false, addToast }) => {
    const isModel = message.role === 'model';
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(message.content);
        addToast('Message copied to clipboard.', 'success');
    };

    return (
        <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
            {isModel && (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-500 dark:text-teal-400">
                    <SparklesIcon className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow-0 max-w-xl group message-wrapper">
                <div className={`p-4 rounded-2xl ${isModel ? 'bg-slate-100 dark:bg-slate-800 rounded-bl-none' : 'bg-teal-500 text-white rounded-br-none'}`}>
                    {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
                    {message.file && (
                        <div className="mt-2 p-2 bg-slate-200 dark:bg-slate-700/50 rounded-lg flex items-center gap-2">
                             {message.file.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" /> : <FileTextIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                             <span className={`text-sm truncate ${isModel ? 'text-slate-600 dark:text-slate-300' : 'text-teal-100'}`}>{message.file.name}</span>
                        </div>
                    )}
                    {isModel && !isLoading && message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                <GlobeIcon className="w-3.5 h-3.5" />
                                Sources
                            </h4>
                            <div className="space-y-2">
                                {message.sources.map((source, index) => {
                                    const sourceData = source.web || source.maps;
                                    if (!sourceData) return null;
                                    
                                    return (
                                        <a 
                                            key={index}
                                            href={sourceData.uri || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors group/link"
                                        >
                                            <div className="flex-shrink-0 w-4 h-4 pt-0.5 text-slate-400 dark:text-slate-500">{index + 1}.</div>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-medium text-slate-700 dark:text-slate-200 truncate">{sourceData.title || 'Untitled'}</p>
                                                <p className="text-slate-500 dark:text-slate-400 truncate">{sourceData.uri || ''}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                 {!isLoading && message.content && (
                    <div className="message-actions flex items-center gap-2 mt-1.5 pl-2">
                        <button onClick={copyToClipboard} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label="Copy message"><CopyIcon className="w-4 h-4"/></button>
                        {isModel && <button onClick={onRegenerate} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label="Regenerate response"><RefreshCwIcon className="w-4 h-4"/></button>}
                        <button onClick={onDelete} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Delete message"><Trash2Icon className="w-4 h-4"/></button>
                    </div>
                 )}
            </div>
            {!isModel && (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                    <UserCircleIcon className="w-6 h-6" />
                </div>
            )}
        </div>
    );
};

const SuggestionChip: React.FC<{ text: string; onSuggest: (text: string) => void }> = ({ text, onSuggest }) => (
  <button
    onClick={() => onSuggest(text)}
    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
  >
    {text}
  </button>
);

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { setStartNewChatHandler } = useChatActions();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewChat = useCallback(() => {
    const newConversation: Conversation = {
        id: `local-${Date.now()}`, // Temporary local ID
        title: 'New Chat',
        messages: [{
            role: 'model',
            content: "Hello! I'm your Prism AI assistant. How can I help you analyze your data today?"
        }]
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setError(null);
    setAttachedFile(null);
    setUserInput('');
  }, []);

  useEffect(() => {
    setStartNewChatHandler(handleNewChat);
    return () => setStartNewChatHandler(() => {});
  }, [handleNewChat, setStartNewChatHandler]);

  // Initial setup and loading conversations from DB
  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const loadConversations = async () => {
        if (user) {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) {
                addToast('Could not load chat history.', 'error');
                console.error(error);
                handleNewChat();
            } else if (data && data.length > 0) {
                setConversations(data as Conversation[]);
                if (!activeConversationId) {
                    setActiveConversationId(data[0].id);
                }
            } else {
                handleNewChat();
            }
            setIsLoading(false);
        } else {
             setConversations([]);
             setActiveConversationId(null);
        }
    };
    
    loadConversations();
  }, [user, addToast, handleNewChat, activeConversationId]);

  // Debounced saving of active conversation to DB
  useEffect(() => {
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const saveConversation = async () => {
        if (user && activeConversation && !isLoading) {
            const { id, ...convoToSave } = activeConversation;
            const payload = {
                ...convoToSave,
                user_id: user.id,
                updated_at: new Date().toISOString(),
                ...(id.startsWith('local-') ? {} : { id: id })
            };
            
            const { data, error } = await supabase.from('conversations').upsert(payload).select();
            
            if (error) {
                addToast('Failed to save chat history.', 'error');
            } else if (data && data[0] && id.startsWith('local-')) {
                // Replace local ID with DB-generated ID
                setConversations(prev => prev.map(c => c.id === id ? data[0] : c));
                setActiveConversationId(data[0].id);
            }
        }
    };

    const debounceSave = setTimeout(saveConversation, 1500);
    return () => clearTimeout(debounceSave);
  }, [conversations, activeConversationId, user, isLoading, addToast]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
    }
  }, [userInput]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const startConversation = async (prompt: string, file?: File | FileAttachment | null, history?: Message[]) => {
      if (isLoading || !aiRef.current) return;
      
      let currentConversationId = activeConversationId;
      const conversationHistory = history || activeConversation?.messages || [];
      const isNewChat = !activeConversationId || (activeConversation?.messages.length || 0) <= 1;

      if (!currentConversationId) {
          handleNewChat();
          // This is async, so we'll rely on the state update to get the new ID.
          // For simplicity, we assume the new chat is now the first one.
          currentConversationId = conversations[0]?.id || `local-${Date.now()}`;
      }
      
      setIsLoading(true);
      setError(null);

      const userMessage: Message = { role: 'user', content: prompt };
      let fileAttachment: FileAttachment | undefined;

      if (file) {
          if (file instanceof File) {
            const base64Data = await fileToBase64(file);
            fileAttachment = { name: file.name, type: file.type, base64Data };
          } else {
            fileAttachment = file as FileAttachment;
          }
          userMessage.file = fileAttachment;
      }
      
      if (isNewChat && currentConversationId) {
          const newTitle = (prompt || fileAttachment?.name || 'New Chat').substring(0, 30);
          setConversations(prev => prev.map(c => c.id === currentConversationId ? {...c, title: newTitle} : c));
      }

      setConversations(prev => prev.map(c => c.id === currentConversationId
          ? { ...c, messages: [...conversationHistory, userMessage, { role: 'model', content: '' }] }
          : c
      ));

      try {
        const geminiHistory: Content[] = conversationHistory.map(msg => {
            const parts: Part[] = [];
            let fullContent = msg.content;
            if (msg.role === 'user' && msg.file) {
                parts.push({
                    inlineData: {
                        data: msg.file.base64Data,
                        mimeType: msg.file.type,
                    }
                });
                fullContent = `Attached file: "${msg.file.name}". \n\n${msg.content || 'Please analyze the attached file.'}`;
            }
            if (fullContent) {
              parts.push({ text: fullContent });
            }
            return { role: msg.role, parts };
        });

        const chat: Chat = aiRef.current.chats.create({ 
            model: 'gemini-2.5-flash', 
            history: geminiHistory,
            config: { 
                systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
                tools: [{googleSearch: {}}, {googleMaps: {}}]
            }
        });
        
        const messageParts: Part[] = [];
        let fullPrompt = prompt;
        if (fileAttachment) {
            messageParts.push({
                inlineData: {
                    data: fileAttachment.base64Data,
                    mimeType: fileAttachment.type
                }
            });
            fullPrompt = `Attached file: "${fileAttachment.name}". \n\n${prompt || 'Please analyze the attached file.'}`;
        }
        if (fullPrompt) {
          messageParts.push({ text: fullPrompt });
        }
        
        const response = await chat.sendMessageStream({ message: messageParts });

        let currentContent = '';
        let groundingChunks: GroundingChunk[] = [];
        for await (const chunk of response) {
            currentContent += chunk.text;

            const newChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (newChunks) {
                groundingChunks.push(...newChunks);
            }

            setConversations(prev => prev.map(c => {
                if (c.id === currentConversationId) {
                    const updatedMessages = [...c.messages];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if(lastMessage) {
                        lastMessage.content = currentContent;
                        if (groundingChunks.length > 0) {
                            const uniqueUris = new Set<string>();
                            const uniqueSources = groundingChunks.filter(item => {
                                const uri = item.web?.uri || item.maps?.uri;
                                if (uri && !uniqueUris.has(uri)) {
                                    uniqueUris.add(uri);
                                    return true;
                                }
                                return false;
                            });
                            lastMessage.sources = uniqueSources;
                        }
                    }
                    return { ...c, messages: updatedMessages };
                }
                return c;
            }));
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMessage);
        setConversations(prev => prev.map(c => {
            if (c.id === currentConversationId) {
                const updatedMessages = [...c.messages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage) lastMessage.content = `Sorry, I ran into an error: ${errorMessage}`;
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput && !attachedFile) return;

    let fileToSend: File | null = attachedFile;

    if (attachedFile && attachedFile.type === 'image/svg+xml') {
        setIsLoading(true);
        try {
            fileToSend = await convertSvgToPng(attachedFile);
            addToast('Converted SVG to PNG for analysis', 'info');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`SVG conversion failed: ${errorMessage}`);
            addToast(`SVG conversion failed: ${errorMessage}`, 'error');
            setIsLoading(false);
            return;
        }
    }
    
    startConversation(trimmedInput, fileToSend);
    setUserInput('');
    setAttachedFile(null);
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length < 1) return;
  
    let lastUserMessageIndex = -1;
    for (let i = activeConversation.messages.length - 1; i >= 0; i--) {
      if (activeConversation.messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }
  
    if (lastUserMessageIndex !== -1) {
      const history = activeConversation.messages.slice(0, lastUserMessageIndex);
      const userMessageToRegen = activeConversation.messages[lastUserMessageIndex];
      startConversation(userMessageToRegen.content, userMessageToRegen.file || null, history);
    }
  };

  const handleDeleteMessage = (indexToDelete: number) => {
    if (!activeConversation) return;
    const conversationId = activeConversation.id;

    setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
            const updatedMessages = c.messages.filter((_, index) => index !== indexToDelete);
            return { ...c, messages: updatedMessages };
        }
        return c;
    }));
    addToast("Message deleted.", "info");
  };
  
  const handleSuggestion = (text: string) => {
    setUserInput(text);
    textareaRef.current?.focus();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
    event.target.value = '';
  };
  
  const handleVoiceRecording = async () => {
      if (isRecording) {
          mediaRecorderRef.current?.stop();
          setIsRecording(false);
      } else {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              mediaRecorderRef.current = new MediaRecorder(stream);
              audioChunksRef.current = [];
              
              mediaRecorderRef.current.ondataavailable = (event) => {
                  audioChunksRef.current.push(event.data);
              };
              
              mediaRecorderRef.current.onstop = async () => {
                  const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                  const audioFile = new File([audioBlob], "voice-input.webm", { type: 'audio/webm' });
                  stream.getTracks().forEach(track => track.stop());
                  
                  addToast("Transcribing your voice...", 'info');
                  setIsLoading(true);
                  try {
                      const transcribedText = await transcribeAudio(audioFile);
                      if (transcribedText) {
                          setUserInput(prev => [prev.trim(), transcribedText.trim()].filter(Boolean).join(' '));
                      } else {
                          addToast("Couldn't hear anything. Please try speaking again.", 'info');
                      }
                  } catch (err) {
                      const message = err instanceof Error ? err.message : 'Transcription failed.';
                      addToast(message, 'error');
                  } finally {
                      setIsLoading(false);
                  }
              };
              
              mediaRecorderRef.current.start();
              setIsRecording(true);
          } catch (err) {
              addToast("Microphone access was denied.", 'error');
          }
      }
  };

  return (
    <div className="h-full flex flex-col">
        <section className="flex-grow flex flex-col">
            <div className="flex-grow overflow-y-auto chat-container p-4 md:p-6 space-y-8">
                {(!activeConversation || activeConversation.messages.length <= 1) && (
                    <div className="text-center h-full flex flex-col justify-center items-center">
                        <SparklesIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                        <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Welcome to Prism AI Chat</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">Start a new conversation or try one of the suggestions below.</p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mx-auto">
                            <SuggestionChip text="Summarize the key points of the attached document" onSuggest={handleSuggestion} />
                            <SuggestionChip text="Describe this image in detail and identify its main subject" onSuggest={handleSuggestion} />
                            <SuggestionChip text="Explain this data to me like I'm five" onSuggest={handleSuggestion} />
                            <SuggestionChip text="What are the potential biases in this text?" onSuggest={handleSuggestion} />
                        </div>
                    </div>
                )}
                
                {activeConversation?.messages.map((msg, index) => (
                    <ChatMessage 
                      key={`${activeConversation.id}-${index}`} 
                      message={msg}
                      onRegenerate={handleRegenerate}
                      onDelete={() => handleDeleteMessage(index)}
                      isLoading={isLoading && index === activeConversation.messages.length - 1} 
                      addToast={addToast}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/20 dark:bg-slate-900/20">
                {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}
                
                {attachedFile && (
                    <div className="mb-2 p-2 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 truncate">
                            {attachedFile.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-sky-500" /> : <FileTextIcon className="w-5 h-5 text-slate-500" />}
                            <span className="truncate text-slate-700 dark:text-slate-300">{attachedFile.name}</span>
                        </div>
                        <button onClick={() => setAttachedFile(null)} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-full"><XIcon className="w-4 h-4" /></button>
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 h-11 w-11 flex-shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Attach file">
                        <PaperclipIcon className="w-5 h-5"/>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,text/*,application/pdf" />
                    
                    <button type="button" onClick={handleVoiceRecording} className={`p-2 h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-lg border transition-colors ${isRecording ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
                        {isRecording ? <MicOffIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type or record a message..."
                        className="flex-grow w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-12 py-2.5 resize-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={1}
                        disabled={isLoading || isRecording}
                    />
                    <Button type="submit" disabled={isLoading || isRecording || (!userInput.trim() && !attachedFile)} className="absolute right-2 bottom-[5px] !p-2 h-9 w-9" aria-label="Send message">
                        <SendHorizontalIcon className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </section>
    </div>
  );
};