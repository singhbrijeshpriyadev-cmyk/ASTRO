'use client';

import React from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = motionTokens.duration.normal,
  yOffset = 8,
  className = '',
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: motionTokens.ease.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
