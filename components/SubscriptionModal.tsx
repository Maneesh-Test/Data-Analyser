import React, { useState } from 'react';
import { Page } from '../App';
import { Button } from './Button';
import { Switch } from './Switch';
import { CheckIcon, XIcon } from './Icons';

const proFeatures = [
    '500 File Analyses per Month',
    'Premium AI Models (e.g., Gemini 2.5 Pro)',
    'AI "Thinking Mode"',
    'Multi-File Analysis',
    'Priority Chat & Email Support',
];

interface SubscriptionModalProps {
  planName: 'Pro';
  monthlyPrice: number;
  initialBillingCycle: 'monthly' | 'annually';
  onClose: () => void;
  onConfirm: () => void;
  navigateTo: (page: Page) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ planName, monthlyPrice, initialBillingCycle, onClose, onConfirm, navigateTo }) => {
  const [isAnnual, setIsAnnual] = useState(initialBillingCycle === 'annually');

  const annualPrice = monthlyPrice * 12 * 0.8;
  const payNowPrice = isAnnual ? annualPrice : monthlyPrice;

  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  const nextPaymentDateString = nextPaymentDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
  });
  
  const handlePolicyNavigation = (e: React.MouseEvent, page: Page) => {
    e.preventDefault();
    navigateTo(page);
    onClose();
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sub-modal-title"
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl m-4 animate-slide-up-fade-in"
        style={{animationDuration: '0.3s'}}
        >
        <div className="p-8">
            <h2 id="sub-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">Update Subscription</h2>
             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                aria-label="Close modal"
             >
                <XIcon className="h-6 w-6" />
            </button>

            <div className="mt-6 grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="border-r-0 md:border-r md:border-slate-200 dark:md:border-slate-800 md:pr-8">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Selected plan</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{planName}</p>
                    <p className="text-xl font-semibold text-teal-500 dark:text-teal-400 mt-1">${isAnnual ? monthlyPrice * 0.8 : monthlyPrice}/M</p>

                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-8 mb-4">You get:</h4>
                    <ul className="space-y-3">
                        {proFeatures.map(feature => (
                            <li key={feature} className="flex items-start gap-3">
                                <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Column */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your upgrade summary</h3>
                    
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-medium">Annual billing</span>
                        <Switch checked={isAnnual} onChange={(e) => setIsAnnual(e.target.checked)} />
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">What you will pay now</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">${payNowPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Your files are safe. Any unused analyses automatically move to your new subscription based on our policy.
                        </p>
                         <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">What you will pay monthly starting {nextPaymentDateString}</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">${payNowPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <label htmlFor="promo-code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Promo code (optional)</label>
                        <input
                            id="promo-code"
                            type="text"
                            className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500"
                            placeholder="Enter your promo code"
                        />
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
                        By confirming your new plan, you agree to Prism AI's{' '}
                        <a href="#" onClick={(e) => handlePolicyNavigation(e, 'terms')} className="text-teal-500 hover:underline">Terms of service</a> and{' '}
                        <a href="#" onClick={(e) => handlePolicyNavigation(e, 'privacy')} className="text-teal-500 hover:underline">Privacy policy</a>.
                    </p>

                    <Button onClick={onConfirm} variant="teal-gradient" className="w-full mt-6">
                        Confirm upgrade
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};