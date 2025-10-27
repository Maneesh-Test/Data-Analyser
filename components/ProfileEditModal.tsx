import React, { useState, FormEvent } from 'react';
import { Button } from './Button';
import { XIcon } from './Icons';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../supabase/client';

interface ProfileEditModalProps {
  onClose: () => void;
  userId: string;
  currentValue: string;
  fieldName: 'full_name' | 'username' | 'avatar_url';
  fieldLabel: string;
  onSuccess: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  onClose,
  userId,
  currentValue,
  fieldName,
  fieldLabel,
  onSuccess,
}) => {
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      addToast(`${fieldLabel} cannot be empty`, 'error');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ [fieldName]: value.trim() })
        .eq('id', userId);

      if (error) {
        if (error.code === '23505') {
          addToast('Username already taken', 'error');
        } else {
          throw error;
        }
      } else {
        addToast(`${fieldLabel} updated successfully`, 'success');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast(`Failed to update ${fieldLabel.toLowerCase()}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-modal-title"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>

          <h2 id="profile-edit-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Change {fieldLabel}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="field-value" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                New {fieldLabel}
              </label>
              <input
                id="field-value"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500"
                placeholder={`Enter new ${fieldLabel.toLowerCase()}`}
                disabled={isLoading}
                autoFocus
              />
              {fieldName === 'username' && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Username must be unique and contain only letters, numbers, and underscores
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="teal"
                className="flex-1"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
