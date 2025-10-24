import React, { useState } from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckIcon, LogoIcon, ChevronDownIcon } from '../components/Icons';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { useToast } from '../contexts/ToastContext';

interface PricingPageProps {
  navigateTo: (page: Page) => void;
}

const planFeatures = [
  { name: 'File Analyses per Month', free: '10', pro: '500', enterprise: 'Unlimited' },
  { name: 'Standard AI Models', free: true, pro: true, enterprise: true },
  { name: 'Premium AI Models (e.g., Gemini 2.5 Pro)', free: false, pro: true, enterprise: true },
  { name: 'AI "Thinking Mode"', free: false, pro: true, enterprise: true },
  { name: 'Multi-File Analysis', free: false, pro: true, enterprise: true },
  { name: 'Standard Email Support', free: true, pro: true, enterprise: true },
  { name: 'Priority Chat & Email Support', free: false, pro: true, enterprise: true },
  { name: 'Dedicated Account Manager', free: false, pro: false, enterprise: true },
  { name: 'Single Sign-On (SSO)', free: false, pro: false, enterprise: true },
];

const faqs = [
    {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We prioritize your privacy. API keys are stored locally, and uploaded files are not stored on our servers post-analysis. Read our Privacy Policy for more details."
    },
    {
        question: "Do you offer discounts for non-profits or students?",
        answer: "Yes, we offer special discounts for non-profit organizations and educational institutions. Please contact our sales team for more information."
    },
    {
        question: "What happens if I exceed my monthly analysis limit?",
        answer: "If you exceed your plan's limit, you'll be notified. You can choose to upgrade to a higher plan or wait until your limit resets at the start of the next billing cycle."
    }
];

