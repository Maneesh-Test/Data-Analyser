import React from 'react';
import { LLMProvider, Model } from '../lib/models';

interface ModelSelectorProps {
  providers: LLMProvider[];
  selectedModel: Model | null;
  onSelectModel: (model: Model) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ providers, selectedModel, onSelectModel, disabled = false }) => {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    if (!modelId) return;

    for (const provider of providers) {
      const model = provider.models.find(m => m.id === modelId);
      if (model) {
        onSelectModel(model);
        return;
      }
    }
  };

  return (
    <select
      id="model-selector"
      value={selectedModel?.id || ''}
      onChange={handleSelectionChange}
      disabled={disabled}
      className="block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500 transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
    >
      <option value="" disabled>
        {selectedModel ? 'Change model...' : 'Select a model...'}
      </option>
      {providers.map(provider => (
        <optgroup key={provider.id} label={provider.name}>
          {provider.models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};