import React, { useState } from 'react';
import { Page } from '../App';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';
import { AccountSettings } from '../components/settings/AccountSettings';
import { PreferencesSettings } from '../components/settings/PreferencesSettings';
import { ThirdPartyKeysSettings } from '../components/settings/ThirdPartyKeysSettings';
import { ApiKeysSettings } from '../components/settings/ApiKeysSettings';
import { ApiGroupSettings } from '../components/settings/ApiGroupSettings';
import { ApiMembersSettings } from '../components/settings/ApiMembersSettings';
import { ApiBillingSettings } from '../components/settings/ApiBillingSettings';
import { ApiUsageSettings } from '../components/settings/ApiUsageSettings';
import { NotificationsSettings } from '../components/settings/NotificationsSettings';
import { ProPerksSettings } from '../components/settings/ProPerksSettings';
import { AllSettings } from '../components/settings/AllSettings';
import { ChevronDownIcon } from '../components/Icons';


export type SettingsTab = 
    'account' | 'preferences' | 'notifications' | 'third-party-keys' | 
    'api-group' | 'api-members' | 'api-billing' | 'api-keys' | 'usage-metrics' |
    'pro-perks' | 'all-settings';

interface SettingsPageProps {
  navigateTo: (page: Page) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ navigateTo }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <AccountSettings navigateTo={navigateTo} />;
            case 'preferences':
                return <PreferencesSettings />;
            case 'notifications':
                return <NotificationsSettings />;
            case 'third-party-keys':
                return <ThirdPartyKeysSettings />;
            case 'api-keys':
                return <ApiKeysSettings />;
            case 'api-group':
                return <ApiGroupSettings />;
            case 'api-members':
                return <ApiMembersSettings />;
            case 'api-billing':
                return <ApiBillingSettings />;
            case 'usage-metrics':
                return <ApiUsageSettings />;
            case 'pro-perks':
                return <ProPerksSettings navigateTo={navigateTo} />;
            case 'all-settings':
                return <AllSettings setActiveTab={setActiveTab} />;
            default:
                return <AccountSettings navigateTo={navigateTo} />;
        }
    };

    const allTabs: { category: string, items: { label: string, tab: SettingsTab, disabled?: boolean }[] }[] = [
      {
        category: 'Account',
        items: [
          { label: "Account", tab: "account" },
          { label: "Preferences", tab: "preferences" },
          { label: "Notifications", tab: "notifications" },
        ]
      },
      {
        category: 'API',
        items: [
          { label: "API group", tab: "api-group" },
          { label: "API members", tab: "api-members" },
          { label: "API billing", tab: "api-billing" },
          { label: "Usage metrics", tab: "usage-metrics" },
          { label: "API keys", tab: "api-keys" },
          { label: "Third-Party keys", tab: "third-party-keys" },
        ]
      },
       {
        category: 'System',
        items: [
          { label: "Pro Perks", tab: "pro-perks" },
          { label: "All settings", tab: "all-settings" },
        ]
      }
    ];

    return (
        <div className="flex h-full text-slate-800 dark:text-slate-300 bg-white dark:bg-[#1C1C1C]">
            <div className="hidden lg:block">
                <SettingsSidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    navigateTo={navigateTo}
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                {/* Mobile Dropdown Header */}
                <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-[#1C1C1C]/80 backdrop-blur-md z-10">
                    <div className="relative">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
                            className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                            aria-label="Settings navigation"
                        >
                           {allTabs.map(group => (
                               <optgroup key={group.category} label={group.category}>
                                   {group.items.map(item => (
                                       <option key={item.tab} value={item.tab} disabled={item.disabled}>
                                           {item.label}
                                       </option>
                                   ))}
                               </optgroup>
                           ))}
                        </select>
                        <ChevronDownIcon className="w-5 h-5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};