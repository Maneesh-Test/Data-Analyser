import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../App';
import { UserCircleIcon, LogOutIcon, ChevronUpIcon, SettingsIcon, MessageSquareIcon } from './Icons';

interface AccountPopoverProps {
  navigateTo: (page: Page) => void;
  currentPage: Page;
}

export const AccountPopover: React.FC<AccountPopoverProps> = ({ navigateTo, currentPage }) => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    
    const handleNavigation = (page: Page) => {
        navigateTo(page);
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) {
        return null;
    }

    return (
        <div ref={popoverRef} className="relative">
            {isOpen && (
                <div 
                    className="absolute bottom-full left-0 right-0 mb-2 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2 animate-slide-up-fade-in"
                    style={{ animationDuration: '0.2s' }}
                >
                    <div className="p-2">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Prism AI User</p>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                    <nav className="flex flex-col p-1 space-y-1">
                         <button onClick={() => handleNavigation('chat')} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-left w-full">
                            <MessageSquareIcon className="w-4 h-4" />
                            <span>Chat</span>
                        </button>
                         <button onClick={() => handleNavigation('settings')} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-left w-full">
                            <SettingsIcon className="w-4 h-4" />
                            <span>Settings</span>
                        </button>
                    </nav>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                    <div className="p-1">
                        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors text-left w-full">
                            <LogOutIcon className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <UserCircleIcon className="w-6 h-6" />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user.email.split('@')[0]}</p>
                </div>
                <ChevronUpIcon className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
        </div>
    );
};
