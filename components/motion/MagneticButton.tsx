'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  className?: string;
}

export function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: MagneticButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#D4AF37] via-[#F2D675] to-[#D4AF37] text-[#061411] font-semibold shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.40)]';
      case 'secondary':
        return 'bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.30)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.18)] hover:border-[rgba(212,175,55,0.50)] hover:text-[#F2D675]';
      case 'glass':
        return 'bg-[rgba(11,33,27,0.60)] border border-[rgba(255,255,255,0.14)] text-[#F5F4EC] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.30)]';
      case 'ghost':
        return 'text-[#AABDB7] hover:text-[#F5F4EC] hover:bg-[rgba(255,255,255,0.04)]';
      default:
        return '';
    }
  };

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        duration: motionTokens.duration.fast,
        ease: motionTokens.ease.standard,
      }}
      className={`inline-flex items-center justify-center transition-colors cursor-pointer select-none ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
