import React, { useState, useRef } from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoaderIcon, Wand2Icon, ChevronLeftIcon, UploadCloudIcon, DownloadIcon } from '../components/Icons';
import { useToast } from '../contexts/ToastContext';
import { cleanCsvData } from '../services/aiService';
import { downloadTextFile } from '../utils/fileUtils';

export const DataCleaningPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [instructions, setInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ summary: string; cleanedCsv: string } | null>(null);
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv') {
                addToast('Please upload a valid CSV file.', 'error');
                return;
            }
            setFile(selectedFile);
            setResult(null);
            const reader = new FileReader();
            reader.onload = (e) => setFileContent(e.target?.result as string);
            reader.readAsText(selectedFile);
        }
    };

    const handleClean = async () => {
        if (!fileContent) {
            addToast('Please upload a CSV file.', 'error');
            return;
        }
        if (!instructions.trim()) {
            addToast('Please provide cleaning instructions.', 'error');
            return;
        }
        setIsLoading(true);
        setResult(null);

        try {
            const responseJson = await cleanCsvData(fileContent, instructions);
            const parsedResult = JSON.parse(responseJson);
            setResult({ summary: parsedResult.summary_of_changes, cleanedCsv: parsedResult.cleaned_csv });
            addToast('Data cleaning complete!', 'success');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            addToast(`Data cleaning failed: ${msg}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result || !file) return;
        const originalFilename = file.name.split('.').slice(0, -1).join('.');
        downloadTextFile(result.cleanedCsv, `${originalFilename}_cleaned.csv`);
    };

    return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-950">
            <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <Button onClick={() => navigateTo('dashboard')} variant="ghost" className="pl-1 text-sm">
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            Back to Dashboard
                        </Button>
                    </div>

                    <header className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">AI Data Cleaning</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-3xl mx-auto">Clean and transform your messy data using simple, natural language instructions.</p>
                    </header>
                    
                    <Card className="p-6 space-y-4">
                         <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <UploadCloudIcon className="w-10 h-10 mx-auto text-slate-400" />
                            <p className="mt-3 font-semibold text-teal-600 dark:text-teal-400 text-sm truncate">
                                {file ? file.name : 'Click to upload a CSV'}
                            </p>
                            <input ref={fileInputRef} type="file" className="hidden" accept=".csv,text/csv" onChange={handleFileChange} />
                        </div>

                        <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cleaning Instructions</label>
                            <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="e.g., Remove duplicate rows. Fill missing 'age' values with the average age. Convert 'date' column to YYYY-MM-DD format." rows={4} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2" />
                        </div>

                        <Button onClick={handleClean} isLoading={isLoading} disabled={!file || !instructions} variant="teal-gradient" size="lg" className="w-full gap-2">
                            <Wand2Icon className="w-5 h-5" />
                            Clean Data
                        </Button>
                    </Card>

                    {(isLoading || result) && (
                        <div className="mt-8">
                            {isLoading ? (
                                <Card className="p-10 flex flex-col items-center justify-center">
                                    <LoaderIcon className="w-10 h-10 animate-spin text-teal-500" />
                                    <p className="mt-4 text-slate-500 dark:text-slate-400">AI is cleaning your data...</p>
                                </Card>
                            ) : (
                                result && (
                                    <div className="grid lg:grid-cols-5 gap-8">
                                        <Card className="lg:col-span-3 p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-xl font-bold">Cleaned Data Preview</h2>
                                                <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                                                    <DownloadIcon className="w-4 h-4" />
                                                    Download CSV
                                                </Button>
                                            </div>
                                            <div className="h-96 overflow-auto bg-slate-100 dark:bg-slate-900 rounded-md p-4 text-xs font-mono whitespace-pre">{result.cleanedCsv}</div>
                                        </Card>
                                        <Card className="lg:col-span-2 p-6">
                                            <h2 className="text-xl font-bold mb-4">Summary of Changes</h2>
                                            <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{__html: result.summary.replace(/\n/g, '<br />')}}></div>
                                        </Card>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
