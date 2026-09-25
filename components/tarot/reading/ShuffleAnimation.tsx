'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, FastForward } from 'lucide-react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface ShuffleAnimationProps {
  onComplete: () => void;
}

export function ShuffleAnimation({ onComplete }: ShuffleAnimationProps) {
  // Phase 0: Preparing & Overlap (0-350ms)
  // Phase 1: Slide & Fanning (350-750ms)
  // Phase 2: Riffle & Rotate (750-1150ms)
  // Phase 3: Regroup & Settle (1150-1550ms)
  // Complete at ~1600ms (within 1200-1800ms spec)
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }

    const t1 = setTimeout(() => setPhase(1), 350);
    const t2 = setTimeout(() => setPhase(2), 750);
    const t3 = setTimeout(() => setPhase(3), 1150);
    const t4 = setTimeout(() => onComplete(), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const phaseMessages = [
    'Preparing the 78-card celestial deck...',
    'Fanning cards across the observatory table...',
    'Riffling deck & aligning harmonic resonance...',
    'Regrouping and settling the three resonance cards...',
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: motionTokens.ease.standard }}
      className="max-w-xl mx-auto py-12 px-4 text-center space-y-8 select-none"
    >
      {/* Status indicator */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.40)] text-[#F2D675] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#F2D675] animate-spin" style={{ animationDuration: '4s' }} />
          <span>CELESTIAL ENTROPY ENGINE</span>
        </div>
        <motion.h3 
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC]"
        >
          {phaseMessages[phase]}
        </motion.h3>

        {/* Live Entropy & Progress Indicator */}
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#AABDB7]">
          <span className="flex items-center gap-1.5 text-[#009B77]">
            <span className="w-2 h-2 rounded-full bg-[#009B77] animate-ping" />
            256-Bit Hardware CSPRNG
          </span>
          <span>•</span>
          <span className="text-[#D4AF37]">
            Phase {phase + 1} of 4
          </span>
        </div>

        {/* Micro Phase Bar */}
        <div className="w-48 h-1 bg-[rgba(255,255,255,0.08)] rounded-full mx-auto overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#009B77] to-[#D4AF37]"
            animate={{ width: `${((phase + 1) / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Visual Animated Deck Container */}
      <div className="relative h-72 w-full flex items-center justify-center perspective-[1000px] overflow-hidden">
        {/* Background Sacred Geometric Astrolabe Mandala */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute w-80 h-80 opacity-20 pointer-events-none text-[#D4AF37]"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 4" />
          <circle cx="100" cy="100" r="65" fill="none" stroke="#009B77" strokeWidth="0.5" strokeDasharray="2 3" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={`shuffle-mandala-${i}`}
                x1={100 + Math.cos(a) * 55}
                y1={100 + Math.sin(a) * 55}
                x2={100 + Math.cos(a) * 75}
                y2={100 + Math.sin(a) * 75}
                stroke="currentColor"
                strokeWidth="0.75"
              />
            );
          })}
        </motion.svg>

        {/* Central Deck Base */}
        <div className="relative w-36 h-52">
          {/* Stack of cards (simulating depth of 78 cards) */}
          {[...Array(7)].map((_, i) => {
            let animateProps: { x: number; y: number; rotate: number; scale?: number } = {
              x: 0,
              y: -i * 2,
              rotate: 0,
              scale: 1,
            };

            if (phase === 1) {
              // Fanning out
              animateProps = {
                x: (i - 3) * 16,
                y: -i * 2,
                rotate: (i - 3) * 6,
                scale: 1,
              };
            } else if (phase === 2) {
              // Riffle shuffle movement
              const side = i % 2 === 0 ? -1 : 1;
              animateProps = {
                x: side * (18 + i * 3.5),
                y: -i * 3,
                rotate: side * 4.5,
                scale: 1.03,
              };
            } else if (phase === 3) {
              // Regroup & 3 top cards emerge
              if (i === 6) animateProps = { x: -90, y: -18, rotate: -8, scale: 1.06 };
              else if (i === 5) animateProps = { x: 0, y: -28, rotate: 0, scale: 1.06 };
              else if (i === 4) animateProps = { x: 90, y: -18, rotate: 8, scale: 1.06 };
              else animateProps = { x: 0, y: -i * 2, rotate: 0, scale: 1 };
            }

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: -i * 2, rotate: 0 }}
                animate={animateProps}
                transition={{
                  duration: 0.35,
                  ease: motionTokens.ease.standard,
                }}
                className="absolute inset-0 rounded-[18px] shadow-[0_16px_35px_rgba(0,0,0,0.75)] bg-gradient-to-br from-[#061814] via-[#0B251F] to-[#04120E] border border-[rgba(212,175,55,0.45)] p-2.5 flex flex-col items-center justify-between"
                style={{ zIndex: i }}
              >
                {/* Gilded Edge Rim */}
                <div className="absolute -inset-[1px] rounded-[19px] bg-gradient-to-br from-[#F5F4EC]/60 via-[#D4AF37]/80 to-[#8A6E1E]/60 pointer-events-none opacity-80" />

                {/* Traditional geometric card back pattern */}
                <div className="relative w-full h-full rounded-[12px] border border-[rgba(212,175,55,0.35)] flex flex-col items-center justify-between p-2 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(0,155,119,0.2)_0%,transparent_80%)]">
                  <div className="text-[8.5px] font-mono tracking-[0.2em] text-[#D4AF37]/80 uppercase">KAALIKA</div>
                  
                  {/* Central Sacred Yantra */}
                  <div className="w-12 h-12 rounded-full border border-[rgba(212,175,55,0.5)] bg-[rgba(11,33,27,0.85)] flex items-center justify-center text-[#F2D675] font-serif text-base shadow-[0_0_15px_rgba(212,175,55,0.3)] relative">
                    <span className="relative z-10 font-bold">काल</span>
                  </div>
                  
                  <div className="text-[8.5px] font-mono tracking-[0.2em] text-[#D4AF37]/80 uppercase">ASTRA</div>

                  {phase === 3 && (
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(242,214,117,0.45)] to-transparent pointer-events-none" 
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Skip Button */}
      <div>
        <motion.button
          onClick={onComplete}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(212,175,55,0.12)] text-[#AABDB7] hover:text-[#F2D675] text-xs font-mono transition-colors cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip Animation</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
