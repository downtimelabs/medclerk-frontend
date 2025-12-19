import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'white' | 'danger';
  className?: string;
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer";
  
  const variants = {
    primary: "bg-[#0277BD] text-white hover:bg-[#026aa8]",
    secondary: "bg-[#E0F2F1] text-[#004D40] hover:bg-[#b2dfdb]",
    accent: "bg-[#FF9800] text-white hover:bg-[#f57c00] shadow-md hover:shadow-lg transition-all",
    ghost: "hover:bg-slate-100 text-slate-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    white: "bg-white text-[#0277BD] hover:bg-blue-50 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
