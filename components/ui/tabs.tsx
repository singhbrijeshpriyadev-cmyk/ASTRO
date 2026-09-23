import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={twMerge(clsx('flex border-b border-brass-500/20 gap-1 overflow-x-auto no-scrollbar', className))}>
      {items.map(item => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={clsx(
              'px-3.5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border-b-2',
              isActive
                ? 'border-brass-400 text-brass-400 bg-brass-500/5'
                : 'border-transparent text-parchment-300 hover:text-parchment-100 hover:border-obsidian-700'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-obsidian-800 text-parchment-300 font-mono">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
