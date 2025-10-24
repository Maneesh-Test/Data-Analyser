import React, { useState } from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { ThemeSelector } from './ThemeSelector';
import { ModelSelectionModal } from './ModelSelectionModal';
import { ArrowRightIcon } from '../Icons';
import { Model } from '../../lib/models';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-b border-slate-200 dark:border-slate-700/50 pb-8 mb-8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

const SettingRow: React.FC<{ 
    label: string; 
    description: string; 
    children: React.ReactNode;
    htmlFor?: string;
}> = ({ label, description, children, htmlFor }) => (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="max-w-md">
             <label htmlFor={htmlFor} className="text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">{label}</label>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto flex justify-start sm:justify-end">{children}</div>
    </div>
);

const SettingSelect: React.FC<{value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({ value, onChange, children }) => (
    <select 
        value={value}
        onChange={onChange}
        className="w-full sm:w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500 transition-colors"
    >
        {children}
    </select>
);


export const PreferencesSettings: React.FC = () => {
    const { preferences, setPreference } = usePreferences();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModelSelect = (model: Model) => {
        setPreference('aiModel', model);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-8 md:p-12">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">Preferences</h1>
                
                <SettingsSection title="General">
                    <SettingRow label="Appearance" description="How Prism AI looks on your device.">
                        <ThemeSelector />
                    </SettingRow>
                    <SettingRow label="Language" description="The language used in the user interface.">
                        <SettingSelect value={preferences.language} onChange={(e) => setPreference('language', e.target.value)}>
                            <option value="en">English</option>
                            <option value="es" disabled>Spanish</option>
                            <option value="fr" disabled>French</option>
                        </SettingSelect>
                    </SettingRow>
                    <SettingRow label="Preferred response language" description="The language used for AI responses.">
                         <SettingSelect value={preferences.responseLanguage} onChange={(e) => setPreference('responseLanguage', e.target.value)}>
                            <option value="detect">Automatic (detect input)</option>
                            <option value="en">English</option>
                            <option value="es" disabled>Spanish</option>
                            <option value="fr" disabled>French</option>
                        </SettingSelect>
                    </SettingRow>
                    <SettingRow htmlFor="autosuggest" label="Autosuggest" description="Enable dropdown and tab-complete suggestions while typing a query.">
                        <Switch id="autosuggest" checked={preferences.autosuggest} onChange={(e) => setPreference('autosuggest', e.target.checked)} />
                    </SettingRow>
                    <SettingRow htmlFor="homepage-widgets" label="Homepage widgets" description="Enable personalized widgets on the homepage.">
                        <Switch id="homepage-widgets" checked={preferences.homepageWidgets} onChange={(e) => setPreference('homepageWidgets', e.target.checked)} />
                    </SettingRow>
                </SettingsSection>

                <SettingsSection title="Artificial Intelligence">
                    <SettingRow label="Model" description="The default model used for generating responses and analysis.">
                        <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 gap-2 w-full sm:w-auto justify-between">
                           <span>{preferences.aiModel?.name || 'Choose model'}</span>
                           <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                    </SettingRow>
                    <SettingRow label="Image generation model" description="The model used for generating images from prompts.">
                        <SettingSelect value={preferences.imageModel} onChange={(e) => setPreference('imageModel', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="dall-e-3" disabled>DALL-E 3</option>
                            <option value="imagen-2" disabled>Imagen 2</option>
                        </SettingSelect>
                    </SettingRow>
                    <SettingRow htmlFor="data-retention" label="AI data retention" description="Allow Prism AI to use your searches to improve our models. Turn this off if you wish to exclude your data from this process.">
                        <Switch id="data-retention" checked={preferences.aiDataRetention} onChange={(e) => setPreference('aiDataRetention', e.target.checked)} />
                    </SettingRow>
                </SettingsSection>
            </div>
            <ModelSelectionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentModel={preferences.aiModel}
                onSelectModel={handleModelSelect}
            />
        </>
    );
};