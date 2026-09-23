'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'right' | 'left';
  className?: string;
}

export function SlidePanel({
  isOpen,
  onClose,
  children,
  side = 'right',
  className = '',
}: SlidePanelProps) {
  const xOffset = side === 'right' ? 40 : -40;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#061411]/70 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: xOffset }}
            transition={{
              duration: motionTokens.duration.medium,
              ease: motionTokens.ease.standard,
            }}
            className={`relative z-10 w-full max-w-md h-full bg-[#061411] border-l border-[rgba(212,175,55,0.25)] shadow-2xl p-6 overflow-y-auto ${
              side === 'right' ? 'ml-auto' : 'mr-auto'
            } ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
