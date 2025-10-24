import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileProgress } from '../components/FileProgress';
import { BarChartIcon, ListOrderedIcon, ImageIcon, PdfIcon, FileTextIcon, ArrowRightIcon } from '../components/Icons';
import { UploadedFile, UploadStatus } from '../types';
import { analyzeFile } from '../services/aiService';
import { LLM_PROVIDERS, Model } from '../lib/models';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { convertSvgToPng } from '../utils/fileUtils';
import { Page } from '../App';
import { supabase } from '../supabase/client';

interface InfoBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  ctaPage?: Page;
  onCtaClick?: (page: Page) => void;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon, title, description, ctaText, ctaPage, onCtaClick }) => (
    <div className="group relative p-5 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-lg">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-inner-sm border border-slate-200 dark:border-slate-700">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
                 {ctaText && ctaPage && onCtaClick && (
                    <button onClick={() => onCtaClick(ctaPage)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        <span>{ctaText}</span>
                        <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                 )}
            </div>
        </div>
    </div>
);


export const DashboardPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const activeProviders = LLM_PROVIDERS.filter(p => p.active);
  const defaultModel = activeProviders.find(p => p.id === 'google')?.models.find(m => m.id === 'gemini-2.5-flash') || activeProviders[0]?.models[0] || null;

  const [selectedModel, setSelectedModel] = useState<Model | null>(defaultModel);
  const [withReasoning, setWithReasoning] = useState(true);
  const [modelSelectionError, setModelSelectionError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (fileData: UploadedFile, model: Model, reasoning: boolean) => {
    setUploadedFiles(prev => prev.map(f =>
      f.id === fileData.id ? { ...f, status: UploadStatus.ANALYZING, progress: 100, analysis: null } : f
    ));
    
    try {
      const useThinkingMode = model.id === 'gemini-2.5-pro' && reasoning;
      const result = await analyzeFile(fileData.file, model.id, reasoning, useThinkingMode);
      setUploadedFiles(prev => prev.map(f =>
        f.id === fileData.id ? { ...f, status: UploadStatus.COMPLETED, analysis: result.analysis, providerName: result.providerName, modelName: result.modelName } : f
      ));
      addToast(`Analysis complete for ${fileData.file.name}`, 'success');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setUploadedFiles(prev => prev.map(f =>
        f.id === fileData.id ? { ...f, status: UploadStatus.ERROR, analysis: errorMessage } : f
      ));
      addToast(`Analysis failed for ${fileData.file.name}.`, 'error');
    }
  }, [addToast]);

  const handleFilesSelected = async (files: File[]) => {
    if (!selectedModel) {
      setModelSelectionError('Please select a model before uploading files.');
      return;
    }
    if (!user) {
        addToast('You must be logged in to upload files.', 'error');
        return;
    }
    setModelSelectionError(null);
    setIsLoading(true);

    const newFilesDataPromises = files.map(async (file, index) => {
        let fileToUpload = file;
        // Handle SVG conversion before upload
        if (file.type === 'image/svg+xml') {
            try {
                fileToUpload = await convertSvgToPng(file);
                addToast(`Converted ${file.name} to PNG for analysis.`, 'info');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown conversion error.';
                addToast(`Failed to convert ${file.name}: ${message}`, 'error');
                return null;
            }
        }
        
        // Upload to Supabase Storage
        const filePath = `${user.id}/${Date.now()}_${fileToUpload.name}`;
        const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, fileToUpload);
        
        if (uploadError) {
            addToast(`Failed to upload ${file.name}: ${uploadError.message}`, 'error');
            return null;
        }

        // Create a local blob URL for previews. This avoids CORS issues and is much faster.
        const previewUrl = URL.createObjectURL(fileToUpload);

        return {
            id: `${file.name}-${Date.now()}-${index}`,
            file: fileToUpload,
            progress: 0,
            status: UploadStatus.UPLOADING,
            previewUrl: previewUrl,
            analysis: null,
        };
    });

    const settledFiles = await Promise.all(newFilesDataPromises);
    const newFilesData = settledFiles.filter((f): f is UploadedFile => f !== null);

    setUploadedFiles(prev => [...newFilesData, ...prev]);

    const analysisPromises = newFilesData.map(fileData =>
      new Promise<void>(resolve => {
        // Simulate upload progress before analysis
        const interval = setInterval(() => {
          setUploadedFiles(prevFiles => {
            let fileUploadFinished = false;
            const updatedFiles = prevFiles.map(f => {
              if (f.id === fileData.id && f.status === UploadStatus.UPLOADING && f.progress < 100) {
                const newProgress = Math.min(f.progress + 20, 100);
                if (newProgress === 100) {
                  fileUploadFinished = true;
                }
                return { ...f, progress: newProgress };
              }
              return f;
            });

            if (fileUploadFinished) {
              clearInterval(interval);
              queueMicrotask(async () => {
                await runAnalysis(fileData, selectedModel!, withReasoning);
                resolve();
              });
            }
            return updatedFiles;
          });
        }, 100);
      })
    );
    
    await Promise.all(analysisPromises);
    setIsLoading(false);
  };

  const handleRemoveFile = (id: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === id);
    if (fileToRemove) {
      // Revoke the blob URL to free up memory before removing from state.
      URL.revokeObjectURL(fileToRemove.previewUrl);
      addToast(`${fileToRemove.file.name} removed.`, 'success');
    }
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const handleReanalyze = (id: string) => {
    const fileToReanalyze = uploadedFiles.find(f => f.id === id);
    if (fileToReanalyze && selectedModel) {
        addToast(`Re-analyzing ${fileToReanalyze.file.name}...`, 'info');
        runAnalysis(fileToReanalyze, selectedModel, withReasoning);
    } else if (!selectedModel) {
        setModelSelectionError('Please select a model to re-analyze.');
    }
  };
  
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center pt-4 sm:pt-8 mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white px-2">File Analysis Dashboard</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto px-4">Welcome, {user?.email || 'Guest'}. Upload your files to get instant, AI-powered insights.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <InfoBlock 
                icon={<BarChartIcon className="w-6 h-6 text-teal-600" />}
                title="Deep Analysis"
                description="Extract summaries and key points from any document."
                ctaText="Learn More"
                ctaPage="deep-analysis"
                onCtaClick={navigateTo}
              />
              <InfoBlock 
                icon={<ListOrderedIcon className="w-6 h-6 text-sky-600" />}
                title="Structured Output"
                description="Receive clean, predictable JSON for easy integration."
                ctaText="View Docs"
                ctaPage="structured-output"
                onCtaClick={navigateTo}
              />
              <InfoBlock 
                icon={<ImageIcon className="w-6 h-6 text-indigo-600" />}
                title="Multi-Modal Power"
                description="Analyze text, complex PDFs, and detailed images."
                ctaText="See Examples"
                ctaPage="multi-modal-power"
                onCtaClick={navigateTo}
              />
          </div>

          <FileUpload
              onFilesSelected={handleFilesSelected}
              isLoading={isLoading}
              providers={activeProviders}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              withReasoning={withReasoning}
              onWithReasoningChange={setWithReasoning}
              modelSelectionError={modelSelectionError}
          />
          
          {uploadedFiles.length === 0 ? (
              <div className="mt-6 sm:mt-8 text-center py-12 sm:py-16 px-4 sm:px-6 border-2 border-dashed border-slate-300/70 dark:border-slate-700/70 rounded-xl bg-white/5 dark:bg-slate-900/20">
                  <div className="max-w-md mx-auto">
                      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <PdfIcon className="w-8 h-8 sm:w-12 sm:h-12 text-red-400/70" />
                          <FileTextIcon className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400/70" />
                          <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-sky-400/70" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 px-2">Your analysis history will appear here</h3>
                      <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 px-2">
                        Ready to unlock some insights? Upload a file to get started.
                      </p>
                  </div>
              </div>
          ) : (
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              {uploadedFiles.map(fileData => (
                  <FileProgress
                  key={fileData.id}
                  fileData={fileData}
                  onRemove={handleRemoveFile}
                  onReanalyze={handleReanalyze}
                  addToast={addToast}
                  />
              ))}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};