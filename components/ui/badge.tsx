import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brass' | 'positive' | 'warning' | 'subtle';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center font-mono text-[11px] px-2 py-0.5 rounded border tracking-wider uppercase';
  const variants = {
    default: 'bg-obsidian-850 text-parchment-200 border-obsidian-700',
    brass: 'bg-brass-500/10 text-brass-400 border-brass-500/30',
    positive: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
    subtle: 'bg-obsidian-900/60 text-parchment-300 border-obsidian-800',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}
