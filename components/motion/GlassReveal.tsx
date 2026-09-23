'use client';

import React from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface GlassRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  showReflection?: boolean;
}

export function GlassReveal({
  children,
  className = '',
  delay = 0,
  showReflection = true,
}: GlassRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: motionTokens.duration.slow,
        delay,
        ease: motionTokens.ease.elegant,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Extremely subtle glass light reflection sweep (Requirement 41) */}
      {showReflection && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.035)] to-transparent skew-x-12 select-none"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            repeatDelay: 12,
            duration: 10,
            ease: 'linear',
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
