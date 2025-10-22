import React from 'react';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { LogoIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../App';
import { ThemeToggle } from '../components/ThemeToggle';

interface PrivacyPolicyPageProps {
  navigateTo: (page: Page) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ navigateTo }) => {
  const { isAuthenticated } = useAuth();
  const homePage = isAuthenticated ? 'dashboard' : 'landing';

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 flex flex-col">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <button onClick={() => navigateTo(homePage)} className="inline-flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-teal-600" />
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Prism AI</h1>
                </button>
                <ThemeToggle />
            </div>
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="p-8 md:p-12 max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mb-6">Privacy Policy</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                    <p>Your privacy is important to us. It is Prism AI's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
                    
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-6 mb-2">1. Information We Collect</h2>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. The only personal information we collect is your email address during the sign-up process.</p>
                    
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-6 mb-2">2. How We Use Your Information</h2>
                    <p>We use your email address to create and manage your account, provide you with customer support, and send you important updates or information about our services. We do not share your personally identifying information with any third-parties, except when required to by law.</p>
                    
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-6 mb-2">3. File Uploads and Analysis</h2>
                    <p>Files you upload for analysis are sent to third-party AI model providers (such as Google, OpenAI, etc.) solely for the purpose of generating the analysis you request. We do not store your files on our servers after the analysis is complete. We are not responsible for the privacy policies of these third-party AI providers.</p>
                    
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-6 mb-2">4. Data Security</h2>
                    <p>We take the security of your information seriously. We protect the data we store within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification. API keys you provide for third-party services are stored exclusively in your browser's local storage and are never transmitted to our servers.</p>
                    
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-6 mb-2">5. Links to Other Sites</h2>
                    <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
                    
                    <p>Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
                </div>
            </Card>
        </main>

        <Footer navigateTo={navigateTo} />
    </div>
  );
};