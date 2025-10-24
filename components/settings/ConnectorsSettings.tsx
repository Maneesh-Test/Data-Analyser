import React from 'react';
import { Button } from '../Button';
import { GmailIcon, WhatsAppIcon, OutlookIcon, GoogleDriveIcon, DropboxIcon, LinearIcon, NotionIcon, GitHubIcon, SlackIcon } from '../Icons';

interface Connector {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'Connected' | 'Linked' | 'Available';
}

const connectors: Connector[] = [
    { name: 'Gmail with Calendar', description: 'Search, create, and manage your emails and calendar events', icon: <GmailIcon />, status: 'Connected' },
    { name: 'WhatsApp', description: 'Connect your Prism AI account to WhatsApp', icon: <WhatsAppIcon />, status: 'Linked' },
    { name: 'Outlook', description: 'Search your emails and calendar events', icon: <OutlookIcon />, status: 'Available' },
    { name: 'Google Drive', description: 'Get in-depth answers from your Google Drive content', icon: <GoogleDriveIcon />, status: 'Available' },
    { name: 'Dropbox', description: 'Get in-depth answers from your Dropbox content', icon: <DropboxIcon />, status: 'Available' },
    { name: 'Linear', description: 'Plan and track projects, issues, and team workflows in Linear', icon: <LinearIcon />, status: 'Available' },
    { name: 'Notion', description: 'Search and create content on your Notion pages', icon: <NotionIcon />, status: 'Available' },
    { name: 'GitHub', description: 'Search and manage your GitHub repositories', icon: <GitHubIcon />, status: 'Available' },
    { name: 'Slack', description: 'Search and post messages across your Slack workspace', icon: <SlackIcon />, status: 'Available' },
];

const ConnectorRow: React.FC<{ connector: Connector }> = ({ connector }) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center">
                {connector.icon}
            </div>
            <div>
                <h3 className="font-medium text-slate-800 dark:text-slate-200">{connector.name}</h3>
                <p className="text-base text-slate-500 dark:text-slate-400">{connector.description}</p>
            </div>
        </div>
        <div>
            {connector.status === 'Available' ? (
                <Button variant="secondary" size="sm">Enable</Button>
            ) : (
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{connector.status}</span>
            )}
        </div>
    </div>
);

export const ConnectorsSettings: React.FC = () => {
    const installed = connectors.filter(c => c.status !== 'Available');
    const available = connectors.filter(c => c.status === 'Available');

    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Installed Connectors</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Connected tools provide Prism AI with richer and more accurate answers, gated by permissions you have granted.</p>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {installed.map(connector => (
                    <ConnectorRow key={connector.name} connector={connector} />
                ))}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 mt-12">Available Connectors</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Connect your tools to Prism AI to search across them and take action. Your permissions are always respected.</p>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {available.map(connector => (
                    <ConnectorRow key={connector.name} connector={connector} />
                ))}
            </div>
        </div>
    );
};