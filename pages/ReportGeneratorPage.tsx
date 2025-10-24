import React, { useState } from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoaderIcon, Wand2Icon, ChevronLeftIcon } from '../components/Icons';
import { useToast } from '../contexts/ToastContext';
import { generateReport } from '../services/aiService';

// A simple markdown renderer component
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 my-4">$1</ul>')
        .replace(/\n/g, '<br />');

    return <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export const ReportGeneratorPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    const [topic, setTopic] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [audience, setAudience] = useState('A general audience');
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<string | null>(null);
    const { addToast } = useToast();

    const handleGenerate = async () => {
        if (!topic.trim()) {
            addToast('Please enter a topic for the report.', 'error');
            return;
        }
        setIsLoading(true);
        setReport(null);

        try {
            const result = await generateReport(topic, keyPoints, audience);
            setReport(result);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            addToast(`Report generation failed: ${msg}`, 'error');
            setReport(`Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

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

                    <header className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">AI Report Generator</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">Create professional reports from a few key points.</p>
                    </header>

                    <Card className="p-6 space-y-4">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                            <input type="text" id="topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Q3 Sales Performance Analysis" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="key-points" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Points to Include</label>
                            <textarea id="key-points" value={keyPoints} onChange={e => setKeyPoints(e.target.value)} placeholder="- 15% growth in North America&#10;- New product line exceeded expectations&#10;- Marketing spend was 10% under budget" rows={4} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="audience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                            <input type="text" id="audience" value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2" />
                        </div>
                        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!topic} variant="teal-gradient" size="lg" className="w-full gap-2">
                            <Wand2Icon className="w-5 h-5" />
                            Generate Report
                        </Button>
                    </Card>

                     {(isLoading || report) && (
                        <Card className="p-8 mt-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center p-10">
                                    <LoaderIcon className="w-10 h-10 animate-spin text-teal-500" />
                                    <p className="mt-4 text-slate-500 dark:text-slate-400">Generating report...</p>
                                </div>
                            ) : (
                                report && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">Generated Report</h2>
                                        <MarkdownRenderer content={report} />
                                    </div>
                                )
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
