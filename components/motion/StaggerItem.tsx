'use client';

import React from 'react';
import { motion } from 'motion/react';
import { staggerItemVariants } from '@/lib/motion/variants';

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
