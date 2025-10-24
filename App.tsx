import React, { useState, useEffect, useRef } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { ApiPlaygroundPage } from './pages/ApiPlaygroundPage';
import { DeepAnalysisPage } from './pages/DeepAnalysisPage';
import { StructuredOutputPage } from './pages/StructuredOutputPage';
import { MultiModalPowerPage } from './pages/MultiModalPowerPage';
import { PricingPage } from './pages/PricingPage';
import { useAuth } from './contexts/AuthContext';
import { LoaderIcon } from './components/Icons';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { ChatWithFilePage } from './pages/ChatWithFilePage';
import { SummarizerPage } from './pages/SummarizerPage';
import { ReportGeneratorPage } from './pages/ReportGeneratorPage';
import { DataVisualizationPage } from './pages/DataVisualizationPage';
import { DataCleaningPage } from './pages/DataCleaningPage';
import { CollaborationPage } from './pages/CollaborationPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';

export type Page = 
  'landing' | 'dashboard' | 'about' | 'contact' | 'privacy' | 'terms' | 
  'chat' | 'settings' | 'playground' | 'deep-analysis' | 'structured-output' | 
  'multi-modal-power' | 'pricing' | 
  // New Feature Pages
  'chat-pdf' | 'chat-doc' | 'chat-bi' | 'summarizer' | 'report-generator' | 
  'data-visualization' | 'data-cleaning' | 'collaboration' | 'update-password';

// Helper hook to get the previous value of a state or prop.
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const App: React.FC = () => {
  const { isAuthenticated, isLoading, authEvent } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const prevIsAuthenticated = usePrevious(isAuthenticated);

  // Effect to handle redirection based on authentication status changes.
  useEffect(() => {
    if (isLoading) {
      return; // Wait until authentication status is resolved.
    }
    
    // Handle password recovery first, as it's a special authenticated state
    if (authEvent === 'PASSWORD_RECOVERY') {
        if (currentPage !== 'update-password') {
            setCurrentPage('update-password');
        }
        return;
    }


    // Case 1: User just logged in (and not for password recovery). Redirect them to the dashboard.
    if (!prevIsAuthenticated && isAuthenticated) {
      setCurrentPage('dashboard');
      return;
    }

    const isProtectedRoute = [
      'dashboard', 'chat', 'settings', 'playground', 
      'deep-analysis', 'structured-output', 'multi-modal-power',
      'chat-pdf', 'chat-doc', 'chat-bi', 'summarizer', 'report-generator',
      'data-visualization', 'data-cleaning', 'collaboration', 'update-password'
    ].includes(currentPage);
    
    // Case 2: User is not authenticated and is trying to access a protected route.
    if (!isAuthenticated && isProtectedRoute) {
      setCurrentPage('landing');
    }
  }, [isAuthenticated, prevIsAuthenticated, isLoading, currentPage, authEvent]);


  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on every navigation.
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoaderIcon className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  const renderPage = () => {
     // Always render UpdatePasswordPage if the auth event is for recovery
    if (authEvent === 'PASSWORD_RECOVERY' || currentPage === 'update-password') {
        if (isAuthenticated) {
            return <UpdatePasswordPage navigateTo={navigateTo} />;
        }
    }
      
    const isProtectedRoute = [
        'dashboard', 'chat', 'settings', 'playground', 
        'deep-analysis', 'structured-output', 'multi-modal-power',
        'chat-pdf', 'chat-doc', 'chat-bi', 'summarizer', 'report-generator',
        'data-visualization', 'data-cleaning', 'collaboration'
      ].includes(currentPage);

    if (isAuthenticated && isProtectedRoute) {
      return (
        <AuthenticatedLayout navigateTo={navigateTo} currentPage={currentPage}>
          {currentPage === 'dashboard' && <DashboardPage navigateTo={navigateTo} />}
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'settings' && <SettingsPage navigateTo={navigateTo} />}
          {currentPage === 'playground' && <ApiPlaygroundPage />}
          {currentPage === 'deep-analysis' && <DeepAnalysisPage navigateTo={navigateTo} />}
          {currentPage === 'structured-output' && <StructuredOutputPage navigateTo={navigateTo} />}
          {currentPage === 'multi-modal-power' && <MultiModalPowerPage navigateTo={navigateTo} />}
          {/* New Feature Routes */}
          {currentPage === 'chat-pdf' && <ChatWithFilePage mode="pdf" navigateTo={navigateTo} />}
          {currentPage === 'chat-doc' && <ChatWithFilePage mode="doc" navigateTo={navigateTo} />}
          {currentPage === 'chat-bi' && <ChatWithFilePage mode="bi" navigateTo={navigateTo} />}
          {currentPage === 'summarizer' && <SummarizerPage navigateTo={navigateTo} />}
          {currentPage === 'report-generator' && <ReportGeneratorPage navigateTo={navigateTo} />}
          {currentPage === 'data-visualization' && <DataVisualizationPage navigateTo={navigateTo} />}
          {currentPage === 'data-cleaning' && <DataCleaningPage navigateTo={navigateTo} />}
          {currentPage === 'collaboration' && <CollaborationPage navigateTo={navigateTo} />}
        </AuthenticatedLayout>
      );
    }
    
    switch (currentPage) {
      case 'landing':
        return <LandingPage navigateTo={navigateTo} />;
      case 'about':
        return <AboutPage navigateTo={navigateTo} />;
      case 'contact':
        return <ContactPage navigateTo={navigateTo} />;
      case 'privacy':
        return <PrivacyPolicyPage navigateTo={navigateTo} />;
      case 'terms':
        return <TermsOfServicePage navigateTo={navigateTo} />;
      case 'pricing':
        return <PricingPage navigateTo={navigateTo} />;
      default:
        // Fallback to the correct home page based on auth status.
        return isAuthenticated ? (
          <AuthenticatedLayout navigateTo={navigateTo} currentPage="dashboard">
            <DashboardPage navigateTo={navigateTo} />
          </AuthenticatedLayout>
        ) : <LandingPage navigateTo={navigateTo} />;
    }
  };

  return <>{renderPage()}</>;
};

export default App;
