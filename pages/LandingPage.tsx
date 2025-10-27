import React, { useState, useEffect, useRef } from 'react';
import { LoginModal } from '../components/LoginModal';
import { 
    LogoIcon, ZapIcon, FileTextIcon, ImageIcon, CpuIcon, QuoteIcon, BrainCircuitIcon, 
    GoogleIcon, OpenAIIcon, AnthropicIcon, ChevronDownIcon, ArrowRightIcon
} from '../components/Icons';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

// Custom hook to detect when an element is on screen for animations
const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible] as const;
};

// --- Page Data ---
const features = [
  {
    title: 'Intelligent Document Processing',
    description: 'Effortlessly digest dense reports, legal contracts, or research papers. Prism extracts key takeaways, identifies themes, and structures information.',
    visual: (
      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 p-6 flex items-center justify-center text-slate-400 dark:text-slate-600 overflow-hidden">
        {/* Document background */}
        <FileTextIcon className="w-40 h-40 opacity-20 dark:opacity-10" />
        {/* Animated highlights */}
        <div className="absolute w-3/4 h-3/4 space-y-2">
            <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-2 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-full transition-all duration-300 group-hover:bg-teal-500/40 group-hover:w-full"></div>
            <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-2 w-5/6 bg-slate-300 dark:bg-slate-700 rounded-full transition-all duration-300 delay-100 group-hover:bg-teal-500/40 group-hover:w-full"></div>
             <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    ),
  },
  {
    title: 'Visual Insight Engine',
    description: 'Go beyond pixels. Our AI analyzes images to provide rich descriptions, identify objects, and even interpret the underlying context and sentiment.',
    visual: (
       <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 p-6 flex items-center justify-center text-slate-400 dark:text-slate-600 overflow-hidden">
         <ImageIcon className="w-32 h-32 opacity-20 dark:opacity-10 transition-transform duration-300 group-hover:scale-110" />
         {/* Animated tags */}
         <div className="absolute top-1/4 left-8 bg-white/80 dark:bg-slate-900/80 px-2 py-1 text-xs rounded-md shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-2">Object: Mountain</div>
         <div className="absolute top-1/2 right-4 bg-white/80 dark:bg-slate-900/80 px-2 py-1 text-xs rounded-md shadow-lg opacity-0 transition-all duration-300 delay-100 group-hover:opacity-100 group-hover:translate-x-2">Mood: Serene</div>
         <div className="absolute bottom-1/4 left-12 bg-white/80 dark:bg-slate-900/80 px-2 py-1 text-xs rounded-md shadow-lg opacity-0 transition-all duration-300 delay-200 group-hover:opacity-100 group-hover:-translate-x-2">Style: Photorealistic</div>
       </div>
    ),
  },
  {
    title: 'Best-in-Class AI on Demand',
    description: 'Harness the specialized strengths of the world\'s leading AI. Seamlessly switch between models like Google\'s Gemini, OpenAI\'s GPT-4o, and more.',
    visual: (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 p-6 flex items-center justify-center text-slate-400 dark:text-slate-500 overflow-hidden">
            <div className="relative w-full h-full">
                <GoogleIcon className="w-10 h-10 absolute top-1/4 left-1/4 transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2" />
                <OpenAIIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-125" />
                <AnthropicIcon className="w-10 h-10 absolute bottom-1/4 right-1/4 transition-all duration-300 group-hover:scale-125 group-hover:translate-y-2" />
            </div>
        </div>
    ),
  },
  {
    title: 'Transparent Reasoning',
    description: "Understand the 'how' behind the analysis. Opt-in to receive a detailed, step-by-step explanation, providing transparency and building trust.",
    visual: (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 p-6 flex items-center justify-center text-slate-400 dark:text-slate-600 overflow-hidden">
            <BrainCircuitIcon className="w-24 h-24 opacity-20 dark:opacity-10 transition-transform duration-300 group-hover:rotate-6" />
            <div className="absolute w-3/4 h-3/4 flex flex-col justify-center items-center space-y-2">
                <div className="flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="text-sm font-mono text-teal-600 dark:text-teal-400">Step 1</span>
                    <div className="w-16 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 opacity-0 transition-all duration-300 delay-100 group-hover:opacity-100">
                    <span className="text-sm font-mono text-teal-600 dark:text-teal-400">Step 2</span>
                    <div className="w-24 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 opacity-0 transition-all duration-300 delay-200 group-hover:opacity-100">
                    <span className="text-sm font-mono text-teal-600 dark:text-teal-400">Step 3</span>
                    <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                </div>
            </div>
        </div>
    ),
  },
];

