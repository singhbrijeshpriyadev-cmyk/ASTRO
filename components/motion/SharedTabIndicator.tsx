'use client';

import React from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface SharedTabIndicatorProps {
  layoutId: string;
  className?: string;
}

export function SharedTabIndicator({
  layoutId,
  className = 'absolute inset-0 rounded-xl bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.45)] shadow-[0_0_20px_rgba(212,175,55,0.14)]',
}: SharedTabIndicatorProps) {
  return (
    <motion.span
      layoutId={layoutId}
      className={className}
      transition={motionTokens.spring.navigation}
      style={{ zIndex: 0 }}
    />
  );
}
