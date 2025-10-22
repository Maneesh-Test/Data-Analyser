import React, { useState } from 'react';
import { UploadedFile, UploadStatus } from '../types';
import { formatFileSize, downloadTextFile } from '../utils/fileUtils';
import { Card } from './Card';
import { Progress } from './Progress';
import { FileIcon, CheckCircleIcon, XCircleIcon, LoaderIcon, XIcon, PdfIcon, ShareIcon, DownloadIcon, RefreshCwIcon, ChevronRightIcon, ImageIcon, FileTextIcon } from './Icons';
import { PdfPreview } from './PdfPreview';
import { ToastType } from '../contexts/ToastContext';

/**
 * A recursive React component to render any JSON data structure,
 * using collapsible sections for nested objects and arrays.
 */
const RecursiveJsonRenderer: React.FC<{ data: any }> = ({ data }) => {
  if (data === null || data === undefined) {
    return <span className="text-slate-500 dark:text-slate-400 italic">null</span>;
  }

  if (Array.isArray(data)) {
    // Render empty array indicator
    if (data.length === 0) {
      return <span className="text-slate-500 dark:text-slate-400 italic">[]</span>;
    }
    // Render list of items
    return (
      <ul className="list-disc list-inside pl-4 space-y-1">
        {data.map((item, index) => (
          <li key={index}>
            <RecursiveJsonRenderer data={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);
    // Render empty object indicator
    if (entries.length === 0) {
      return <span className="text-slate-500 dark:text-slate-400 italic">{`{}`}</span>;
    }
    // Render key-value pairs
    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => {
          const isCollapsible = typeof value === 'object' && value !== null;
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          if (isCollapsible) {
            return (
              <details key={key} className="group" open>
                <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer list-none flex items-center -ml-5">
                  <ChevronRightIcon className="w-4 h-4 mr-1 transition-transform duration-200 group-open:rotate-90" />
                  {formattedKey}
                </summary>
                <div className="pl-5 mt-1 border-l-2 border-slate-200/80 dark:border-slate-700/80">
                  <RecursiveJsonRenderer data={value} />
                </div>
              </details>
            );
          } else {
            return (
              <div key={key}>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">{formattedKey}:</strong>{' '}
                <span className="whitespace-pre-wrap leading-relaxed">{String(value)}</span>
              </div>
            );
          }
        })}
      </div>
    );
  }

  // Render primitive values
  return <span className="whitespace-pre-wrap leading-relaxed">{String(data)}</span>;
};


/**
 * A React component to render structured analysis from a JSON string.
 * It gracefully falls back to displaying raw text if parsing fails.
 */
const AnalysisRenderer: React.FC<{ analysis: string }> = ({ analysis }) => {
  let parsedAnalysis: any;
  try {
    const startIndex = analysis.indexOf('{');
    const endIndex = analysis.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('JSON object not found in the analysis string.');
    }
    const jsonString = analysis.substring(startIndex, endIndex + 1);
    parsedAnalysis = JSON.parse(jsonString);
  } catch (e) {
    // If parsing fails, render the raw text
    return <div className="whitespace-pre-wrap leading-relaxed">{analysis}</div>;
  }
  
  // Use the recursive renderer for any valid JSON.
  return <RecursiveJsonRenderer data={parsedAnalysis} />;
};

interface FileProgressProps {
  fileData: UploadedFile;
  onRemove: (id: string) => void;
  onReanalyze: (id: string) => void;
  addToast: (message: string, type: ToastType) => void;
}

