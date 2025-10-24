import React, { useState } from 'react';
import { Button } from '../Button';
import { ApiKeyModal } from '../ApiKeyModal';
import { LLM_PROVIDERS } from '../../lib/models';

export const ThirdPartyKeysSettings: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const activeProviders = LLM_PROVIDERS.filter(p => p.active);

    return (
        <>
            <div className="max-w-4xl mx-auto p-8 md:p-12">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Third-Party Keys</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10">
                    Manage your API keys for third-party services. Keys are stored securely in your browser's local storage and are never sent to our servers.
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Third-Party AI Providers</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your keys to use models from providers like OpenAI and Anthropic.</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto">
                            Manage API Keys
                        </Button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ApiKeyModal
                    onClose={() => setIsModalOpen(false)}
                    providers={activeProviders}
                />
            )}
        </>
    );
};