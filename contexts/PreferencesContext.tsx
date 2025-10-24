import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Model, LLM_PROVIDERS } from '../lib/models';

interface Preferences {
    language: string;
    responseLanguage: string;
    autosuggest: boolean;
    homepageWidgets: boolean;
    aiModel: Model | null;
    imageModel: string;
    aiDataRetention: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const defaultModel = LLM_PROVIDERS.find(p => p.id === 'google')?.models.find(m => m.id === 'gemini-2.5-flash') || LLM_PROVIDERS[0]?.models[0] || null;

const defaultPreferences: Preferences = {
    language: 'en',
    responseLanguage: 'detect',
    autosuggest: true,
    homepageWidgets: true,
    aiModel: defaultModel,
    imageModel: 'default',
    aiDataRetention: true,
};

const STORAGE_KEY = 'prism_ai_preferences';

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<Preferences>(() => {
        try {
            const storedItem = localStorage.getItem(STORAGE_KEY);
            if (storedItem) {
                return { ...defaultPreferences, ...JSON.parse(storedItem) };
            }
        } catch (error) {
            console.error('Error parsing preferences from localStorage', error);
        }
        return defaultPreferences;
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving preferences to localStorage', error);
        }
    }, [preferences]);

    const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    }, []);

    return (
        <PreferencesContext.Provider value={{ preferences, setPreference }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
