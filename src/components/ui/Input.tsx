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
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 
            focus:outline-none focus:ring-2 focus:ring-[#0277BD] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50
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
