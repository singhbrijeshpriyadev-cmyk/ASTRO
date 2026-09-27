'use client';

import React from 'react';
import { motion } from 'motion/react';

interface TarotCardBackProps {
  className?: string;
  isHovered?: boolean;
  style?: React.CSSProperties;
}

export function TarotCardBack({ className = '', isHovered = false, style }: TarotCardBackProps) {
  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden select-none pointer-events-none ${className}`}
      style={{
        background: 'linear-gradient(145deg, #0B211B 0%, #102A23 45%, #061411 100%)',
        boxShadow: isHovered
          ? '0 0 24px rgba(212,175,55,0.35), 0 20px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 12px 30px rgba(0,0,0,0.65), 0 0 14px rgba(0,155,119,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
        border: '1px solid rgba(212,175,55,0.45)',
        ...style,
      }}
    >
      {/* Slow pulsing aura border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            'inset 0 0 12px rgba(212,175,55,0.18)',
            'inset 0 0 22px rgba(0,155,119,0.32)',
            'inset 0 0 12px rgba(212,175,55,0.18)',
          ],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer gold filigree border */}
      <div className="absolute inset-2.5 rounded-xl border border-[rgba(212,175,55,0.35)] pointer-events-none">
        {/* Inner dotted border */}
        <div className="absolute inset-1.5 rounded-lg border border-dashed border-[rgba(0,155,119,0.40)]">
          {/* Subtle background sacred lattice */}
          <div
            className="absolute inset-0 opacity-[0.065]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.8) 1px, transparent 1px),' +
                'linear-gradient(45deg, rgba(212,175,55,0.15) 25%, transparent 25%, transparent 75%, rgba(212,175,55,0.15) 75%),' +
                'linear-gradient(-45deg, rgba(212,175,55,0.15) 25%, transparent 25%, transparent 75%, rgba(212,175,55,0.15) 75%)',
              backgroundSize: '16px 16px',
            }}
          />
        </div>

        {/* 4 Ornamental Corner Flourishes */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />
      </div>

      {/* Central Mystical Symbol & Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Rotating outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[rgba(212,175,55,0.30)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />

          {/* Counter-rotating dashed ring */}
          <motion.div
            className="absolute inset-2 rounded-full border border-dashed border-[rgba(0,155,119,0.45)]"
            animate={{ rotate: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          />

          {/* Hexagram / Sacred star overlay */}
          <svg className="w-20 h-20 text-[#D4AF37]/50" viewBox="0 0 100 100" fill="none">
            {/* Eight-pointed star */}
            <polygon
              points="50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38"
              stroke="#D4AF37"
              strokeWidth="1.2"
              fill="rgba(0,107,91,0.25)"
            />
            <polygon
              points="50,18 58,42 82,50 58,58 50,82 42,58 18,50 42,42"
              stroke="#F2D675"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Center circle */}
            <circle cx="50" cy="50" r="12" stroke="#D4AF37" strokeWidth="1" fill="rgba(6,20,17,0.85)" />
            <circle cx="50" cy="50" r="4" fill="#F2D675" />
          </svg>

          {/* Central Vedic Astrological Rune / Glyph */}
          <span className="absolute font-cinzel text-xs font-bold text-[#F2D675] tracking-widest opacity-90 drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]">
            काल
          </span>
        </div>
      </div>

      {/* Diagonal Glass Reflection Sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.065) 50%, transparent 65%)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 6, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
      />
    </div>
  );
}
