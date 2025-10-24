import React from 'react';
import { SettingsTab } from '../../pages/SettingsPage';
import { Card } from '../Card';
import { 
    UserCircleIcon, SlidersHorizontalIcon, BellIcon, KeyIcon, BriefcaseIcon, 
    UsersIcon, CreditCardIcon, BarChart2Icon, SparklesIcon, ChevronRightIcon 
} from '../Icons';

interface AllSettingsProps {
    setActiveTab: (tab: SettingsTab) => void;
}

const settingsLinks = [
    {
        category: 'Account',
        items: [
            { tab: 'account' as SettingsTab, icon: <UserCircleIcon className="w-5 h-5" />, title: 'Account', description: 'Manage your personal information and account security.' },
            { tab: 'preferences' as SettingsTab, icon: <SlidersHorizontalIcon className="w-5 h-5" />, title: 'Preferences', description: 'Customize the application appearance and language.' },
            { tab: 'notifications' as SettingsTab, icon: <BellIcon className="w-5 h-5" />, title: 'Notifications', description: 'Choose how you receive updates and alerts.' },
        ],
    },
    {
        category: 'API',
        items: [
            { tab: 'api-group' as SettingsTab, icon: <BriefcaseIcon className="w-5 h-5" />, title: 'API Group', description: 'Organize members into groups for access control.' },
            { tab: 'api-members' as SettingsTab, icon: <UsersIcon className="w-5 h-5" />, title: 'API Members', description: 'Invite and manage team members.' },
            { tab: 'api-billing' as SettingsTab, icon: <CreditCardIcon className="w-5 h-5" />, title: 'API Billing', description: 'View your subscription and billing history.' },
            { tab: 'usage-metrics' as SettingsTab, icon: <BarChart2Icon className="w-5 h-5" />, title: 'Usage Metrics', description: 'Monitor your API usage and performance.' },
            { tab: 'api-keys' as SettingsTab, icon: <KeyIcon className="w-5 h-5" />, title: 'API Keys', description: 'Generate and manage your personal API keys.' },
            { tab: 'third-party-keys' as SettingsTab, icon: <KeyIcon className="w-5 h-5" />, title: 'Third-Party Keys', description: 'Manage keys for services like OpenAI.' },
        ],
    },
    {
        category: 'System',
        items: [
             { tab: 'pro-perks' as SettingsTab, icon: <SparklesIcon className="w-5 h-5" />, title: 'Pro Perks', description: 'Explore the benefits of our Pro plan.' },
        ]
    }
];

export const AllSettings: React.FC<AllSettingsProps> = ({ setActiveTab }) => {
    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">All Settings</h1>

            <div className="space-y-10">
                {settingsLinks.map(section => (
                    <div key={section.category}>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">{section.category}</h2>
                        <Card className="p-2">
                             <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                                {section.items.map(item => (
                                    <button 
                                        key={item.tab}
                                        onClick={() => setActiveTab(item.tab)}
                                        className="w-full flex items-center justify-between text-left p-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors rounded-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-slate-500 dark:text-slate-400">{item.icon}</div>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{item.title}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};
