import React from 'react';
import { LoaderIcon } from './Icons';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    variant?: 'primary' | 'secondary' | 'ghost' | 'teal' | 'teal-gradient';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
  }
>(({ className = '', variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold outline-none transition-all duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm',
    secondary: 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500',
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500',
    teal: 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500 shadow-sm',
    'teal-gradient': 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:opacity-90 focus-visible:ring-teal-500 transform hover:scale-105',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} 
      ref={ref} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <LoaderIcon className="h-5 w-5 animate-spin" /> : children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };