import React, { useState } from 'react';
import { Switch } from '../Switch';

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="border-b border-slate-200 dark:border-slate-700/50 pb-8 mb-8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        <div className="mt-6 space-y-6">{children}</div>
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

export const NotificationsSettings: React.FC = () => {
    const [emailSettings, setEmailSettings] = useState({
        productUpdates: true,
        weeklySummary: false,
        securityAlerts: true,
    });

    const handleEmailChange = (key: keyof typeof emailSettings) => {
        setEmailSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">Notifications</h1>

            <SettingsSection
                title="Email Notifications"
                description="Choose which emails you want to receive."
            >
                <SettingRow
                    htmlFor="product-updates"
                    label="Product Updates"
                    description="Receive emails about new features, product updates, and special offers."
                >
                    <Switch
                        id="product-updates"
                        checked={emailSettings.productUpdates}
                        onChange={() => handleEmailChange('productUpdates')}
                    />
                </SettingRow>
                <SettingRow
                    htmlFor="weekly-summary"
                    label="Weekly Summary"
                    description="Get a weekly digest of your analysis activity and insights."
                >
                    <Switch
                        id="weekly-summary"
                        checked={emailSettings.weeklySummary}
                        onChange={() => handleEmailChange('weeklySummary')}
                    />
                </SettingRow>
                 <SettingRow
                    htmlFor="security-alerts"
                    label="Security Alerts"
                    description="Be notified about important security events, like new logins to your account."
                >
                    <Switch
                        id="security-alerts"
                        checked={emailSettings.securityAlerts}
                        onChange={() => handleEmailChange('securityAlerts')}
                    />
                </SettingRow>
            </SettingsSection>
            
            <SettingsSection
                title="Push Notifications"
                description="Get notified in-app and on your device. (Coming soon)"
            >
                 <SettingRow
                    htmlFor="analysis-complete"
                    label="Analysis Complete"
                    description="Get a push notification when a file analysis is complete."
                >
                    <Switch
                        id="analysis-complete"
                        checked={false}
                        disabled
                    />
                </SettingRow>
                 <SettingRow
                    htmlFor="mentions"
                    label="Mentions"
                    description="Receive notifications when someone mentions you in a shared chat."
                >
                    <Switch
                        id="mentions"
                        checked={false}
                        disabled
                    />
                </SettingRow>
            </SettingsSection>
        </div>
    );
};