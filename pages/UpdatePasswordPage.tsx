import React, { useState } from 'react';
import { Page } from '../App';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LogoIcon, EyeIcon, EyeOffIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface UpdatePasswordPageProps {
  navigateTo: (page: Page) => void;
}

export const UpdatePasswordPage: React.FC<UpdatePasswordPageProps> = ({ navigateTo }) => {
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { updatePassword, isLoading } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password should be at least 6 characters.');
            return;
        }

        try {
            await updatePassword(password);
            addToast('Password updated successfully!', 'success');
            navigateTo('dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password.');
        }
    };

    return (
        <div className="min-h-screen font-sans flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md space-y-6">
                 <div className="flex justify-center">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('landing'); }} className="inline-flex items-center gap-3">
                        <LogoIcon className="h-12 w-12 text-teal-600" />
                    </a>
                 </div>
                <Card className="p-8">
                    <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Update Your Password</h1>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Enter a new password for your account.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type={passwordVisible ? 'text' : 'password'}
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 dark:text-slate-400"
                                aria-label={passwordVisible ? "Hide password" : "Show password"}
                            >
                                {passwordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <Button type="submit" variant="teal" size="lg" className="w-full" isLoading={isLoading}>
                            Update Password & Sign In
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
