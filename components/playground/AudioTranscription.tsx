import React, { useState } from 'react';
import { Button } from '../Button';
import { transcribeAudio } from '../../services/geminiService';
import { LoaderIcon, LinkIcon, UploadCloudIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';

export const AudioTranscription: React.FC = () => {
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setTranscription(null);
      setUrl('');
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setAudioFile(null);
    setAudioPreview(null);
    setTranscription(null);
  };

  const handleTranscribe = async () => {
    if (inputType === 'url') {
      if (!url.trim()) {
        addToast('Please enter a URL.', 'error');
        return;
      }
      // This is a placeholder for the user's request.
      // Actual YouTube audio extraction requires a server-side component to handle downloads and conversions, which is beyond the scope of this client-side application.
      addToast('Transcription from web links is not supported in this client-side environment. This feature requires a server to process the video.', 'info');
      return;
    }

    if (!audioFile) {
      addToast('Please upload an audio file.', 'error');
      return;
    }
    setIsLoading(true);
    setTranscription(null);
    try {
      const result = await transcribeAudio(audioFile);
      setTranscription(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(`Transcription failed: ${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Audio Transcription</h2>
        <div className="mb-4 flex border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setInputType('file')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${inputType === 'file' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <UploadCloudIcon className="w-5 h-5" />
            <span>Upload File</span>
          </button>
          <button onClick={() => setInputType('url')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${inputType === 'url' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <LinkIcon className="w-5 h-5" />
            <span>From URL</span>
          </button>
        </div>
        <div className="space-y-4">
          {inputType === 'file' ? (
            <div>
              <label htmlFor="audio-upload" className="block text-sm font-medium mb-1">Upload Audio File</label>
              <input id="audio-upload" type="file" accept="audio/*" onChange={handleFileChange} className="w-full text-sm" disabled={isLoading} />
            </div>
          ) : (
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium mb-1">YouTube URL</label>
              <input id="url-input" type="url" value={url} onChange={handleUrlChange} placeholder="https://youtube.com/watch?v=..." className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800" disabled={isLoading} />
            </div>
          )}
          <Button onClick={handleTranscribe} isLoading={isLoading} disabled={!audioFile && !url}>
            Transcribe
          </Button>
        </div>
      </div>
      {(audioPreview) && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="font-semibold mb-2">Audio Preview</h3>
            <audio src={audioPreview} controls className="w-full" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Transcription</h3>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[100px]">
                <LoaderIcon className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : transcription ? (
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md whitespace-pre-wrap text-sm">{transcription}</div>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Transcription will appear here.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};