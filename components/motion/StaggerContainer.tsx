'use client';

import React from 'react';
import { motion } from 'motion/react';
import { staggerContainerVariants } from '@/lib/motion/variants';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function StaggerContainer({
  children,
  className = '',
  delay = 0.05,
  stagger = 0.06,
}: StaggerContainerProps) {
  const customVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
