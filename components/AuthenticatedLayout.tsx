import React, { useState } from 'react';
import { Page } from '../App';
import { LogoIcon, KeyIcon, UserCircleIcon, BarChartIcon, MessageSquareIcon } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import { ApiKeyModal } from './ApiKeyModal';
import { ProfileModal } from './ProfileModal';
import { LLM_PROVIDERS } from '../lib/models';
import { useAuth } from '../contexts/AuthContext';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    navigateTo: (page: Page) => void;
    currentPage: Page;
}

const SidebarNavLink: React.FC<{ page: Page, currentPage: Page, navigateTo: (page: Page) => void, icon: React.ReactNode, children: React.ReactNode }> = ({ page, currentPage, navigateTo, icon, children }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => navigateTo(page)}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-slate-200/60 text-slate-900 dark:bg-slate-800 dark:text-slate-100' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
        >
            {icon}
            {children}
        </button>
    );
};

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, navigateTo, currentPage }) => {
    const { user } = useAuth();
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const activeProviders = LLM_PROVIDERS.filter(p => p.active);

    return (
        <>
            <div className="flex h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                {/* --- Sidebar --- */}
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col">
                    {/* Logo and App Name */}
                    <div className="h-16 flex-shrink-0 px-4 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800">
                        <LogoIcon className="h-8 w-8 text-teal-600" />
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Prism AI</h1>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <SidebarNavLink page="dashboard" currentPage={currentPage} navigateTo={navigateTo} icon={<BarChartIcon className="w-5 h-5" />}>Dashboard</SidebarNavLink>
                        <SidebarNavLink page="chat" currentPage={currentPage} navigateTo={navigateTo} icon={<MessageSquareIcon className="w-5 h-5" />}>Chat</SidebarNavLink>
                    </nav>

                    {/* Bottom Section: Settings & Profile */}
                    <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Theme</span>
                            <ThemeToggle />
                        </div>
                        <button onClick={() => setIsApiKeyModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors">
                            <KeyIcon className="w-5 h-5" />
                            <span>API Keys</span>
                        </button>
                        <button onClick={() => setIsProfileModalOpen(true)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors">
                           <UserCircleIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                           <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{user?.email || 'Account'}</span>
                        </button>
                    </div>
                </aside>
                
                {/* --- Main Content --- */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto dashboard-bg">
                        {children}
                    </main>
                </div>
            </div>

            {isApiKeyModalOpen && <ApiKeyModal onClose={() => setIsApiKeyModalOpen(false)} providers={activeProviders.filter(p => p.id !== 'google')} />}
            {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
        </>
    );
};