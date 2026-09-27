'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass } from 'lucide-react';

interface ActiveReceptorSlotProps {
  slotNumber: number;
  title: string;
  subtitle: string;
  isActive: boolean;
  isDrawing: boolean;
  hoveredCardIndex: number | null;
}

export function ActiveReceptorSlot({
  slotNumber,
  title,
  subtitle,
  isActive,
  isDrawing,
  hoveredCardIndex,
}: ActiveReceptorSlotProps) {
  const isHoverResonating = isActive && hoveredCardIndex !== null && !isDrawing;

  return (
    <div className="flex flex-col items-center w-[180px] sm:w-[200px] select-none">
      {/* Slot Header Labels */}
      <div className="text-center mb-3">
        <span
          className={`text-[11px] font-mono tracking-widest uppercase font-bold block transition-colors duration-300 ${
            isActive
              ? 'text-[#F2D675] drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]'
              : 'text-[#AABDB7]'
          }`}
        >
          {title}
        </span>
        <span className="text-[10px] font-sans text-[#8BB5A8] block">
          {subtitle}
        </span>
      </div>

      {/* Target Slot Altar Stage */}
      <motion.div
        animate={
          isActive
            ? {
                scale: isDrawing ? [1, 1.05, 1.02] : isHoverResonating ? 1.03 : [1, 1.02, 1],
                borderColor: isDrawing
                  ? 'rgba(242,214,117,0.9)'
                  : isHoverResonating
                  ? 'rgba(212,175,55,0.85)'
                  : ['rgba(212,175,55,0.35)', 'rgba(0,155,119,0.75)', 'rgba(212,175,55,0.35)'],
                boxShadow: isDrawing
                  ? '0 0 45px rgba(242,214,117,0.5), 0 0 25px rgba(0,155,119,0.4), inset 0 0 25px rgba(212,175,55,0.2)'
                  : isHoverResonating
                  ? '0 0 35px rgba(212,175,55,0.4), 0 0 20px rgba(0,107,91,0.3)'
                  : [
                      '0 0 15px rgba(212,175,55,0.15)',
                      '0 0 30px rgba(0,155,119,0.35)',
                      '0 0 15px rgba(212,175,55,0.15)',
                    ],
              }
            : {}
        }
        transition={{
          duration: isDrawing ? 0.6 : 2.4,
          repeat: isDrawing ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        className={`relative w-[180px] sm:w-[200px] aspect-[7/12] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 backdrop-blur-md overflow-hidden transition-all duration-300 ${
          isActive
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(16,42,35,0.6)_0%,rgba(6,20,17,0.85)_100%)]'
            : 'border-[rgba(212,175,55,0.2)] bg-[rgba(6,20,17,0.35)]'
        }`}
      >
        {/* ======================================================== */}
        {/* SACRED GEOMETRY BACKGROUND RINGS (When Active)           */}
        {/* ======================================================== */}
        {isActive && (
          <>
            {/* Outer Astrolabe Cardinal Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: isHoverResonating ? 12 : 24, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[230px] h-[230px] rounded-full pointer-events-none opacity-20 border border-[rgba(212,175,55,0.6)]"
              style={{
                borderStyle: 'dashed',
              }}
            />

            {/* Inner Sacred Geometry Octagram */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: isHoverResonating ? 10 : 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[150px] h-[150px] rounded-full pointer-events-none opacity-25 border border-[rgba(0,155,119,0.7)]"
              style={{
                borderStyle: 'dotted',
              }}
            />

            {/* Subtle Ethereal Attractor Nebula */}
            <motion.div
              animate={{
                scale: isHoverResonating ? [0.9, 1.25, 0.95] : [0.85, 1.15, 0.85],
                opacity: isHoverResonating ? [0.35, 0.65, 0.35] : [0.2, 0.45, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.25) 0%, rgba(123,3,35,0.18) 45%, transparent 75%)',
                filter: 'blur(16px)',
              }}
            />
          </>
        )}

        {/* Central Glyph Portal */}
        <div
          className={`relative z-10 w-14 h-14 rounded-full border border-dashed flex items-center justify-center mb-3 transition-all duration-300 ${
            isActive
              ? isDrawing
                ? 'border-[#F2D675] bg-[rgba(242,214,117,0.22)] text-[#F2D675] shadow-[0_0_20px_rgba(242,214,117,0.7)]'
                : isHoverResonating
                ? 'border-[#F2D675] bg-[rgba(212,175,55,0.18)] text-[#F2D675] shadow-[0_0_16px_rgba(212,175,55,0.6)] scale-110'
                : 'border-[#D4AF37] bg-[rgba(212,175,55,0.10)] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.35)]'
              : 'border-[rgba(0,155,119,0.35)] text-[#D4AF37]/50'
          }`}
        >
          {isActive ? (
            <motion.div
              animate={{ rotate: isDrawing ? 360 : isHoverResonating ? 180 : 0 }}
              transition={{ duration: isDrawing ? 0.7 : 1.5, ease: 'easeOut' }}
            >
              {isDrawing ? (
                <Sparkles className="w-6 h-6 animate-spin text-[#F2D675]" style={{ animationDuration: '2s' }} />
              ) : isHoverResonating ? (
                <Compass className="w-6 h-6 text-[#F2D675] animate-pulse" />
              ) : (
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              )}
            </motion.div>
          ) : (
            <span className="font-mono text-base font-bold text-[#AABDB7]/60">{slotNumber}</span>
          )}
        </div>

        {/* Status Text & Dynamic Resonance Feedback */}
        <div className="relative z-10 flex flex-col items-center">
          <span
            className={`text-xs font-mono tracking-wider font-semibold transition-colors ${
              isActive
                ? isDrawing
                  ? 'text-[#F2D675]'
                  : isHoverResonating
                  ? 'text-[#F2D675]'
                  : 'text-[#D4AF37]'
                : 'text-[#AABDB7]/70'
            }`}
          >
            {isActive
              ? isDrawing
                ? '✦ Converging ✦'
                : isHoverResonating
                ? `Resonating #${(hoveredCardIndex ?? 0) + 1}`
                : 'Active Receptor'
              : 'Reserved Slot'}
          </span>

          <span className="text-[10px] font-sans text-[#8BB5A8] mt-1 max-w-[145px] leading-tight">
            {isActive
              ? isDrawing
                ? 'Consecrated card flying to altar…'
                : isHoverResonating
                ? 'Click card in ribbon to draw into this slot'
                : 'Pick any card from ribbon below'
              : `Position ${slotNumber}`}
          </span>
        </div>

        {/* Ambient Corner Ornaments */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[rgba(212,175,55,0.3)] pointer-events-none" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[rgba(212,175,55,0.3)] pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[rgba(212,175,55,0.3)] pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[rgba(212,175,55,0.3)] pointer-events-none" />
      </motion.div>
    </div>
  );
}