const StatusIndicator: React.FC<{ status: UploadStatus, providerName?: string }> = ({ status, providerName }) => {
  switch (status) {
    case UploadStatus.UPLOADING:
      return null; // The animated progress bar and percentage are sufficient.
    case UploadStatus.ANALYZING:
      return (
        <div className="flex items-center space-x-2 text-sm text-teal-700 dark:text-teal-400" role="status">
          <LoaderIcon className="h-4 w-4 animate-spin" />
          <span className="sr-only">Status: </span>
          <span>Analyzing with {providerName || 'AI'}...</span>
        </div>
      );
    case UploadStatus.COMPLETED:
      return (
        <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-400" role="status">
          <CheckCircleIcon className="h-4 w-4" />
          <span className="sr-only">Status: </span>
          <span>Completed</span>
        </div>
      );
    case UploadStatus.ERROR:
      return (
        <div className="flex items-center space-x-2 text-sm text-red-700 dark:text-red-400" role="alert">
          <XCircleIcon className="h-4 w-4" />
          <span className="sr-only">Status: </span>
          <span>Error</span>
        </div>
      );
    default:
      return null;
  }
};

const FilePreview: React.FC<{ fileData: UploadedFile }> = ({ fileData }) => {
    const isImage = fileData.file.type.startsWith('image/');
    const isPdf = fileData.file.type === 'application/pdf';
    const isText = fileData.file.type.startsWith('text/');

    return (
        <div className="w-full aspect-square lg:aspect-[4/3] bg-slate-200/50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
            {isImage ? (
                <img src={fileData.previewUrl} alt={`Preview of ${fileData.file.name}`} className="h-full w-full object-contain" />
            ) : isPdf ? (
                 <PdfPreview fileUrl={fileData.previewUrl} />
            ) : isText ? (
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <FileTextIcon className="h-16 w-16 mx-auto" />
                    <p className="mt-2 text-sm font-medium">Text Document</p>
                </div>
            ) : (
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <FileIcon className="h-16 w-16 mx-auto" />
                    <p className="mt-2 text-sm font-medium">File Preview</p>
                </div>
            )}
        </div>
    )
}

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode, children: React.ReactNode }> = ({ icon, children, ...props }) => (
    <button {...props} className={`inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ''}`}>
        {icon}
        <span>{children}</span>
    </button>
);

const FileTypeIcon: React.FC<{ mimeType: string }> = ({ mimeType }) => {
  const iconClasses = "h-10 w-10 flex-shrink-0";
  if (mimeType === 'application/pdf') {
    return <PdfIcon className={`${iconClasses} text-red-500 dark:text-red-400`} />;
  }
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className={`${iconClasses} text-sky-500 dark:text-sky-400`} />;
  }
  if (mimeType.startsWith('text/')) {
    return <FileTextIcon className={`${iconClasses} text-slate-500 dark:text-slate-400`} />;
  }
  return <FileIcon className={`${iconClasses} text-slate-400 dark:text-slate-500`} />;
};

