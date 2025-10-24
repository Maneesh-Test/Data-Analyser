import React, { useState } from 'react';
import { Button } from '../Button';
import { generateImage } from '../../services/geminiService';
import { LoaderIcon, DownloadIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

export const ImageGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      addToast('Please enter a prompt.', 'error');
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const imageB64 = await generateImage(prompt, aspectRatio);
      setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(`Image generation failed: ${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const filename = `${prompt.substring(0, 30).replace(/\s/g, '_') || 'generated_image'}.jpeg`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Image downloaded!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Image Generation</h2>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A robot holding a red skateboard."
            className="w-full h-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
            disabled={isLoading}
          />
          <div className="flex items-center gap-4">
            <label htmlFor="aspect-ratio">Aspect Ratio:</label>
            <select
              id="aspect-ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
              disabled={isLoading}
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
              <option value="3:4">3:4</option>
            </select>
            <Button onClick={handleGenerate} isLoading={isLoading}>
              Generate
            </Button>
          </div>
        </div>
      </div>
      {(isLoading || generatedImage) && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center min-h-[300px]">
          {isLoading ? (
            <LoaderIcon className="w-12 h-12 animate-spin text-teal-500" />
          ) : generatedImage ? (
            <div className="flex flex-col items-center gap-4">
              <img src={generatedImage} alt="Generated" className="max-w-full max-h-[500px] rounded-md" />
              <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                <DownloadIcon className="w-4 h-4" />
                Download Image
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};