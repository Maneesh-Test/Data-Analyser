import React from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeftIcon, CodeXmlIcon, ZapIcon } from '../components/Icons';

interface StructuredOutputPageProps {
  navigateTo: (page: Page) => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-slate-900 text-slate-300 text-xs rounded-md p-4 overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const sampleTextJson = `{
  "summary": "The Q2 report for Project Titan shows a 15% revenue growth to $2.5M, attributed to a new marketing campaign and a 20% MoM increase in user engagement.",
  "key_points": [
    "Revenue reached $2.5M, a 15% increase.",
    "User engagement is up by 20% month-over-month.",
    "Primary challenges are supply chain delays and increased competition.",
    "A key recommendation is to invest in logistics."
  ],
  "sentiment": "Positive"
}`;

const sampleImageJson = `{
  "description": "A close-up photograph of a golden retriever puppy sitting on a lush green lawn, looking up at the camera with a playful expression. The background is softly blurred, emphasizing the subject.",
  "main_subject": "Golden retriever puppy",
  "elements": [
    "puppy",
    "green grass",
    "blurred background",
    "daylight"
  ],
  "mood_style": "Joyful, Heartwarming, Photorealistic"
}`;


export const StructuredOutputPage: React.FC<StructuredOutputPageProps> = ({ navigateTo }) => {
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
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">Structured JSON Output</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">Get clean, predictable, and machine-readable analysis for seamless integration into your workflows and applications.</p>
          </header>

          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Why Structured Output?</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                While human-readable summaries are great, developers and automated systems need data in a consistent, predictable format. Our structured JSON output provides exactly that. Instead of parsing text, you can directly access key-value pairs, making it incredibly easy to pipe AI-generated insights into your databases, applications, or custom reporting tools.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Example: Document Analysis</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                The analysis of a text file or PDF is returned in a clear, object-based format.
              </p>
              <CodeBlock>{sampleTextJson}</CodeBlock>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Example: Image Analysis</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Image analysis provides descriptive tags and context, ready for your content management system.
              </p>
              <CodeBlock>{sampleImageJson}</CodeBlock>
            </Card>

             <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">How to Use It</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When using our API or advanced tools, you can specify a JSON response format. The AI model will then intelligently structure its analysis according to a predefined schema for that file type. This ensures you get consistent results every time, eliminating the need for fragile text parsing logic.
              </p>
            </Card>

            <div className="text-center pt-6">
                <Button onClick={() => navigateTo('playground')} variant="teal-gradient" size="lg" className="gap-2.5">
                    <CodeXmlIcon className="h-5 w-5" />
                    Explore in the Playground
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};