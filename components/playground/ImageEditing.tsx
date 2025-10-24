import React, { useState } from 'react';
import { Button } from '../Button';
import { editImage } from '../../services/geminiService';
import { LoaderIcon, DownloadIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

export const ImageEditing: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setEditedImage(null);
    }
  };

  const handleEdit = async () => {
    if (!prompt || !imageFile) {
      addToast('Please provide an image and a prompt.', 'error');
      return;
    }
    setIsLoading(true);
    setEditedImage(null);
    try {
      const imageB64 = await editImage(imageFile, prompt);
      setEditedImage(`data:image/png;base64,${imageB64}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(`Image editing failed: ${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    const filename = `${imageFile?.name.split('.').slice(0, -1).join('.') || 'image'}_edited.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Edited image downloaded!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Image Editing</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium mb-1">Upload Image</label>
            <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" disabled={isLoading} />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a llama next to the image."
            className="w-full h-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
            disabled={isLoading}
          />
          <Button onClick={handleEdit} isLoading={isLoading} disabled={!imageFile || !prompt}>
            Edit Image
          </Button>
        </div>
      </div>
      {(isLoading || editedImage || originalImagePreview) && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-center items-center min-h-[300px]">
          {isLoading ? (
            <LoaderIcon className="w-12 h-12 animate-spin text-teal-500" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {originalImagePreview && (
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-center mb-2 font-semibold">Original</h3>
                  <img src={originalImagePreview} alt="Original" className="max-w-full max-h-[400px] rounded-md" />
                </div>
              )}
              {editedImage && (
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-center mb-2 font-semibold">Edited</h3>
                  <img src={editedImage} alt="Edited" className="max-w-full max-h-[400px] rounded-md" />
                  <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                    <DownloadIcon className="w-4 h-4" />
                    Download Edited Image
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};