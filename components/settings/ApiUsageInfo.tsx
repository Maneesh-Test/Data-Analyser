import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from '../Icons';

// Track usage in localStorage
const getUsageCount = (): number => {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('apiUsageDate');

  if (stored !== today) {
    // New day, reset counter
    localStorage.setItem('apiUsageCount', '0');
    localStorage.setItem('apiUsageDate', today);
    return 0;
  }

  return parseInt(localStorage.getItem('apiUsageCount') || '0');
};

const incrementUsage = () => {
  const count = getUsageCount();
  localStorage.setItem('apiUsageCount', (count + 1).toString());
};

export const trackApiUsage = () => {
  incrementUsage();
};

const ApiUsageInfo: React.FC = () => {
  const [usageCount, setUsageCount] = useState(0);
  const dailyLimit = 1500; // Gemini free tier limit
  const usagePercentage = Math.min((usageCount / dailyLimit) * 100, 100);

  useEffect(() => {
    // Initial load
    setUsageCount(getUsageCount());

    // Update every 5 seconds
    const interval = setInterval(() => {
      setUsageCount(getUsageCount());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (usagePercentage < 50) return 'text-green-600';
    if (usagePercentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (usagePercentage < 80) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    if (usagePercentage < 100) return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangleIcon className="w-5 h-5 text-red-600" />;
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">API Usage (Estimated)</h3>
          <p className="text-sm text-gray-600">
            Your estimated API requests today
          </p>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-4">
        {/* Usage Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className={getStatusColor()}>{usageCount} requests</span>
            <span className="text-gray-500">{dailyLimit} daily limit</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                usagePercentage < 50
                  ? 'bg-green-500'
                  : usagePercentage < 80
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{usagePercentage.toFixed(1)}% used</span>
            <span>{dailyLimit - usageCount} remaining</span>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="text-blue-900 font-medium">
                About Gemini API Free Tier
              </p>
              <ul className="text-blue-800 space-y-1 list-disc list-inside">
                <li>15 requests per minute</li>
                <li>1,500 requests per day</li>
                <li>1 million tokens per day</li>
              </ul>
              <p className="text-blue-700 text-xs mt-3">
                This counter is an estimate based on your activity. The actual limit is enforced by Google's API.
              </p>
            </div>
          </div>
        </div>

        {/* Add Own Key Option */}
        {usagePercentage > 80 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-900 font-medium mb-1">
                  Approaching Daily Limit
                </p>
                <p className="text-amber-800 mb-2">
                  You're approaching the daily request limit. Consider adding your own API key for unlimited access.
                </p>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline text-xs"
                >
                  Get your free Gemini API key →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApiUsageInfo;
