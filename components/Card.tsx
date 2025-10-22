
import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={`rounded-xl border bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 shadow-lg backdrop-blur-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};