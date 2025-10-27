import React from 'react';
import { Button } from './Button';
import { XIcon, AlertTriangleIcon } from './Icons';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
            disabled={isLoading}
          >
            <XIcon className="h-6 w-6" />
          </button>

          <div className="flex items-start gap-4 mb-6">
            {isDangerous && (
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
                <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            )}
            <div className={isDangerous ? '' : 'w-full'}>
              <h2 id="confirmation-modal-title" className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant={isDangerous ? 'secondary' : 'teal'}
              className={`flex-1 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                  : ''
              }`}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
