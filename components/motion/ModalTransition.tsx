'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { modalBackdropTransition, modalPanelTransition } from '@/lib/motion/transitions';

interface ModalTransitionProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function ModalTransition({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth = 'max-w-xl',
}: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={modalBackdropTransition.initial}
            animate={modalBackdropTransition.animate}
            exit={modalBackdropTransition.exit}
            onClick={onClose}
            className="fixed inset-0 bg-[#061411]/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content Panel */}
          <motion.div
            initial={modalPanelTransition.initial}
            animate={modalPanelTransition.animate}
            exit={modalPanelTransition.exit}
            className={`relative z-10 w-full ${maxWidth} bg-[#061411] border border-[rgba(212,175,55,0.30)] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-6 overflow-hidden ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
