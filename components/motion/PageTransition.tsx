'use client';

import React from 'react';
import { motion } from 'motion/react';
import { pageTransition } from '@/lib/motion/transitions';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function PageTransition({ children, className = '', id }: PageTransitionProps) {
  return (
    <motion.div
      key={id}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      className={className}
    >
      {children}
    </motion.div>
  );
}
