import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => (
  <div 
    onClick={onClick}
    className={`
      rounded-2xl border border-slate-200/60 bg-white text-slate-950 shadow-premium 
      dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-50 dark:shadow-premium-dark
      backdrop-blur-sm transition-all duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

