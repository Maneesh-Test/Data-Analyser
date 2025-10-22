import React from 'react';
import { Button } from './Button';
import { XIcon, LogOutIcon, UserCircleIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm m-4">
        <div className="p-8 text-center">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Close profile modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
          
          <UserCircleIcon className="h-20 w-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          
          <h2 id="profile-modal-title" className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 truncate">
            {user ? user.email : 'Not logged in'}
          </p>

          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <Button 
                onClick={handleLogout} 
                variant="secondary" 
                className="w-full gap-2"
            >
              <LogOutIcon className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};