import React, { useState, useCallback, useRef } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { UploadCloudIcon, CheckIcon, Wand2Icon, XCircleIcon } from './Icons';
import { LLMProvider, Model } from '../lib/models';
import { ModelSelector } from './ModelSelector';
import { Switch } from './Switch';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  providers: LLMProvider[];
  selectedModel: Model | null;
  onSelectModel: (model: Model) => void;
  withReasoning: boolean;
  onWithReasoningChange: (value: boolean) => void;
  modelSelectionError: string | null;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/svg+xml', // for conversion
];


export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  isLoading,
  providers,
  selectedModel,
  onSelectModel,
  withReasoning,
  onWithReasoningChange,
  modelSelectionError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProModel = selectedModel?.id === 'gemini-2.5-pro';

  const processFiles = useCallback((files: File[]) => {
    setDropError(null);
    setIsDropped(false);

    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        errors.push(`'${file.name}': Unsupported file type.`);
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`'${file.name}': Exceeds 10MB size limit.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors.length > 1
        ? `${errors.length} files have errors. Please check types and sizes.`
        : errors[0];
      setDropError(errorMessage);
      return;
    }

    if (validFiles.length > 0) {
      setIsDropped(true);
      onFilesSelected(validFiles);
      setTimeout(() => setIsDropped(false), 2000);
    }
  }, [onFilesSelected]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
    event.target.value = '';
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        processFiles(Array.from(files));
    }
  }, [processFiles]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDropError(null);
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const triggerFileSelect = () => {
    if (isLoading) return;
    setDropError(null);
    fileInputRef.current?.click();
  };
  
  const dropzoneBaseClasses = 'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ease-in-out cursor-pointer';
  const dropzoneStateClasses = isDragging
    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 scale-105 shadow-xl shadow-teal-500/20'
    : dropError
    ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
    : isDropped
    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
    : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-400 dark:hover:border-slate-500';

  let dropzoneContent;
  if (dropError) {
      dropzoneContent = (
          <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-700">
                  <XCircleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <div className="flex flex-col items-center">
                  <p className="mt-4 text-sm font-semibold text-red-800 dark:text-red-300">Upload Failed</p>
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 max-w-xs">{dropError}</p>
              </div>
          </>
      );
  } else if (isDropped) {
      dropzoneContent = (
          <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700">
                  <CheckIcon className="h-8 w-8 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300">Files ready for analysis!</p>
          </>
      );
  } else {
      dropzoneContent = (
          <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-teal-200 dark:border-teal-800">
                  <UploadCloudIcon className="h-8 w-8 text-teal-600" aria-hidden="true" />
              </div>
              <div className="flex flex-col sm:flex-row items-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">Click to upload</span>
                  <span className="mt-1 sm:mt-0 sm:ml-1">or drag and drop</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">PDF, TXT, images (PNG, JPG, SVG) up to 10MB</p>
          </>
      );
  }

  return (
    <Card className="p-4 sm:p-6 space-y-6">
      <div 
        className={`${dropzoneBaseClasses} ${dropzoneStateClasses}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={triggerFileSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileSelect(); }}
        aria-label="File upload area"
      >
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
            {dropzoneContent}
        </div>
        <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.txt,.png,.jpg,.jpeg,.gif,.webp,.heic,.heif,.svg"
            disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="w-full">
            <label htmlFor="model-selector" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                AI Model
            </label>
            <ModelSelector
                providers={providers}
                selectedModel={selectedModel}
                onSelectModel={onSelectModel}
                disabled={isLoading}
            />
        </div>
        <div className="flex items-center space-x-3 md:mt-7">
            <Switch
                id="with-reasoning"
                checked={withReasoning}
                onChange={(e) => onWithReasoningChange(e.target.checked)}
                disabled={isLoading}
            />
            <label htmlFor="with-reasoning" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                {isProModel ? 'Enable Thinking Mode' : 'Include step-by-step reasoning'}
            </label>
        </div>
      </div>
      
      {modelSelectionError && (
          <p className="text-sm text-red-600 text-center">{modelSelectionError}</p>
      )}

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading || !selectedModel}
        variant="teal-gradient"
        size="lg"
        className="w-full gap-2.5"
      >
        {isLoading ? 'Analyzing...' : (
            <>
                <Wand2Icon className="w-5 h-5" />
                Analyze Files
            </>
        )}
      </Button>
    </Card>
  );
};