import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-obsidian-900/90 border border-brass-500/20 rounded-md p-4 sm:p-5 backdrop-blur-sm shadow-md',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('flex flex-col space-y-1 pb-3 border-b border-brass-500/10 mb-4', className))} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={twMerge(clsx('font-serif text-lg tracking-wide text-parchment-100 flex items-center justify-between', className))} {...props}>
      {children}
    </h3>
  );
}
