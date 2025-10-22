import React from 'react';
import { LogoIcon, LinkedInIcon, InstagramIcon, XIcon as TwitterIcon } from './Icons';
import { Page } from '../App';

interface FooterProps {
    navigateTo: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
    // This handler is now only for external/social media links if needed.
    const handlePlaceholderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // In a real app, this would navigate to the social media page.
    };
    
    return (
        <footer className="bg-slate-900 dark:bg-black/50 text-slate-400">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 lg:col-span-2">
                        <button onClick={() => navigateTo('landing')} className="inline-flex items-center gap-3 mb-4">
                            <LogoIcon className="h-8 w-8 text-teal-500" />
                            <h1 className="text-2xl font-bold tracking-tight text-white">Prism AI</h1>
                        </button>
                        <p className="text-sm max-w-xs">The smartest way to understand your files.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-200 tracking-wider uppercase text-sm mb-4">Product</h3>
                        <ul className="space-y-3">
                            {/* These links scroll on the landing page. On other pages, they navigate to the landing page. */}
                            <li><a href="/#features" onClick={(e) => { e.preventDefault(); navigateTo('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView(), 0); }} className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="/#how-it-works" onClick={(e) => { e.preventDefault(); navigateTo('landing'); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView(), 0);}} className="hover:text-white transition-colors">How it Works</a></li>
                            <li><a href="/#testimonials" onClick={(e) => { e.preventDefault(); navigateTo('landing'); setTimeout(() => document.getElementById('testimonials')?.scrollIntoView(), 0);}} className="hover:text-white transition-colors">Testimonials</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-200 tracking-wider uppercase text-sm mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">About Us</button></li>
                            <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-200 tracking-wider uppercase text-sm mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Prism AI. All Rights Reserved.</p>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <a href="#" onClick={handlePlaceholderClick} aria-label="LinkedIn" className="hover:text-white transition-colors"><LinkedInIcon className="w-5 h-5" /></a>
                        <a href="#" onClick={handlePlaceholderClick} aria-label="Instagram" className="hover:text-white transition-colors"><InstagramIcon className="w-5 h-5" /></a>
                        <a href="#" onClick={handlePlaceholderClick} aria-label="Twitter" className="hover:text-white transition-colors"><TwitterIcon className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};