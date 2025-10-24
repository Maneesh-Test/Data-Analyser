import React from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeftIcon, ImageIcon, FileTextIcon, PdfIcon, ZapIcon, PlusIcon } from '../components/Icons';

interface MultiModalPowerPageProps {
  navigateTo: (page: Page) => void;
}

export const MultiModalPowerPage: React.FC<MultiModalPowerPageProps> = ({ navigateTo }) => {
  return (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-950">
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => navigateTo('dashboard')} variant="ghost" className="pl-1 text-sm">
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Back to Dashboard
            </Button>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">Multi-Modal Power</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">Analyze text, images, and complex documents together. Prism AI understands content in all its forms to deliver deeper, more contextual insights.</p>
          </header>

          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">What is Multi-Modal AI?</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                "Multi-modal" means the AI can understand and reason about information from different types of sources (modalities) simultaneously. Instead of just analyzing text or just analyzing an image, it can look at an image and read your text-based question about it to provide a unified, intelligent answer. This allows for far more complex and nuanced analysis than single-modal systems.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Example: Analyzing a Report with a Chart</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-48">
                    <ImageIcon className="w-16 h-16 mx-auto text-sky-500" />
                    <p className="mt-2 text-sm font-semibold">Chart.png</p>
                </div>
                <PlusIcon className="w-8 h-8 text-slate-400" />
                 <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-48">
                    <FileTextIcon className="w-16 h-16 mx-auto text-slate-500" />
                    <p className="mt-2 text-sm font-semibold">"What is the trend for Q3?"</p>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">Combined AI Insight:</h3>
                <div className="p-4 bg-teal-500/5 dark:bg-teal-900/20 rounded-md text-sm text-slate-700 dark:text-slate-300">
                    <p>Based on the provided chart image, the trend for Q3 shows a significant uptick in user engagement, rising by approximately 30% from the start to the end of the quarter, far exceeding the growth seen in Q1 and Q2.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Supported File Types</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">We support a wide range of file types, allowing you to get insights from almost any source:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                    <PdfIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="font-medium">PDFs</span>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                    <FileTextIcon className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    <span className="font-medium">Text Files (.txt)</span>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                    <ImageIcon className="w-6 h-6 text-sky-500 flex-shrink-0" />
                    <span className="font-medium">Images (PNG, JPG, etc.)</span>
                </div>
              </div>
            </Card>

            <div className="text-center pt-6">
                <Button onClick={() => navigateTo('dashboard')} variant="teal-gradient" size="lg" className="gap-2.5">
                    <ZapIcon className="h-5 w-5" />
                    Analyze Your Files Now
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};