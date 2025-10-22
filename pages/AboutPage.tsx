import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeftIcon, ZapIcon, EyeIcon, UserCircleIcon, LogoIcon } from '../components/Icons';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../App';
import { ThemeToggle } from '../components/ThemeToggle';

interface AboutPageProps {
  navigateTo: (page: Page) => void;
}

const teamMembers = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286de2?q=80&w=256&h=256&fit=crop&crop=faces'
    },
    {
      name: 'Rohan Mehta',
      role: 'Lead AI Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1598647318728-4033b669d5f7?q=80&w=256&h=256&fit=crop&crop=faces'
    },
    {
      name: 'Arjun Desai',
      role: 'Head of Product',
      avatarUrl: 'https://images.unsplash.com/photo-1504593811423-6df665776f53?q=80&w=256&h=256&fit=crop&crop=faces'
    }
];

const values = [
    {
        icon: <ZapIcon className="w-6 h-6 text-teal-500" />,
        title: 'Innovation',
        description: 'We constantly push the boundaries of what AI can do to deliver cutting-edge solutions.'
    },
    {
        icon: <EyeIcon className="w-6 h-6 text-teal-500" />,
        title: 'Clarity',
        description: 'Our goal is to transform complex data into clear, understandable, and actionable insights.'
    },
    {
        icon: <UserCircleIcon className="w-6 h-6 text-teal-500" />,
        title: 'Integrity',
        description: 'We are committed to building trustworthy and ethical AI that respects user data and privacy.'
    }
]

export const AboutPage: React.FC<AboutPageProps> = ({ navigateTo }) => {
  const { isAuthenticated } = useAuth();
  const homePage = isAuthenticated ? 'dashboard' : 'landing';

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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-left">
            <Button onClick={() => navigateTo(homePage)} variant="ghost" className="pl-1 text-sm">
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Back to {isAuthenticated ? 'Dashboard' : 'Home'}
            </Button>
          </div>

          <Card className="p-8 md:p-12 text-center bg-white/80 dark:bg-slate-800/80">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">About Prism AI</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                We're on a mission to make advanced data analysis accessible to everyone.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                In a world overflowing with data, clarity is the ultimate advantage. At Prism AI, our mission is to empower individuals and organizations to unlock the hidden potential within their files. We build intuitive, powerful tools that transform raw data—from dense legal documents to vibrant images—into structured, actionable insights. We believe that by simplifying complexity, we can fuel innovation, accelerate decision-making, and create a smarter, more efficient future for all.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Our Values</h3>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                {values.map(value => (
                    <div key={value.title} className="flex flex-col">
                        <div className="flex-shrink-0 mb-3">{value.icon}</div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{value.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{value.description}</p>
                    </div>
                ))}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Meet the Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {teamMembers.map(member => (
                <div key={member.name} className="text-center">
                  <img 
                    src={member.avatarUrl} 
                    alt={`Photo of ${member.name}`} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-slate-700 shadow-md"
                  />
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</h4>
                  <p className="text-sm text-teal-600 dark:text-teal-400">{member.role}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};