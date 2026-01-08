import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 
            dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-600
            focus:outline-none focus:ring-2 focus:ring-[#0277BD]/50 focus:border-[#0277BD] 
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

