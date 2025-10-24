import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Page } from '../App';
import { Button } from '../components/Button';
import { GoogleGenAI, Chat, Content, Part } from '@google/genai';
import { useToast } from '../contexts/ToastContext';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadCloudIcon, UserCircleIcon, SparklesIcon, SendHorizontalIcon, ChevronLeftIcon, FileTextIcon, BarChart2Icon } from '../components/Icons';
import { PdfPreview } from '../components/PdfPreview';

interface ChatWithFilePageProps {
  mode: 'pdf' | 'doc' | 'bi';
  navigateTo: (page: Page) => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

const TypingIndicator = () => (
  <div className="typing-indicator flex items-center gap-1.5">
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
    <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
  </div>
);

const ChatMessage: React.FC<{ message: Message, isLoading?: boolean }> = ({ message, isLoading = false }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
            {isModel && (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-500 dark:text-teal-400">
                    <SparklesIcon className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow-0 max-w-lg">
                <div className={`p-4 rounded-2xl ${isModel ? 'bg-slate-100 dark:bg-slate-800 rounded-bl-none' : 'bg-teal-500 text-white rounded-br-none'}`}>
                    {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
                </div>
            </div>
             {!isModel && (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                    <UserCircleIcon className="w-6 h-6" />
                </div>
            )}
        </div>
    );
};


export const ChatWithFilePage: React.FC<ChatWithFilePageProps> = ({ mode, navigateTo }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { addToast } = useToast();
  const aiRef = useRef<GoogleGenAI | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { title, description, accept, icon } = useMemo(() => {
    switch (mode) {
      case 'bi':
        return {
          title: 'Chat BI',
          description: 'Upload a CSV file to start a conversation about your data.',
          accept: '.csv,text/csv',
          icon: <BarChart2Icon className="w-16 h-16 text-slate-400" />
        };
      case 'doc':
         return {
          title: 'Chat with Document',
          description: 'Upload a TXT or other document file to ask questions about its content.',
          accept: 'text/*',
          icon: <FileTextIcon className="w-16 h-16 text-slate-400" />
        };
      case 'pdf':
      default:
        return {
          title: 'Chat with PDF',
          description: 'Upload a PDF document to start an interactive conversation.',
          accept: 'application/pdf',
          icon: <FileTextIcon className="w-16 h-16 text-slate-400" />
        };
    }
  }, [mode]);

  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setFile(selectedFile);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(URL.createObjectURL(selectedFile));
    setMessages([]);
    chatRef.current = null;

    try {
        const base64Data = await fileToBase64(selectedFile);
        const filePart: Part = { inlineData: { data: base64Data, mimeType: selectedFile.type } };
        
        const systemInstruction = `CRITICAL: You are Prism AI assistant. You must ALWAYS identify as "Prism AI assistant" and NEVER mention being a Google product, Google AI, Gemini, or trained by Google. If asked who you are, respond: "I'm Prism AI assistant."

The user has uploaded a file named "${selectedFile.name}". Your task is to answer questions based *only* on the content of this file. Start by confirming that you've read the file and are ready for questions.`;
        const initialPrompt = "Confirm you're ready.";
        const userTurn: Content = { role: 'user', parts: [filePart, { text: initialPrompt }] };

        // Use stateless generateContent for the first turn to establish a valid history
        const initialResult = await aiRef.current!.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [userTurn],
            config: { systemInstruction }
        });
        
        const responseText = initialResult.text;
        const modelTurn: Content = { role: 'model', parts: [{ text: responseText }]};

        // Now create the chatRef with the known-good, alternating history.
        chatRef.current = aiRef.current!.chats.create({
            model: 'gemini-2.5-flash',
            history: [userTurn, modelTurn],
            config: { systemInstruction }
        });

        // Update the UI with just the model's response for a clean start
        setMessages([{ role: 'model', content: responseText }]);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addToast(`Error processing file: ${msg}`, 'error');
      setFile(null);
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading || !chatRef.current) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: trimmedInput }, { role: 'model', content: '' }]);
    setUserInput('');

    try {
        const responseStream = await chatRef.current.sendMessageStream({ message: trimmedInput });
        let currentContent = '';
        for await (const chunk of responseStream) {
            currentContent += chunk.text;
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'model', content: currentContent };
                return updated;
            });
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        addToast(`Chat error: ${msg}`, 'error');
         setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'model', content: `Sorry, I encountered an error: ${msg}` };
            return updated;
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setMessages([]);
    chatRef.current = null;
  };
  
  if (!file) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="text-left w-full max-w-4xl mx-auto mb-6">
                 <Button onClick={() => navigateTo('dashboard')} variant="ghost" className="pl-1 text-sm">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Back to Dashboard
                </Button>
            </div>
            <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-4xl h-96 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                {icon}
                <h2 className="text-2xl font-bold mt-4">{title}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{description}</p>
                <Button variant="teal" className="mt-6 gap-2">
                    <UploadCloudIcon className="w-5 h-5" />
                    Select File
                </Button>
                <input ref={fileInputRef} type="file" className="hidden" accept={accept} onChange={handleFileChange} />
            </div>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-white dark:bg-[#1C1C1C]">
      {/* File Preview Pane */}
      <div className="w-full md:w-1/2 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 flex justify-between items-center">
            <p className="text-sm font-semibold truncate" title={file.name}>{file.name}</p>
            <Button onClick={handleReset} variant="secondary" size="sm">New File</Button>
        </div>
        <div className="flex-grow bg-slate-50 dark:bg-slate-900/50 overflow-auto">
            {file.type === 'application/pdf' ? (
                <PdfPreview fileUrl={filePreviewUrl!} />
            ) : (
                <div className="p-4 text-sm text-slate-600 dark:text-slate-300">File preview for this type is not available. Chat with it to explore its contents.</div>
            )}
        </div>
      </div>

      {/* Chat Pane */}
      <div className="w-full md:w-1/2 flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
            {isLoading && messages[messages.length - 1]?.role === 'user' && <ChatMessage message={{role: 'model', content:''}} isLoading={true} />}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <form onSubmit={handleSendMessage} className="relative">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                    placeholder="Ask a question about the document..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-12 py-3 resize-none"
                    rows={1}
                    disabled={isLoading || isUploading}
                />
                <Button type="submit" disabled={isLoading || isUploading || !userInput.trim()} className="absolute right-2 bottom-[7px] !p-2 h-9 w-9" aria-label="Send message">
                    <SendHorizontalIcon className="w-5 h-5" />
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
};