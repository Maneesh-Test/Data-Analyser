import React, { useState } from 'react';
import { Button } from '../Button';
import { analyzeVideo } from '../../services/geminiService';
import { LoaderIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

export const VideoAnalysis: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) {
      addToast('Please upload a video file.', 'error');
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeVideo(videoFile);
      setAnalysis(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(`Video analysis failed: ${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Video Analysis</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="video-upload" className="block text-sm font-medium mb-1">Upload Video</label>
            <input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="w-full text-sm" disabled={isLoading} />
          </div>
          <Button onClick={handleAnalyze} isLoading={isLoading} disabled={!videoFile}>
            Analyze Video
          </Button>
        </div>
      </div>
      {(videoPreview) && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="font-semibold mb-2">Video Preview</h3>
            <video src={videoPreview} controls className="w-full rounded-md" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Analysis</h3>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[150px]">
                <LoaderIcon className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : analysis ? (
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md whitespace-pre-wrap text-sm">{analysis}</div>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Analysis will appear here.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};