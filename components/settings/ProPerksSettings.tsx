import React from 'react';
import { Page } from '../../App';
import { Button } from '../Button';
import { Card } from '../Card';
import { CpuIcon, SparklesIcon, BarChart2Icon, UserCircleIcon } from '../Icons';

interface ProPerksSettingsProps {
    navigateTo: (page: Page) => void;
}

const PerkCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <Card className="p-6 text-center flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">{description}</p>
    </Card>
);

export const ProPerksSettings: React.FC<ProPerksSettingsProps> = ({ navigateTo }) => {
    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Unlock Your Pro Perks ✨</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                    Upgrade to Pro to access our most powerful features, higher limits, and priority support.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                <PerkCard
                    icon={<CpuIcon className="w-6 h-6" />}
                    title="Priority Access to New Models"
                    description="Be the first to experience our latest and most advanced AI models as soon as they are released."
                />
                <PerkCard
                    icon={<SparklesIcon className="w-6 h-6" />}
                    title="Enhanced AI Capabilities"
                    description="Enable 'Thinking Mode' with Gemini 2.5 Pro for deeper, more reasoned analysis on complex tasks."
                />
                <PerkCard
                    icon={<BarChart2Icon className="w-6 h-6" />}
                    title="Higher Usage Limits"
                    description="Analyze hundreds of files per month with significantly increased quotas for all your projects."
                />
                <PerkCard
                    icon={<UserCircleIcon className="w-6 h-6" />}
                    title="Priority Support"
                    description="Get faster responses from our dedicated support team via email and live chat."
                />
            </div>
            
            <div className="mt-12 text-center">
                <Button onClick={() => navigateTo('pricing')} variant="teal-gradient" size="lg">
                    Upgrade to Pro
                </Button>
            </div>
        </div>
    );
};
