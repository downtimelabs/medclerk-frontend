import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => (
  <div 
    onClick={onClick}
    className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 ${className}`}
  >
    {children}
  </div>
);