const FeatureListItem: React.FC<{ included: boolean; text: string; }> = ({ included, text }) => (
    <li className={`flex items-start gap-3 ${included ? '' : 'text-slate-400 dark:text-slate-500'}`}>
        <CheckIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${included ? 'text-teal-500' : 'text-slate-300 dark:text-slate-600'}`} />
        <span className="text-sm text-slate-600 dark:text-slate-300">{text}</span>
    </li>
);

export const PricingPage: React.FC<PricingPageProps> = ({ navigateTo }) => {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const homePage = isAuthenticated ? 'dashboard' : 'landing';

    const proPrice = billingCycle === 'monthly' ? 20 : 16;
    const proPriceSuffix = billingCycle === 'monthly' ? '/ month' : '/ month';
    
    // Key features to highlight in the main cards
    const cardFeatures = planFeatures.slice(0, 6);

    const handleConfirmUpgrade = () => {
      setIsSubModalOpen(false);
      addToast('Successfully upgraded to Pro!', 'success');
      // In a real app, you would handle payment processing and then navigate.
    };

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 flex flex-col">
             <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <button onClick={() => navigateTo(homePage)} className="inline-flex items-center gap-3">
                        <LogoIcon className="h-8 w-8 text-teal-600" />
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Prism AI</h1>
                    </button>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                 <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">Find the plan that's right for you</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">Start for free and scale up as you grow. No credit card required.</p>
                        
                        <div className="mt-8 inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg">
                            <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>Monthly</button>
                            <button onClick={() => setBillingCycle('annually')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors relative ${billingCycle === 'annually' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>
                                Annually
                                <span className="absolute -top-2 -right-2 text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {/* Free Plan */}
                        <Card className="p-8 flex flex-col">
                            <div className="flex-grow">
                                <h2 className="text-xl font-bold">Free</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 h-10">For individuals starting out.</p>
                                <p className="mt-6"><span className="text-4xl font-extrabold">$0</span></p>
                                <ul className="mt-8 space-y-4 text-sm">
                                    <FeatureListItem included={true} text={`${planFeatures[0].free} File Analyses per Month`} />
                                    {cardFeatures.slice(1).map(f => (
                                        <FeatureListItem key={f.name} included={!!f.free} text={f.name} />
                                    ))}
                                </ul>
                            </div>
                            <Button variant="secondary" className="w-full mt-8">Get Started</Button>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="p-8 border-2 border-teal-500 relative flex flex-col">
                            <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                            <div className="flex-grow">
                                <h2 className="text-xl font-bold">Pro</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 h-10">For professionals and teams who need more power and support.</p>
                                <p className="mt-6"><span className="text-4xl font-extrabold">${proPrice}</span><span className="text-slate-500 dark:text-slate-400 font-medium">{proPriceSuffix}</span></p>
                                <ul className="mt-8 space-y-4 text-sm">
                                    <FeatureListItem included={true} text={`${planFeatures[0].pro} File Analyses per Month`} />
                                    {cardFeatures.slice(1).map(f => (
                                        <FeatureListItem key={f.name} included={!!f.pro} text={f.name} />
                                    ))}
                                </ul>
                            </div>
                            <Button onClick={() => setIsSubModalOpen(true)} variant="teal-gradient" className="w-full mt-8">Upgrade to Pro</Button>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card className="p-8 flex flex-col">
                            <div className="flex-grow">
                                <h2 className="text-xl font-bold">Enterprise</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 h-10">For large-scale organizations with custom needs.</p>
                                <p className="mt-6"><span className="text-4xl font-extrabold">Custom</span></p>
                                <ul className="mt-8 space-y-4 text-sm">
                                    <FeatureListItem included={true} text={`${planFeatures[0].enterprise} File Analyses`} />
                                    {cardFeatures.slice(1).map(f => (
                                        <FeatureListItem key={f.name} included={!!f.enterprise} text={f.name} />
                                    ))}
                                </ul>
                            </div>
                            <Button variant="secondary" className="w-full mt-8">Contact Sales</Button>
                        </Card>
                    </div>

                    {/* Trusted By Section */}
                    <div className="text-center mt-24">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Trusted by teams at
                        </h3>
                        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-slate-400 dark:text-slate-500">
                            <span className="font-semibold text-lg">Innovate Inc.</span>
                            <span className="font-semibold text-lg">QuantumLeap</span>
                            <span className="font-semibold text-lg">Apex Solutions</span>
                            <span className="font-semibold text-lg">Stellar Labs</span>
                            <span className="font-semibold text-lg">Visionary Co.</span>
                        </div>
                    </div>


                    {/* Feature Comparison */}
                    <div className="mt-24">
                         <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white">Compare All Features</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <th className="text-left font-semibold text-slate-600 dark:text-slate-300 p-4">Features</th>
                                        <th className="text-center font-semibold text-slate-600 dark:text-slate-300 p-4 w-32">Free</th>
                                        <th className="text-center font-semibold text-slate-600 dark:text-slate-300 p-4 w-32">Pro</th>
                                        <th className="text-center font-semibold text-slate-600 dark:text-slate-300 p-4 w-32">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planFeatures.map(feature => (
                                        <tr key={feature.name} className="border-b border-slate-200/50 dark:border-slate-800/50">
                                            <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{feature.name}</td>
                                            <td className="p-4 text-center text-slate-600 dark:text-slate-300">{typeof feature.free === 'boolean' ? (feature.free ? <CheckIcon className="w-5 h-5 text-teal-500 mx-auto" /> : '—') : feature.free}</td>
                                            <td className="p-4 text-center text-slate-600 dark:text-slate-300">{typeof feature.pro === 'boolean' ? (feature.pro ? <CheckIcon className="w-5 h-5 text-teal-500 mx-auto" /> : '—') : feature.pro}</td>
                                            <td className="p-4 text-center text-slate-600 dark:text-slate-300">{typeof feature.enterprise === 'boolean' ? (feature.enterprise ? <CheckIcon className="w-5 h-5 text-teal-500 mx-auto" /> : '—') : feature.enterprise}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                    
                    {/* FAQ Section */}
                    <div className="mt-24 max-w-3xl mx-auto">
                         <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-white">Frequently Asked Questions</h2>
                         <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-slate-800 dark:text-slate-100 list-none">
                                        {faq.question}
                                        <ChevronDownIcon className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" />
                                    </summary>
                                    <div className="mt-4 text-slate-600 dark:text-slate-400">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                         </div>
                    </div>

                 </div>
            </main>

            <Footer navigateTo={navigateTo} />
            
            {isSubModalOpen && (
                <SubscriptionModal
                    planName="Pro"
                    monthlyPrice={20}
                    initialBillingCycle={billingCycle}
                    onClose={() => setIsSubModalOpen(false)}
                    onConfirm={handleConfirmUpgrade}
                    navigateTo={navigateTo}
                />
            )}
        </div>
    );
};