import React from 'react';
import { Button } from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircleIcon } from '../Icons';
import { Page } from '../../App';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

const SettingsRow: React.FC<{ label: string; value?: string; children: React.ReactNode }> = ({ label, value, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            {value && <p className="text-base text-slate-800 dark:text-slate-200 mt-1 truncate">{value}</p>}
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">{children}</div>
    </div>
);

interface AccountSettingsProps {
  navigateTo: (page: Page) => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ navigateTo }) => {
    const { user, logout } = useAuth();
    
    // Placeholder data
    const fullName = user?.email.split('@')[0] || 'User';
    const username = fullName.toLowerCase().replace(' ', '');

    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">Account</h1>
            
            <div className="space-y-12">
                {/* --- Account Section --- */}
                <SettingsSection title="Account">
                    <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-medium flex-shrink-0">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{fullName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{username}</p>
                        </div>
                        <div className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
                            <Button variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto">Change avatar</Button>
                        </div>
                    </div>
                    <SettingsRow label="Full Name" value={fullName}>
                        <Button variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto">Change full name</Button>
                    </SettingsRow>
                    <SettingsRow label="Username" value={username}>
                        <Button variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto">Change username</Button>
                    </SettingsRow>
                    <SettingsRow label="Email" value={user?.email}>
                        {/* Email change is typically more complex, so button is disabled */}
                        <Button variant="secondary" className="dark:bg-slate-700 w-full sm:w-auto" disabled>Change email</Button>
                    </SettingsRow>
                </SettingsSection>

                {/* --- Subscription Section --- */}
                <SettingsSection title="Your Subscription">
                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 gap-4">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Thanks for subscribing to Prism AI!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore your new Pro features. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('settings'); }} className="text-teal-500 hover:underline">Learn more</a></p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                            <Button onClick={() => navigateTo('pricing')} variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 flex-1 sm:flex-none">Manage plan</Button>
                            <Button onClick={() => navigateTo('pricing')} variant="teal" className="flex-1 sm:flex-none">Upgrade plan</Button>
                        </div>
                    </div>
                </SettingsSection>

                {/* --- System Section --- */}
                <SettingsSection title="System">
                    <SettingsRow label="Support">
                        <Button variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto">Contact</Button>
                    </SettingsRow>
                    <SettingsRow label="You are signed in as" value={username}>
                        <Button variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto" onClick={logout}>Sign out</Button>
                    </SettingsRow>
                    <SettingsRow label="Sign out of all sessions">
                        <Button variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto" disabled>Sign out of all sessions</Button>
                    </SettingsRow>
                    <SettingsRow label="Delete account">
                        <Button variant="secondary" className="border-red-500/50 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 w-full sm:w-auto" disabled>Permanently delete</Button>
                    </SettingsRow>
                </SettingsSection>
            </div>
        </div>
    );
};