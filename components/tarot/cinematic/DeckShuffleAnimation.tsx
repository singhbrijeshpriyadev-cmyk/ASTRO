'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCardBack } from './TarotCardBack';
import { tarotAudio } from '@/lib/tarot/sound-effects';

interface DeckShuffleAnimationProps {
  onComplete: () => void;
}

export function DeckShuffleAnimation({ onComplete }: DeckShuffleAnimationProps) {
  const [phase, setPhase] = useState<'lift' | 'split' | 'interleave' | 'compress' | 'settle'>('lift');

  useEffect(() => {
    // Play synthesized shuffle audio immediately on user trigger
    tarotAudio.playShuffle();

    // Sequence timing
    const t1 = setTimeout(() => setPhase('split'), 500);
    const t2 = setTimeout(() => setPhase('interleave'), 1200);
    const t3 = setTimeout(() => setPhase('compress'), 2200);
    const t4 = setTimeout(() => setPhase('settle'), 2700);
    const t5 = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  // Create 16 cards for the split & interleave animation (8 left pile, 8 right pile)
  const leftCards = Array.from({ length: 8 }, (_, i) => i);
  const rightCards = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="relative w-full max-w-[560px] h-[360px] flex items-center justify-center select-none">
      {/* Mystical Energy Trail / Aura in Background */}
      <motion.div
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0.45, 0.65, 0.25, 0],
          scale: [0.8, 1.25, 1.4, 1.1, 0.9],
          rotate: 180,
        }}
        transition={{ duration: 3.2, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(0,155,119,0.30) 0%, rgba(212,175,55,0.22) 50%, transparent 75%)',
          filter: 'blur(28px)',
        }}
      />

      {/* Floating Sparkle Particles during shuffle */}
      <AnimatePresence>
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              background: i % 2 === 0 ? '#F2D675' : '#009B77',
              boxShadow: '0 0 8px rgba(212,175,55,0.8)',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: (Math.sin(i * 1.5) * 160) + (i % 2 === 0 ? 40 : -40),
              y: (Math.cos(i * 1.5) * 100) - 20,
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 2.4,
              delay: 0.3 + (i * 0.1),
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Deck Animation Stage */}
      <div className="relative w-[190px] aspect-[7/12]" style={{ perspective: 1400, transformStyle: 'preserve-3d' }}>
        {/* Left half of deck */}
        {leftCards.map((idx) => {
          let x = 0;
          let y = -idx * 1.2;
          let rotZ = 0;
          let rotY = 0;
          let scale = 1;

          if (phase === 'lift') {
            y = -idx * 1.2 - 30;
            scale = 1.04;
          } else if (phase === 'split') {
            x = -110 - idx * 2.5;
            y = -idx * 2 - 20;
            rotZ = -6 + idx * 0.8;
            rotY = 12;
            scale = 1.02;
          } else if (phase === 'interleave') {
            x = (idx % 2 === 0 ? -25 : -8);
            y = -idx * 3.5 - 15;
            rotZ = (idx % 2 === 0 ? -2 : 1);
            scale = 1.01;
          } else if (phase === 'compress' || phase === 'settle') {
            x = 0;
            y = -idx * 1.2;
            rotZ = (idx % 4 - 2) * 0.3;
            scale = 1;
          }

          return (
            <motion.div
              key={`left-${idx}`}
              className="absolute inset-0 rounded-2xl"
              animate={{ x, y, rotateZ: rotZ, rotateY: rotY, scale }}
              transition={{
                duration: phase === 'split' ? 0.65 : phase === 'interleave' ? 0.95 : 0.45,
                ease: 'easeInOut',
              }}
              style={{ zIndex: idx * 2 }}
            >
              <TarotCardBack isHovered={false} />
            </motion.div>
          );
        })}

        {/* Right half of deck */}
        {rightCards.map((idx) => {
          let x = 0;
          let y = -idx * 1.2;
          let rotZ = 0;
          let rotY = 0;
          let scale = 1;

          if (phase === 'lift') {
            y = -idx * 1.2 - 30;
            scale = 1.04;
          } else if (phase === 'split') {
            x = 110 + idx * 2.5;
            y = -idx * 2 - 20;
            rotZ = 6 - idx * 0.8;
            rotY = -12;
            scale = 1.02;
          } else if (phase === 'interleave') {
            x = (idx % 2 === 0 ? 25 : 8);
            y = -idx * 3.5 - 15;
            rotZ = (idx % 2 === 0 ? 2 : -1);
            scale = 1.01;
          } else if (phase === 'compress' || phase === 'settle') {
            x = 0;
            y = -idx * 1.2;
            rotZ = (idx % 4 - 2) * -0.3;
            scale = 1;
          }

          return (
            <motion.div
              key={`right-${idx}`}
              className="absolute inset-0 rounded-2xl"
              animate={{ x, y, rotateZ: rotZ, rotateY: rotY, scale }}
              transition={{
                duration: phase === 'split' ? 0.65 : phase === 'interleave' ? 0.95 : 0.45,
                ease: 'easeInOut',
              }}
              style={{ zIndex: idx * 2 + 1 }}
            >
              <TarotCardBack isHovered={false} />
            </motion.div>
          );
        })}
      </div>

      {/* Stage status indicator below & Skip button */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#009B77] animate-ping" />
          <span>Shuffling the consecrated deck…</span>
        </div>
        <button
          id="btn-skip-shuffle"
          type="button"
          onClick={() => onComplete()}
          className="text-[10px] font-mono tracking-wider text-[#AABDB7] hover:text-[#F2D675] underline underline-offset-4 cursor-pointer transition-colors"
        >
          Skip Animation ➔
        </button>
      </div>
    </div>
  );
}
