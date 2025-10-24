import React from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeftIcon, UsersIcon, MessageSquareIcon } from '../components/Icons';

export const CollaborationPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-950">
            <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Button onClick={() => navigateTo('dashboard')} variant="ghost" className="pl-1 text-sm">
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            Back to Dashboard
                        </Button>
                    </div>

                    <header className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">Collaboration Hub</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">Share insights, not just data. Work together with your team in real-time.</p>
                    </header>

                    <Card className="p-8 text-center">
                        <h2 className="text-3xl font-bold text-teal-500 mb-4">Coming Soon!</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            We're building powerful new features to help you collaborate seamlessly. Securely share your analysis, chat conversations, and datasets with your team, manage permissions, and work together to uncover deeper insights.
                        </p>
                        <div className="mt-10 grid md:grid-cols-2 gap-8 text-left">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-300">
                                    <UsersIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Dataset Sharing</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Share datasets with colleagues and control access with granular permissions.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-300">
                                    <MessageSquareIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Chat Sharing</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate secure links to share entire chat conversations and their context.</p>
                                </div>
                            </div>
                        </div>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mt-10">Stay tuned for updates!</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
