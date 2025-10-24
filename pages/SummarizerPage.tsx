import React, { useState } from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UploadCloudIcon, LoaderIcon, Wand2Icon, ChevronLeftIcon } from '../components/Icons';
import { useToast } from '../contexts/ToastContext';
import { analyzeFile } from '../services/aiService';

export const SummarizerPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [keyPoints, setKeyPoints] = useState<string[]>([]);
    const { addToast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSummary(null);
            setKeyPoints([]);
        }
    };

    const handleSummarize = async () => {
        if (!file) {
            addToast('Please select a file to summarize.', 'error');
            return;
        }
        setIsLoading(true);
        setSummary(null);
        setKeyPoints([]);

        try {
            const result = await analyzeFile(file, 'gemini-2.5-flash', false);
            const parsed = JSON.parse(result.analysis);
            if (parsed.summary && parsed.key_points) {
                setSummary(parsed.summary);
                setKeyPoints(parsed.key_points);
            } else {
                setSummary(result.analysis); // Fallback for non-JSON or different structure
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            addToast(`Summarization failed: ${msg}`, 'error');
            setSummary(`Error: ${msg}`);
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
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">AI Summarizer</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">Upload any document to get a quick summary and key takeaways.</p>
                    </header>

                    <Card className="p-6">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <UploadCloudIcon className="w-12 h-12 mx-auto text-slate-400" />
                            <p className="mt-4 font-semibold text-teal-600 dark:text-teal-400">
                                {file ? file.name : 'Click to select a file'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">PDF, TXT, DOCX up to 10MB</p>
                            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.txt,.docx" onChange={handleFileChange} />
                        </div>
                        <Button onClick={handleSummarize} isLoading={isLoading} disabled={!file} variant="teal-gradient" size="lg" className="w-full mt-6 gap-2">
                            <Wand2Icon className="w-5 h-5" />
                            Summarize
                        </Button>
                    </Card>

                    {(isLoading || summary) && (
                        <Card className="p-8 mt-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center p-10">
                                    <LoaderIcon className="w-10 h-10 animate-spin text-teal-500" />
                                    <p className="mt-4 text-slate-500 dark:text-slate-400">Generating summary...</p>
                                </div>
                            ) : (
                                summary && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Summary</h2>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
                                        {keyPoints.length > 0 && (
                                            <>
                                                <h3 className="text-xl font-bold mt-6 mb-3">Key Points</h3>
                                                <ul className="space-y-2 list-disc list-inside">
                                                    {keyPoints.map((point, index) => (
                                                        <li key={index} className="text-slate-700 dark:text-slate-300">{point}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
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
