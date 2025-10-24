import React from 'react';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, CpuIcon } from '../Icons';

export const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const themes: { name: Theme, label: string; icon: React.ReactNode }[] = [
        { name: 'light', label: 'Light', icon: <SunIcon className="w-5 h-5" /> },
        { name: 'dark', label: 'Dark', icon: <MoonIcon className="w-5 h-5" /> },
        { name: 'system', label: 'System', icon: <CpuIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-700/50 rounded-lg">
            {themes.map(t => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`flex items-center justify-center gap-2 w-24 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        theme === t.name
                        ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-200'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    {t.icon}
                    <span>{t.label}</span>
                </button>
            ))}
        </div>
    );
};
