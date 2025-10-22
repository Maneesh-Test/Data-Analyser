import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Chat, Content, Part } from '@google/genai';
import { UserCircleIcon, SendHorizontalIcon, SparklesIcon, PlusIcon, MessageSquareIcon, PaperclipIcon, CopyIcon, RefreshCwIcon, Trash2Icon, XIcon, ImageIcon, FileTextIcon } from '../components/Icons';
import { Button } from '../components/Button';
import { fileToBase64 } from '../utils/fileUtils';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface FileAttachment {
    name: string;
    type: string;
    base64Data: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  file?: FileAttachment;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
}

const CHATBOT_SYSTEM_INSTRUCTION = `You are an intelligent data analysis assistant for Prism AI, a comprehensive data analytics platform. Your role is to help users analyze, visualize, and extract insights from their data through natural conversation.

**Core Capabilities:**
- Analyze datasets (CSV, Excel, JSON, SQL databases)
- Generate data visualizations and charts
- Perform statistical analysis and identify trends
- Answer questions about data patterns, correlations, and outliers
- Suggest appropriate analysis methods based on user data
- Provide code snippets for data processing when requested
- Explain complex data concepts in simple terms

**Response Guidelines:**
- Always ask clarifying questions if the user's request is ambiguous
- Provide step-by-step explanations for complex analyses
- When suggesting visualizations, specify the chart type and reasoning
- Format numerical results clearly with proper units and context
- If you need specific data format or columns, explicitly state requirements
- Keep responses concise but comprehensive (2-4 paragraphs max unless detailed analysis is requested)

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

const ChatMessage: React.FC<{ message: Message, onRegenerate: () => void, isLoading?: boolean, addToast: (message: string, type: 'success' | 'error' | 'info') => void }> = ({ message, onRegenerate, isLoading = false, addToast }) => {
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
                </div>
                 {isModel && !isLoading && message.content && (
                    <div className="message-actions flex items-center gap-2 mt-1.5 pl-2">
                        <button onClick={copyToClipboard} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label="Copy message"><CopyIcon className="w-4 h-4"/></button>
                        <button onClick={onRegenerate} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label="Regenerate response"><RefreshCwIcon className="w-4 h-4"/></button>
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize AI and load conversations based on user login state
  useEffect(() => {
    try {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (user) {
        const storageKey = `chatConversations_${user.email}`;
        const savedConversations = localStorage.getItem(storageKey);
        if (savedConversations) {
            const parsed = JSON.parse(savedConversations);
            setConversations(parsed);
            if (parsed.length > 0 && !parsed.some((c: Conversation) => c.id === activeConversationId)) {
                setActiveConversationId(parsed[0].id);
            }
        } else {
            setConversations([]);
            setActiveConversationId(null);
        }
      } else {
        setConversations([]);
        setActiveConversationId(null);
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
        setError(errorMessage);
    }
  }, [user]);

  // Save conversations to localStorage for the logged-in user
  useEffect(() => {
      if (user) {
        const storageKey = `chatConversations_${user.email}`;
        if (conversations.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(conversations));
        } else {
          localStorage.removeItem(storageKey);
        }
      }
  }, [conversations, user]);

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

  const handleNewChat = () => {
    const newConversation: Conversation = {
        id: `chat-${Date.now()}`,
        title: 'New Chat',
        messages: [{
            role: 'model',
            content: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?"
        }]
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setError(null);
    setAttachedFile(null);
    setUserInput('');
  };
  
  const handleDeleteChat = (idToDelete: string) => {
    const remaining = conversations.filter(c => c.id !== idToDelete);
    setConversations(remaining);
    if (activeConversationId === idToDelete) {
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleClearHistory = () => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete all your chat history? This action cannot be undone.")) {
        localStorage.removeItem(`chatConversations_${user.email}`);
        setConversations([]);
        setActiveConversationId(null);
        addToast('Chat history cleared successfully.', 'success');
    }
  };

  const startConversation = async (prompt: string, file?: File | FileAttachment | null, history?: Message[]) => {
      if (isLoading || !aiRef.current) return;
      
      let currentConversationId = activeConversationId;
      const conversationHistory = history || activeConversation?.messages || [];
      const isNewChat = !activeConversationId;

      if (isNewChat) {
          const newConvId = `chat-${Date.now()}`;
          const newTitle = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');
          const newConversation: Conversation = { id: newConvId, title: newTitle, messages: [] };
          setConversations(prev => [newConversation, ...prev]);
          setActiveConversationId(newConvId);
          currentConversationId = newConvId;
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
            config: { systemInstruction: CHATBOT_SYSTEM_INSTRUCTION }
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
        
        const response = await chat.sendMessageStream({ message: { parts: messageParts } });

        let currentContent = '';
        for await (const chunk of response) {
            currentContent += chunk.text;
            setConversations(prev => prev.map(c => {
                if (c.id === currentConversationId) {
                    const updatedMessages = [...c.messages];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if(lastMessage) lastMessage.content = currentContent;
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
  
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (trimmedInput || attachedFile) {
        startConversation(trimmedInput, attachedFile);
        setUserInput('');
        setAttachedFile(null);
    }
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
  
  const handleSuggestion = (text: string) => {
    setUserInput(text);
    textareaRef.current?.focus();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
    event.target.value = ''; // Allow re-selecting the same file
  };

  return (
    <div className="h-full flex overflow-hidden">
        <aside className="w-72 flex-shrink-0 bg-white/40 dark:bg-slate-900/40 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col">
           <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <Button onClick={handleNewChat} variant="secondary" className="w-full gap-2 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <PlusIcon className="w-5 h-5" /> New Chat
                </Button>
           </div>
           <nav className="flex-grow overflow-y-auto chat-sidebar p-2 space-y-1">
                {conversations.map(conv => (
                    <div key={conv.id} className="relative group">
                        <button 
                            onClick={() => setActiveConversationId(conv.id)}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm truncate transition-colors ${activeConversationId === conv.id ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                        >
                            <MessageSquareIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate flex-grow">{conv.title}</span>
                        </button>
                        <button onClick={() => handleDeleteChat(conv.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete chat">
                            <Trash2Icon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
           </nav>
           <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
                <button
                    onClick={handleClearHistory}
                    disabled={conversations.length === 0}
                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-2 rounded-lg hover:bg-red-500/10"
                >
                    <Trash2Icon className="w-4 h-4" />
                    Clear all chats
                </button>
            </div>
        </aside>

        <section className="flex-grow flex flex-col">
            <div className="flex-grow overflow-y-auto chat-container p-4 md:p-6 space-y-8">
                {!activeConversation && (
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
                      key={index} 
                      message={msg}
                      onRegenerate={handleRegenerate}
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
                        placeholder="Type your message or attach a file..."
                        className="flex-grow w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-12 py-2.5 resize-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={1}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || (!userInput.trim() && !attachedFile)} className="absolute right-2 bottom-[5px] !p-2 h-9 w-9" aria-label="Send message">
                        <SendHorizontalIcon className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </section>
    </div>
  );
};