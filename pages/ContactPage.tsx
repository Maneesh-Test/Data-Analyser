import React from 'react';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { LogoIcon } from '../components/Icons';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../App';
import { ThemeToggle } from '../components/ThemeToggle';

interface ContactPageProps {
  navigateTo: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigateTo }) => {
  const { isAuthenticated } = useAuth();
  const homePage = isAuthenticated ? 'dashboard' : 'landing';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle form submission.
    alert('Thank you for your message!');
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

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 text-center mb-2">Contact Us</h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Have questions or feedback? We'd love to hear from you.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" id="name" required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" id="email" required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea id="message" rows={5} required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500"></textarea>
            </div>
            <div className="text-center">
              <Button type="submit" variant="teal-gradient" size="lg">Send Message</Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};