export const FileProgress: React.FC<FileProgressProps> = ({ fileData, onRemove, onReanalyze, addToast }) => {
  const analysisId = `analysis-heading-${fileData.id}`;
  const isFinished = fileData.status === UploadStatus.COMPLETED || fileData.status === UploadStatus.ERROR;
  const hasAnalysis = fileData.analysis && fileData.status === UploadStatus.COMPLETED;

  const [shareText, setShareText] = useState('Share');
  const [isSharing, setIsSharing] = useState(false);

  const formatAnalysisForExport = (analysis: string): string => {
    try {
        const startIndex = analysis.indexOf('{');
        const endIndex = analysis.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) throw new Error();
        
        const parsed = JSON.parse(analysis.substring(startIndex, endIndex + 1));
        let text = '';

        if (parsed.summary) { // Document analysis
            text += `Summary:\n${parsed.summary}\n\n`;
            text += `Key Points:\n`;
            parsed.key_points.forEach((p: string) => text += `- ${p}\n`);
        } else if (parsed.description) { // Image analysis
            text += `Description:\n${parsed.description}\n\n`;
            text += `Main Subject: ${parsed.main_subject}\n\n`;
            text += `Key Elements:\n`;
            parsed.elements.forEach((e: string) => text += `- ${e}\n`);
            text += `\nMood & Style: ${parsed.mood_style}\n`;
        } else {
          return analysis; // Not a recognized structure, return raw
        }
        
        if (parsed.reasoning) {
            text += `\nReasoning:\n${parsed.reasoning}\n`;
        }
        return text.trim();
    } catch (e) {
        return analysis; // Fallback to raw text if parsing fails
    }
  };

  const handleExport = () => {
    if (!hasAnalysis) return;
    const originalFilename = fileData.file.name.split('.').slice(0, -1).join('.');
    const filename = `${originalFilename}_analysis.txt`;
    const formattedContent = formatAnalysisForExport(fileData.analysis!);
    downloadTextFile(formattedContent, filename);
    addToast('Analysis exported successfully.', 'success');
  };

  const handleShare = async () => {
    if (!hasAnalysis || isSharing) return;

    const formattedContent = formatAnalysisForExport(fileData.analysis!);
    const shareData = {
      title: `Analysis for ${fileData.file.name}`,
      text: formattedContent,
    };
    
    setIsSharing(true);

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Sharing failed:', error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      try {
        await navigator.clipboard.writeText(formattedContent);
        setShareText('Copied!');
        addToast('Analysis copied to clipboard.', 'success');
        setTimeout(() => setShareText('Share'), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setShareText('Error');
        addToast('Failed to copy to clipboard.', 'error');
        setTimeout(() => setShareText('Share'), 2000);
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <Card className="p-4 flex flex-col space-y-4">
      {/* --- File Header --- */}
      <div className="flex items-start space-x-4">
        <FileTypeIcon mimeType={fileData.file.type} />
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{fileData.file.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formatFileSize(fileData.file.size)}</p>
            </div>
             <button 
                onClick={() => onRemove(fileData.id)} 
                className="flex-shrink-0 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1"
                aria-label={`Remove ${fileData.file.name} from list`}
            >
                <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <StatusIndicator status={fileData.status} providerName={fileData.providerName} />
                {fileData.status === UploadStatus.UPLOADING && <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{fileData.progress}%</span>}
            </div>
            {fileData.status === UploadStatus.UPLOADING && <Progress value={fileData.progress} fileName={fileData.file.name} />}
          </div>
        </div>
      </div>
      
      {/* --- Content Area (Side-by-Side on large screens) --- */}
      {fileData.status !== UploadStatus.UPLOADING && (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-6 gap-y-4">
            {/* Left Column: Preview */}
            <div>
                <FilePreview fileData={fileData} />
            </div>

            {/* Right Column: Analysis */}
            <div className="flex flex-col">
                {fileData.analysis ? (
                    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-900/30 backdrop-blur-sm p-4 rounded-lg border border-slate-200/50 dark:border-slate-700/50 h-full">
                        <h3 id={analysisId} className="font-semibold text-teal-700 dark:text-teal-400 mb-2">{fileData.providerName || 'AI'} Analysis</h3>
                        <div className="flex-grow text-sm text-slate-700 dark:text-slate-300">
                          <AnalysisRenderer analysis={fileData.analysis} />
                        </div>
                        {isFinished && (
                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-6">
                                <ActionButton onClick={handleShare} disabled={!hasAnalysis || isSharing} icon={<ShareIcon className="w-4 h-4" />} title={!hasAnalysis ? "Analysis not available" : "Share analysis"}>{shareText}</ActionButton>
                                <ActionButton onClick={handleExport} disabled={!hasAnalysis} icon={<DownloadIcon className="w-4 h-4" />} title={!hasAnalysis ? "Analysis not available" : "Export analysis as a .txt file"}>Export</ActionButton>
                                <ActionButton
                                    onClick={() => onReanalyze(fileData.id)}
                                    icon={<RefreshCwIcon className="w-4 h-4" />}
                                    title="Re-run analysis with the currently selected model"
                                >
                                    Re-analyze
                                </ActionButton>
                            </div>
                        )}
                    </div>
                ) : fileData.status === UploadStatus.ANALYZING && (
                    <div role="status" className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400">Generating analysis...</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </Card>
  );
};