import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  fileName?: string;
}

export const Progress: React.FC<ProgressProps> = ({ className, value = 0, fileName = '', ...props }) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${fileName} upload progress`}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-teal-500 transition-all duration-300"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </div>
  );
};