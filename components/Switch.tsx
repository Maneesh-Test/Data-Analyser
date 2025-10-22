import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch: React.FC<SwitchProps> = ({ className, ...props }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" {...props} />
      <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-500/80 dark:peer-focus:ring-teal-600/80 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
    </label>
  );
};