import React, { useState, FormEvent } from 'react';
import { Button } from './Button';
import { XIcon, EyeIcon, EyeOffIcon, CheckCircleIcon, GoogleIcon, GitHubIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const { login, signup, sendPasswordReset, loginWithProvider, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signup(email, password);
        setIsSignupSuccess(true);
      } else if (mode === 'forgotPassword') {
        await sendPasswordReset(email);
        setIsResetSent(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      if (mode === 'forgotPassword' && errorMessage.includes('Error sending recovery email')) {
        setError('Could not send recovery email. This may be a temporary issue. Please try again later or contact support.');
      } else {
        setError(errorMessage);
      }
    }
  };
  
  const handleProviderLogin = async (provider: 'google' | 'github') => {
    try {
      await loginWithProvider(provider);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to sign in with ${provider}.`);
    }
  };
  
  const switchMode = (newMode: 'login' | 'signup' | 'forgotPassword') => {
    setMode(newMode);
    setError(null);
    setEmail('');
    setPassword('');
    setIsResetSent(false);
    setIsSignupSuccess(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
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
          ) : isResetSent ? (
            <div className="text-center">
                <CheckCircleIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Check your email
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    If an account exists for <strong>{email}</strong>, a password reset link has been sent.
                </p>
                <Button onClick={onClose} variant="teal" size="lg" className="w-full">
                    Close
                </Button>
            </div>
          ) : (
            <>
              <h2 id="auth-modal-title" className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create an Account'}
                {mode === 'forgotPassword' && 'Reset Your Password'}
              </h2>
              <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                {mode === 'login' && 'Sign in to continue to Prism AI.'}
                {mode === 'signup' && 'Get started with Prism AI for free.'}
                {mode === 'forgotPassword' && "We'll send you a link to reset your password."}
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
                
                {mode !== 'forgotPassword' && (
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
                )}
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                
                <Button type="submit" variant="teal" size="lg" className="w-full" isLoading={isLoading}>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgotPassword' && 'Send Reset Link'}
                </Button>
              </form>

              {mode !== 'forgotPassword' && (
                <>
                  <div className="relative flex items-center text-center my-6">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500 uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="space-y-4">
                    <Button onClick={() => handleProviderLogin('google')} type="button" variant="secondary" className="w-full gap-3">
                      <GoogleIcon className="w-5 h-5" />
                      Sign in with Google
                    </Button>
                    <Button onClick={() => handleProviderLogin('github')} type="button" variant="secondary" className="w-full gap-3">
                      <GitHubIcon className="w-5 h-5" />
                      Sign in with GitHub
                    </Button>
                  </div>
                </>
              )}
              
              <div className="text-center mt-4 text-sm space-y-2">
                {mode === 'login' && (
                    <p className="text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <button onClick={() => switchMode('signup')} className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-500">
                            Sign up
                        </button>
                    </p>
                )}
                {mode === 'signup' && (
                    <p className="text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <button onClick={() => switchMode('login')} className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-500">
                            Sign in
                        </button>
                    </p>
                )}

                {mode === 'login' ? (
                    <button
                        type="button"
                        onClick={() => switchMode('forgotPassword')}
                        className={`font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-500 ${error && error.includes('Invalid login credentials') ? 'underline' : ''}`}
                    >
                        Forgot password?
                    </button>
                ) : mode === 'forgotPassword' && (
                    <button onClick={() => switchMode('login')} className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-500">
                        Back to Sign in
                    </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};