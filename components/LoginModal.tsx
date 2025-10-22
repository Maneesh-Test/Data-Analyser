
import React, { useState, FormEvent } from 'react';
import { Button } from './Button';
import { XIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const { login, signup, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else {
        await signup(email, password);
        setIsSignupSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };
  
  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md m-4">
        <div className="p-8">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
          
          {isSignupSuccess ? (
             <div className="text-center">
                <CheckCircleIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Verification Email Sent
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Please check your inbox and click the link to verify your email address.
                </p>
                <Button onClick={onClose} variant="teal" size="lg" className="w-full">
                    Close
                </Button>
            </div>
          ) : (
            <>
              <h2 id="auth-modal-title" className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                {mode === 'login' ? 'Sign in to continue to Prism AI.' : 'Get started with Prism AI for free.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
              <div className="text-center mt-4">
                <button onClick={toggleMode} className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-500 font-medium">
                  {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};