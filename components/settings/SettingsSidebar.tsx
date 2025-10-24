import React from 'react';
import { Page } from '../../App';
import { SettingsTab } from '../../pages/SettingsPage';
import { 
    UserCircleIcon, SlidersHorizontalIcon, BellIcon, LinkIcon, HeartIcon, SettingsIcon, 
    UsersIcon, CreditCardIcon, BarChart2Icon, KeyIcon, CodeXmlIcon, ChevronLeftIcon, BriefcaseIcon,
    SparklesIcon
} from '../Icons';

interface SettingsSidebarProps {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
    navigateTo: (page: Page) => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    tab: SettingsTab;
    activeTab: SettingsTab;
    onClick: (tab: SettingsTab) => void;
    disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, tab, activeTab, onClick, disabled = false }) => {
    const isActive = activeTab === tab;
    return (
        <button
            onClick={() => onClick(tab)}
            disabled={disabled}
            className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</h3>
);

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab, navigateTo }) => {
    const navItems = {
        account: [
            { icon: <UserCircleIcon className="w-5 h-5" />, label: "Account", tab: "account" as SettingsTab },
            { icon: <SlidersHorizontalIcon className="w-5 h-5" />, label: "Preferences", tab: "preferences" as SettingsTab },
            { icon: <BellIcon className="w-5 h-5" />, label: "Notifications", tab: "notifications" as SettingsTab },
        ],
        api: [
            { icon: <BriefcaseIcon className="w-5 h-5" />, label: "API group", tab: "api-group" as SettingsTab },
            { icon: <UsersIcon className="w-5 h-5" />, label: "API members", tab: "api-members" as SettingsTab },
            { icon: <CreditCardIcon className="w-5 h-5" />, label: "API billing", tab: "api-billing" as SettingsTab },
            { icon: <BarChart2Icon className="w-5 h-5" />, label: "Usage metrics", tab: "usage-metrics" as SettingsTab, disabled: false },
            { icon: <KeyIcon className="w-5 h-5" />, label: "API keys", tab: "api-keys" as SettingsTab },
            { icon: <KeyIcon className="w-5 h-5" />, label: "Third-Party keys", tab: "third-party-keys" as SettingsTab },
        ],
        system: [
             { icon: <SparklesIcon className="w-5 h-5" />, label: "Pro Perks", tab: "pro-perks" as SettingsTab },
             { icon: <SettingsIcon className="w-5 h-5" />, label: "All settings", tab: "all-settings" as SettingsTab },
        ]
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-50 dark:bg-[#121212] border-r border-slate-200 dark:border-slate-800 flex flex-col p-4">
            <button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Back</span>
            </button>
            <div className="flex-grow overflow-y-auto space-y-4">
                <div>
                    <SectionTitle>Account</SectionTitle>
                    <div className="space-y-1">
                        {navItems.account.map(item => <NavItem key={item.label} {...item} activeTab={activeTab} onClick={setActiveTab} />)}
                    </div>
                </div>
                <div>
                    <SectionTitle>API</SectionTitle>
                     <div className="space-y-1">
                        {navItems.api.map(item => (
                            <NavItem key={item.label} {...item} activeTab={activeTab} onClick={setActiveTab} />
                        ))}
                    </div>
                </div>
                <hr className="border-slate-200 dark:border-slate-800" />
                <div className="space-y-1">
                    {navItems.system.map(item => <NavItem key={item.label} {...item} activeTab={activeTab} onClick={setActiveTab} />)}
                </div>
            </div>
        </aside>
    );
};