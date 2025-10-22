import React, { useState, useEffect } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { ChatPage } from './pages/ChatPage';
import { useAuth } from './contexts/AuthContext';
import { LoaderIcon } from './components/Icons';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';

export type Page = 'landing' | 'dashboard' | 'about' | 'contact' | 'privacy' | 'terms' | 'chat';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  // Effect to handle redirection based on authentication status.
  useEffect(() => {
    if (!isLoading) {
      const isProtectedRoute = currentPage === 'dashboard' || currentPage === 'chat';
      
      if (isAuthenticated && currentPage === 'landing') {
        // If logged in and on landing, redirect to dashboard.
        setCurrentPage('dashboard');
      } else if (!isAuthenticated && isProtectedRoute) {
        // If not logged in and trying to access a protected page, redirect to landing.
        setCurrentPage('landing');
      }
    }
  }, [isAuthenticated, isLoading, currentPage]);


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
    const isProtectedRoute = currentPage === 'dashboard' || currentPage === 'chat';

    if (isAuthenticated && isProtectedRoute) {
      return (
        <AuthenticatedLayout navigateTo={navigateTo} currentPage={currentPage}>
          {currentPage === 'dashboard' ? <DashboardPage /> : <ChatPage />}
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
      default:
        // Fallback to the correct home page based on auth status.
        return isAuthenticated ? (
          <AuthenticatedLayout navigateTo={navigateTo} currentPage="dashboard">
            <DashboardPage />
          </AuthenticatedLayout>
        ) : <LandingPage navigateTo={navigateTo} />;
    }
  };

  return <>{renderPage()}</>;
};

export default App;