import React, { useState } from 'react';
import { ChevronDownIcon, ImageIcon, MicIcon, Volume2Icon, Wand2Icon } from '../components/Icons';
import { ImageGeneration } from '../components/playground/ImageGeneration';
import { ImageEditing } from '../components/playground/ImageEditing';
import { LiveConversation } from '../components/playground/LiveConversation';
import { AudioTranscription } from '../components/playground/AudioTranscription';
import { TextToSpeech } from '../components/playground/TextToSpeech';

type PlaygroundTool = 'image-generation' | 'image-editing' | 'live-conversation' | 'audio-transcription' | 'text-to-speech';

const tools: { id: PlaygroundTool; name: string; description: string, icon: React.ReactNode }[] = [
    { id: 'image-generation', name: 'Image Generation', description: 'Create stunning images from text prompts.', icon: <ImageIcon className="w-5 h-5"/> },
    { id: 'image-editing', name: 'Image Editing', description: 'Edit existing images with text instructions.', icon: <Wand2Icon className="w-5 h-5" /> },
    { id: 'live-conversation', name: 'Live Conversation', description: 'Have a real-time voice chat with an AI.', icon: <MicIcon className="w-5 h-5" /> },
    { id: 'audio-transcription', name: 'Audio Transcription', description: 'Transcribe spoken words from an audio file.', icon: <MicIcon className="w-5 h-5" /> },
    { id: 'text-to-speech', name: 'Text to Speech', description: 'Convert text into natural-sounding speech.', icon: <Volume2Icon className="w-5 h-5" /> },
];

export const ApiPlaygroundPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<PlaygroundTool>('image-generation');

    const renderTool = () => {
        switch (activeTool) {
            case 'image-generation': return <ImageGeneration />;
            case 'image-editing': return <ImageEditing />;
            case 'live-conversation': return <LiveConversation />;
            case 'audio-transcription': return <AudioTranscription />;
            case 'text-to-speech': return <TextToSpeech />;
            default: return <p>Select a tool to get started.</p>;
        }
    };
    
    const activeToolInfo = tools.find(t => t.id === activeTool);

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-950">
            <header className="flex-shrink-0 p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Playground</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Explore the full power of Gemini's generative capabilities.</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <select
                            value={activeTool}
                            onChange={(e) => setActiveTool(e.target.value as PlaygroundTool)}
                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                            aria-label="Select AI Tool"
                        >
                           {tools.map(tool => (
                               <option key={tool.id} value={tool.id}>
                                   {tool.name}
                               </option>
                           ))}
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto">
                 <div className="max-w-7xl mx-auto p-4 md:p-6">
                    {renderTool()}
                 </div>
            </main>
        </div>
    );
};