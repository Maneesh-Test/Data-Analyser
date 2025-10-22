import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XIcon, InfoIcon } from '../components/Icons';

// --- Toast Component (colocated for simplicity) ---

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const typeStyles = {
  success: {
    icon: <CheckCircleIcon className="w-6 h-6 text-emerald-500" />,
    bar: 'bg-emerald-500',
  },
  error: {
    icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
    bar: 'bg-red-500',
  },
  info: {
    icon: <InfoIcon className="w-6 h-6 text-sky-500" />,
    bar: 'bg-sky-500',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Effect for animation and auto-dismissal
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, []); // onDismiss is not needed here as it's wrapped in useCallback

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for fade-out animation
  }, [onDismiss]);

  const styles = typeStyles[type];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-4 w-full max-w-sm p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.bar}`}></div>
      <div className="flex-shrink-0 ml-2">{styles.icon}</div>
      <div className="flex-grow text-sm text-slate-700 dark:text-slate-300 pr-6">
        {message}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full transition-colors"
        aria-label="Dismiss notification"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};


// --- Toast Context & Provider ---

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts(prevToasts => [...prevToasts, { id: toastId++, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div aria-live="assertive" className="fixed top-4 right-4 z-[100] space-y-3 w-full max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onDismiss={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};