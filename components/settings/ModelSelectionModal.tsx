import React from 'react';
import { LLM_PROVIDERS, Model } from '../../lib/models';
import { XIcon, CheckIcon } from '../Icons';

interface ModelSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentModel: Model | null;
    onSelectModel: (model: Model) => void;
}

export const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({ isOpen, onClose, currentModel, onSelectModel }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="model-selection-title"
            onClick={onClose}
        >
            <div 
                className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 animate-slide-up-fade-in"
                style={{animationDuration: '0.3s'}}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="model-selection-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                        Select AI Model
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose the default model for analysis and chat.</p>
                     <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {LLM_PROVIDERS.filter(p => p.active).map(provider => (
                        <div key={provider.id} className="p-2">
                            <h3 className="px-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{provider.name}</h3>
                            <div className="space-y-1">
                                {provider.models.filter(m => m.active).map(model => (
                                    <button 
                                        key={model.id}
                                        onClick={() => onSelectModel(model)}
                                        className="w-full flex items-start text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                    >
                                        <div className="flex-grow">
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{model.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{model.description}</p>
                                        </div>
                                        {currentModel?.id === model.id && (
                                            <CheckIcon className="w-5 h-5 text-teal-500 ml-4 mt-1 flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};