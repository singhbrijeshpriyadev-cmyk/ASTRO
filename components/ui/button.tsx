import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded tracking-wide';
    
    const variants = {
      primary: 'bg-brass-500 hover:bg-brass-400 text-obsidian-950 font-semibold shadow-sm active:translate-y-[0.5px]',
      secondary: 'bg-obsidian-800 hover:bg-obsidian-700 text-parchment-100 border border-brass-500/20',
      outline: 'bg-transparent border border-brass-500/40 text-brass-400 hover:bg-brass-500/10 hover:border-brass-500',
      ghost: 'bg-transparent text-parchment-200 hover:bg-obsidian-800 hover:text-parchment-50',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