const testimonials = [
    {
        quote: "Prism AI has completely transformed how we process client documents. What used to take hours of manual review now takes seconds. It's a game-changer for our legal team.",
        author: {
            name: "Priya Sharma",
            title: "Lead Counsel, Axiom Legal",
            avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286de2?q=80&w=256&h=256&fit=crop&crop=faces"
        }
    },
    {
        quote: "The accuracy of the image analysis is astounding. We use it to automatically tag and categorize our entire product catalog, saving us hundreds of hours.",
        author: {
            name: "Rohan Mehta",
            title: "E-commerce Head, Desi Threads",
            avatarUrl: "https://images.unsplash.com/photo-1598647318728-4033b669d5f7?q=80&w=256&h=256&fit=crop&crop=faces"
        }
    },
    {
        quote: "As a data analyst, Prism AI is my secret weapon. It helps me quickly understand dense reports and extract critical information for my dashboards. A must-have tool.",
        author: {
            name: "Arjun Desai",
            title: "Senior Analyst, FinCorp",
            avatarUrl: "https://images.unsplash.com/photo-1504593811423-6df665776f53?q=80&w=256&h=256&fit=crop&crop=faces"
        }
    }
]

const Step: React.FC<{ number: string; title: string; children: React.ReactNode; isVisible: boolean; delay: string }> = ({ number, title, children, isVisible, delay }) => (
    <div 
        className={`flex flex-col items-center text-center max-w-sm transition-opacity duration-700 ${isVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: delay }}
    >
        <div className="flex-shrink-0 w-12 h-12 mb-4 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-teal-500 text-teal-600 text-xl font-bold rounded-full">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>
        </div>
    </div>
);

interface LandingPageProps {
  navigateTo: (page: Page) => void;
}

interface Feature {
  name: string;
  action: () => void;
  requiresAuth?: boolean;
}

interface FeatureCategory {
  title: string;
  features: Feature[];
}

const FEATURE_CATEGORIES = (navigateTo: (page: Page) => void): FeatureCategory[] => [
  {
    title: 'AI Tools',
    features: [
      { name: 'AI Chatbot', action: () => navigateTo('chat'), requiresAuth: true },
      { name: 'ChatPDF', action: () => navigateTo('chat-pdf'), requiresAuth: true },
      { name: 'ChatDoc', action: () => navigateTo('chat-doc'), requiresAuth: true },
      { name: 'AI Summarizer', action: () => navigateTo('summarizer'), requiresAuth: true },
      { name: 'AI Report Generator', action: () => navigateTo('report-generator'), requiresAuth: true }
    ]
  },
  {
    title: 'Advanced Analytics',
    features: [
        { name: 'Data Visualization', action: () => navigateTo('data-visualization'), requiresAuth: true },
        { name: 'AI Graph Maker', action: () => navigateTo('data-visualization'), requiresAuth: true },
        { name: 'ChatBI', action: () => navigateTo('chat-bi'), requiresAuth: true },
        { name: 'AI Data Cleaning', action: () => navigateTo('data-cleaning'), requiresAuth: true }
    ]
  },
  {
    title: 'Collaboration',
    features: [
        { name: 'Dataset Sharing', action: () => navigateTo('collaboration'), requiresAuth: true },
        { name: 'Chat Sharing', action: () => navigateTo('collaboration'), requiresAuth: true }
    ]
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ navigateTo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const [howItWorksRef, isHowItWorksVisible] = useOnScreen({ threshold: 0.1 });
  const [featuresRef, isFeaturesVisible] = useOnScreen({ threshold: 0.1 });
  const [testimonialsRef, isTestimonialsVisible] = useOnScreen({ threshold: 0.1 });
  const [ctaDemoRef, isCtaDemoVisible] = useOnScreen({ threshold: 0.1 });
  
  const featuresDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target as Node)) {
        setIsFeaturesOpen(false);
      }
    };

    if (isFeaturesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFeaturesOpen]);

  const handleFeatureClick = (feature: Feature) => {
    if (feature.requiresAuth && !isAuthenticated) {
      setIsModalOpen(true);
    } else {
      feature.action();
    }
    setIsFeaturesOpen(false);
  };
  
  const featureCategories = FEATURE_CATEGORIES(navigateTo);

  return (
    <>
      <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('landing'); }} className="inline-flex items-center gap-3">
                <LogoIcon className="h-8 w-8 text-teal-600" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Prism AI
                </h1>
              </a>
              <nav className="hidden lg:flex items-center gap-6">
                <div 
                  className="relative"
                  ref={featuresDropdownRef}
                >
                  <button 
                    onClick={() => setIsFeaturesOpen(prev => !prev)}
                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                  >
                    <span>Features</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isFeaturesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-screen max-w-4xl animate-slide-up-fade-in" style={{animationDuration: '0.3s'}}>
                      <div className="bg-slate-900/95 dark:bg-[#1C1C1C]/95 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {featureCategories.map(category => (
                            <div key={category.title}>
                              <h3 className="text-sm font-semibold text-slate-400 mb-4">{category.title}</h3>
                              <ul className="space-y-3">
                                {category.features.map(feature => (
                                  <li key={feature.name}>
                                    <button onClick={(e) => { e.preventDefault(); handleFeatureClick(feature); }} className="text-slate-300 hover:text-white transition-colors duration-200 text-base text-left w-full">
                                      {feature.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                    onClick={() => navigateTo('pricing')}
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                >
                    Pricing
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button onClick={() => navigateTo('dashboard')} variant="teal" size="md" className="gap-2">
                  <span>Dashboard</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button onClick={() => setIsModalOpen(true)} variant="secondary" size="md">
                    Login
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)} variant="teal" size="md" className="hidden sm:inline-flex">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main>
          <section className="hero-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-800 dark:text-slate-100 leading-tight">
                  Unlock Insights from Any File, Instantly.
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Prism AI leverages state-of-the-art language models to analyze your documents, images, and more. Simply upload a file and get a detailed, structured analysis in seconds.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <Button onClick={() => isAuthenticated ? navigateTo('dashboard') : setIsModalOpen(true)} variant="teal-gradient" size="lg" className="gap-2.5">
                    <ZapIcon className="h-5 w-5" />
                    Start Analyzing for Free
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* How it works Section */}
          <section ref={howItWorksRef} id="how-it-works" className="py-20 sm:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-700 ${isHowItWorksVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}>
                      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">Get Your Analysis in 3 Simple Steps</h2>
                      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">Our streamlined process makes getting insights effortless.</p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-8">
                      <Step number="1" title="Select Your Model" isVisible={isHowItWorksVisible} delay="200ms">Choose from our list of powerful AI models to best suit your analysis needs.</Step>
                      <Step number="2" title="Upload Your File(s)" isVisible={isHowItWorksVisible} delay="400ms">Drag and drop or select any supported file from your device.</Step>
                      <Step number="3" title="Get Instant Insights" isVisible={isHowItWorksVisible} delay="600ms">Receive a structured, easy-to-read analysis in just a few seconds.</Step>
                  </div>
              </div>
          </section>

          {/* Features Section */}
          <section ref={featuresRef} id="features" className="relative py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-10 w-72 h-72 bg-teal-300 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 dark:bg-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-700 ${isFeaturesVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}>
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/50 rounded-full border border-teal-200 dark:border-teal-800">
                  <ZapIcon className="w-4 h-4 mr-2" />
                  Powerful Features
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  From Data Chaos to Actionable Clarity
                </h2>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Prism AI goes beyond simple analysis, transforming your raw files into structured intelligence that saves you time and drives better decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                   <div
                    key={feature.title}
                    className={`group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all duration-500 overflow-hidden hover:scale-[1.03] hover:shadow-2xl hover:shadow-teal-500/20 dark:hover:shadow-teal-500/20 hover:border-teal-300 dark:hover:border-teal-700 ${isFeaturesVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${200 * (index + 1)}ms` }}
                   >
                     {/* Gradient overlay on hover */}
                     <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-500"></div>

                     {/* Visual Area */}
                     <div className="relative h-52 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        {feature.visual}
                     </div>

                     {/* Text Content */}
                     <div className="relative p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>

                        {/* Decorative bottom line */}
                        <div className="mt-6 w-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full group-hover:w-full transition-all duration-500"></div>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA / Demo section */}
          <section ref={ctaDemoRef} className="py-20 sm:py-32 hero-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-center max-w-3xl mx-auto transition-opacity duration-700 ${isCtaDemoVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">From Chaos to Clarity</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Stop wasting time on manual analysis. See how Prism AI transforms raw data into structured, actionable insights instantly.
                </p>
              </div>
              
              <div className={`relative mt-16 max-w-5xl mx-auto transition-opacity duration-700 ${isCtaDemoVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                 <div className="absolute inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-lg opacity-50"></div>
                 <div className="relative grid md:grid-cols-2 gap-px bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl">
                    <div className="p-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">Before: Raw Text</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-4 rounded-md font-mono h-48 overflow-y-auto">
                          Project Titan Report Q2 2024: Revenue increased by 15% to $2.5M, driven by the new marketing campaign. Key challenges include supply chain delays and increased competition. User engagement is up 20% MoM. Recommendation: Invest in logistics.
                        </p>
                    </div>
                    <div className="p-6 bg-teal-500/5 dark:bg-teal-500/10 rounded-lg">
                        <h3 className="font-bold text-teal-700 dark:text-teal-400 text-lg mb-2">After: AI Analysis</h3>
                        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                           <p><strong>Summary:</strong> The Q2 report for Project Titan shows a 15% revenue growth to $2.5M, attributed to a new marketing campaign...</p>
                           <p><strong>Key Points:</strong></p>
                           <ul className="list-disc list-inside text-sm">
                                <li>Revenue: $2.5M (+15%)</li>
                                <li>User Engagement: +20% MoM</li>
                                <li>Challenges: Supply chain, competition</li>
                           </ul>
                        </div>
                    </div>
                 </div>
              </div>
              <div className="text-center mt-12">
                 <Button onClick={() => isAuthenticated ? navigateTo('dashboard') : setIsModalOpen(true)} variant="teal-gradient" size="lg">Sign Up & Analyze for Free</Button>
              </div>
            </div>
          </section>


          {/* Testimonials */}
          <section ref={testimonialsRef} id="testimonials" className="py-20 sm:py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-700 ${isTestimonialsVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">Trusted by Innovators</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">See what professionals are saying about Prism AI.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                      <div 
                        key={testimonial.author.name}
                        className={`bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 transition-opacity duration-700 ${isTestimonialsVisible ? 'animate-slide-up-fade-in' : 'opacity-0'}`}
                        style={{ animationDelay: `${200 * (index + 1)}ms` }}
                      >
                          <QuoteIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-4" />
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">{testimonial.quote}</p>
                          <div className="flex items-center">
                              <img className="w-12 h-12 rounded-full object-cover" src={testimonial.author.avatarUrl} alt={`Avatar of ${testimonial.author.name}`} />
                              <div className="ml-4">
                                  <p className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.author.name}</p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.author.title}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer navigateTo={navigateTo} />

      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};