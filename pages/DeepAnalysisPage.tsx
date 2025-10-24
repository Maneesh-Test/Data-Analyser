import React from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeftIcon, FileTextIcon, ZapIcon } from '../components/Icons';

interface DeepAnalysisPageProps {
  navigateTo: (page: Page) => void;
}

export const DeepAnalysisPage: React.FC<DeepAnalysisPageProps> = ({ navigateTo }) => {
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
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">Deep Analysis</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">Go beyond the surface. Extract summaries, key points, and thematic insights from any document with a single click.</p>
          </header>

          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">What It Is</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our Deep Analysis feature uses advanced AI to read and understand dense documents just like a human analyst would, but in a fraction of the time. It automatically identifies the core message, extracts the most crucial pieces of information, and presents them in a clean, easy-to-digest format. Say goodbye to hours of manual reading and highlighting.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Example: Before & After</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Before: Raw Document</h3>
                  <div className="h-48 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md text-sm text-slate-500 dark:text-slate-400 font-mono">
                    "Q3 Financial Report: The quarter saw unprecedented growth, with revenues reaching $4.8M, a 22% increase YoY. This surge is primarily attributed to the successful launch of 'Project Phoenix' in the APAC region. However, operating margins decreased by 3% due to rising logistics costs. Key personnel changes include the appointment of a new COO. Strategic recommendations for Q4 involve optimizing the supply chain and exploring market penetration in EMEA..."
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">After: AI Analysis</h3>
                  <div className="h-48 p-4 bg-teal-500/5 dark:bg-teal-900/20 rounded-md text-sm text-slate-700 dark:text-slate-300">
                    <p className="font-semibold">Summary:</p>
                    <p>Q3 was a strong quarter with 22% YoY revenue growth to $4.8M, driven by the APAC launch of 'Project Phoenix'. This was offset by a 3% decrease in operating margins due to logistics issues.</p>
                    <p className="font-semibold mt-2">Key Points:</p>
                    <ul className="list-disc list-inside">
                      <li>Revenue: $4.8M (+22% YoY)</li>
                      <li>Challenge: Margin decrease (-3%)</li>
                      <li>Action: Optimize supply chain for Q4</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Common Use Cases</h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><FileTextIcon className="w-5 h-5 mt-0.5 text-teal-500 flex-shrink-0" /><span><strong>Legal Professionals:</strong> Quickly summarize lengthy contracts to identify key clauses and potential risks.</span></li>
                <li className="flex items-start gap-3"><FileTextIcon className="w-5 h-5 mt-0.5 text-teal-500 flex-shrink-0" /><span><strong>Researchers & Students:</strong> Digest academic papers and articles to extract core findings and arguments in seconds.</span></li>
                <li className="flex items-start gap-3"><FileTextIcon className="w-5 h-5 mt-0.5 text-teal-500 flex-shrink-0" /><span><strong>Business Analysts:</strong> Extract critical data and trends from financial reports, market research, and business proposals.</span></li>
              </ul>
            </Card>

            <div className="text-center pt-6">
                <Button onClick={() => navigateTo('dashboard')} variant="teal-gradient" size="lg" className="gap-2.5">
                    <ZapIcon className="h-5 w-5" />
                    Try it on the Dashboard
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};