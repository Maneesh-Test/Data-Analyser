import React, { useState } from 'react';
import { Button } from '../Button';
import { generateVideo } from '../../services/geminiService';
import { LoaderIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

export const VideoGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating video...');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const { addToast } = useToast();
  
  const loadingMessages = [
    "Warming up the pixels...",
    "Composing the digital symphony...",
    "Teaching robots to dream...",
    "This can take a few minutes...",
    "Still working on it...",
  ];

  const handleGenerate = async () => {
    if (!prompt && !imageFile) {
      addToast('Please enter a prompt or upload an image.', 'error');
      return;
    }

    addToast('Video generation requires Google Cloud billing with Veo API enabled. This feature is not available in the free tier.', 'error');
    return;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Video Generation</h2>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A neon hologram of a cat driving at top speed."
            className="w-full h-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
            disabled={isLoading}
          />
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium mb-1">Starting Image (Optional)</label>
            <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" disabled={isLoading} />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="aspect-ratio">Aspect Ratio:</label>
            <select
              id="aspect-ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
              className="p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
              disabled={isLoading}
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
            </select>
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Generate Video
            </Button>
          </div>
        </div>
      </div>
      {(isLoading || generatedVideoUrl) && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-center items-center min-h-[300px]">
          {isLoading ? (
            <div className="text-center">
              <LoaderIcon className="w-12 h-12 animate-spin text-teal-500 mx-auto" />
              <p className="mt-4 text-slate-500 dark:text-slate-400">{loadingMessage}</p>
            </div>
          ) : generatedVideoUrl ? (
            <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-[500px] rounded-md" />
          ) : null}
        </div>
      )}
    </div>
  );
};