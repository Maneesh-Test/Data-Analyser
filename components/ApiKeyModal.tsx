import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { XIcon, KeyIcon, EyeIcon, EyeOffIcon, OpenAIIcon, AnthropicIcon, PerplexityIcon } from './Icons';
import { LLMProvider } from '../lib/models';

interface ApiKeyModalProps {
  onClose: () => void;
  providers: LLMProvider[];
}

const ApiKeyInput: React.FC<{ provider: LLMProvider }> = ({ provider }) => {
    const storageKey = `${provider.id.toUpperCase()}_API_KEY`;
    const [apiKey, setApiKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem(storageKey);
        if (storedKey) setApiKey(storedKey);
    }, [storageKey]);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem(storageKey, apiKey);
        } else {
            localStorage.removeItem(storageKey);
        }
    }, [apiKey, storageKey]);
    
    const providerIcons: { [key: string]: React.ReactNode } = {
        'openai': <OpenAIIcon className="w-6 h-6" />,
        'anthropic': <AnthropicIcon className="w-6 h-6" />,
        'perplexity': <PerplexityIcon className="w-6 h-6" />,
    };

    const helperTexts: { [key: string]: string } = {
        'openai': 'Find your OpenAI API key in your OpenAI account settings.',
        'anthropic': 'Find your Anthropic API key in your Anthropic account settings.',
        'perplexity': 'Find your Perplexity API key in your Perplexity account settings.',
    };
    const helperText = helperTexts[provider.id];

    return (
        <div className="space-y-3">
            <label htmlFor={`${provider.id}-key`} className="flex items-center gap-3 font-semibold text-base text-slate-800 dark:text-slate-100">
                {providerIcons[provider.id]}
                <span>{provider.name}</span>
            </label>
            <div className="relative flex items-center">
                <input
                    id={`${provider.id}-key`}
                    type={isVisible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${provider.name} API Key`}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                 <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={isVisible ? `Hide ${provider.name} API Key` : `Show ${provider.name} API Key`}
                  >
                    {isVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
            </div>
            <div className="pl-1 space-y-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Required for connecting to {provider.name}.
                </p>
                {helperText && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, providers }) => {
    const relevantProviders = providers.filter(p => ['openai', 'anthropic', 'perplexity'].includes(p.id));

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-key-modal-title"
        >
            <div className="relative bg-white dark:bg-[#0d1426] text-slate-800 dark:text-slate-200 rounded-xl shadow-2xl w-full max-w-md m-4 border border-slate-200 dark:border-slate-800">
                <button 
                    onClick={onClose} 
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors z-10"
                    aria-label="Close API Key modal"
                >
                    <XIcon className="h-6 w-6" />
                </button>
                
                {/* Header */}
                <div className="flex items-center gap-4 p-6">
                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-teal-900/80 rounded-lg text-teal-400">
                       <KeyIcon className="w-6 h-6" />
                    </div>
                    <h2 id="api-key-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Manage API Keys
                    </h2>
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800"></div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {relevantProviders.map(provider => (
                        <ApiKeyInput key={provider.id} provider={provider} />
                    ))}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                           Notice: API keys are stored locally in your browser and are never transmitted to any server.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-[#0d1426] px-6 py-4 flex items-center justify-end gap-4 rounded-b-xl">
                    <Button onClick={onClose} variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-700 dark:text-slate-200" size="md">
                        Cancel
                    </Button>
                    <Button onClick={onClose} variant="teal" size="md">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};