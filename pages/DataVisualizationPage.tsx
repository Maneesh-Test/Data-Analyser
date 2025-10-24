import React, { useState, useRef } from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoaderIcon, Wand2Icon, ChevronLeftIcon, UploadCloudIcon } from '../components/Icons';
import { useToast } from '../contexts/ToastContext';
import { generateVegaSpec } from '../services/aiService';
import { VegaChart } from '../components/VegaChart';

export const DataVisualizationPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [vegaSpec, setVegaSpec] = useState<object | null>(null);
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
            setVegaSpec(null);
            const reader = new FileReader();
            reader.onload = (e) => setFileContent(e.target?.result as string);
            reader.readAsText(selectedFile);
        }
    };

    const handleGenerate = async () => {
        if (!fileContent) {
            addToast('Please upload a CSV file.', 'error');
            return;
        }
        if (!prompt.trim()) {
            addToast('Please describe the chart you want to create.', 'error');
            return;
        }
        setIsLoading(true);
        setVegaSpec(null);

        try {
            const result = await generateVegaSpec(fileContent, prompt);
            const parsedSpec = JSON.parse(result);
            
            // Inject the data directly into the spec
            const specWithData = {
                ...parsedSpec,
                data: {
                    values: fileContent
                },
                width: "container",
                height: "container"
            };
            setVegaSpec(specWithData);
            
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Could not generate or parse the chart specification.';
            addToast(`Visualization failed: ${msg}`, 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">AI Data Visualization</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-3xl mx-auto">Upload your data and tell the AI what you want to see. Transform raw numbers into insightful charts with natural language.</p>
                    </header>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <Card className="p-6 lg:col-span-1 space-y-6">
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
                                <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Describe your chart</label>
                                <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., A bar chart of total sales by product category, sorted in descending order." rows={4} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2" />
                            </div>

                            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!file || !prompt} variant="teal-gradient" size="lg" className="w-full gap-2">
                                <Wand2Icon className="w-5 h-5" />
                                Generate Chart
                            </Button>
                        </Card>
                        
                        <Card className="p-6 lg:col-span-2 min-h-[400px] flex items-center justify-center">
                           {isLoading ? (
                                <div className="text-center">
                                    <LoaderIcon className="w-10 h-10 animate-spin text-teal-500" />
                                    <p className="mt-4 text-slate-500 dark:text-slate-400">Generating your visualization...</p>
                                </div>
                           ) : vegaSpec ? (
                                <div className="w-full h-[500px]">
                                    <VegaChart spec={vegaSpec} />
                                </div>
                           ) : (
                                <div className="text-center text-slate-500 dark:text-slate-400">
                                    <p>Your generated chart will appear here.</p>
                                </div>
                           )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
