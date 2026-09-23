'use client';

import React from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 18,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: motionTokens.duration.slow,
        delay,
        ease: motionTokens.ease.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
