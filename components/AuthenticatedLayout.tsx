import React, { useState } from 'react';
import { Page } from '../App';
import { AccountPopover } from './AccountPopover';
import { LogoIcon, PlusIcon, BarChartIcon, MenuIcon, CompassIcon, FileTextIcon, BarChart2Icon, ListOrderedIcon } from './Icons';
import { Button } from './Button';
import { useChatActions } from '../contexts/ChatContext';

interface AuthenticatedLayoutProps {
  navigateTo: (page: Page) => void;
  currentPage: Page;
  children: React.ReactNode;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  navigateTo: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ page, currentPage, navigateTo, icon, label }) => {
  const isActive = currentPage === page || (page === 'chat-pdf' && ['chat-doc', 'chat-bi'].includes(currentPage));
  return (
    <button
      onClick={() => navigateTo(page)}
      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ navigateTo, currentPage, children }) => {
  const { startNewChat } = useChatActions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNewChatClick = () => {
    if (currentPage !== 'chat') {
      navigateTo('chat');
    }
    // Use a timeout to ensure the ChatPage component has mounted and set its handler
    setTimeout(() => {
      startNewChat();
    }, 50);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  const handleNavigation = (page: Page) => {
    navigateTo(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  const SidebarContent = () => (
    <>
      <button onClick={() => handleNavigation('landing')} className="flex items-center gap-3 mb-6 px-2 text-left">
        <LogoIcon className="h-8 w-8 text-teal-600" />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Prism AI
        </h1>
      </button>
      <div className="px-1 mb-4">
        <Button onClick={handleNewChatClick} variant="teal" size="md" className="w-full gap-2">
          <PlusIcon className="w-5 h-5" />
          New Chat
        </Button>
      </div>
      <nav className="flex-grow space-y-1">
        <NavLink
          page="dashboard"
          currentPage={currentPage}
          navigateTo={handleNavigation}
          icon={<BarChartIcon className="w-5 h-5" />}
          label="File Analysis"
        />
        <NavLink
          page="playground"
          currentPage={currentPage}
          navigateTo={handleNavigation}
          icon={<CompassIcon className="w-5 h-5" />}
          label="Playground"
        />
        <div className="pt-4">
            <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Features</h3>
            <div className="space-y-1">
                 <NavLink
                    page="chat-pdf"
                    currentPage={currentPage}
                    navigateTo={handleNavigation}
                    icon={<FileTextIcon className="w-5 h-5" />}
                    label="Chat with Document"
                />
                 <NavLink
                    page="summarizer"
                    currentPage={currentPage}
                    navigateTo={handleNavigation}
                    icon={<ListOrderedIcon className="w-5 h-5" />}
                    label="AI Summarizer"
                />
                 <NavLink
                    page="data-visualization"
                    currentPage={currentPage}
                    navigateTo={handleNavigation}
                    icon={<BarChart2Icon className="w-5 h-5" />}
                    label="Data Visualization"
                />
            </div>
        </div>
      </nav>
      <div className="mt-auto">
        <AccountPopover navigateTo={handleNavigation} currentPage={currentPage} />
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 transition-transform transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex-shrink-0 flex items-center justify-between bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="w-6 h-6" />
          </button>
          <button onClick={() => handleNavigation('landing')} className="flex items-center gap-2">
            <LogoIcon className="h-7 w-7 text-teal-600" />
            <span className="text-xl font-bold">Prism AI</span>
          </button>
          <div className="w-6"></div> {/* Placeholder to balance flexbox */}
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};