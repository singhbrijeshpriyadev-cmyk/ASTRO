'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCardBack } from './TarotCardBack';
import { tarotAudio } from '@/lib/tarot/sound-effects';
import { Scissors, Sparkles } from 'lucide-react';

interface DeckCutInteractionProps {
  onCutComplete: () => void;
}

export function DeckCutInteraction({ onCutComplete }: DeckCutInteractionProps) {
  const [isCutting, setIsCutting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleCut = () => {
    if (isCutting || isDone) return;
    setIsCutting(true);
    tarotAudio.playCut();

    // After animation sequence completes (1.3s)
    setTimeout(() => {
      setIsDone(true);
      setTimeout(() => {
        onCutComplete();
      }, 700);
    }, 1300);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 select-none">
      {/* Instructional prompt */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#009B77] block mb-1">
          ✦ RITE OF ALIGNMENT ✦
        </span>
        <h3 className="font-serif text-2xl font-semibold text-[#F5F4EC] tracking-wide">
          {isDone ? 'The Deck is Consecrated' : 'Cut the Deck'}
        </h3>
        <p className="text-xs font-sans text-[#AABDB7] max-w-sm mt-1">
          {isDone
            ? 'Your energetic stamp is woven into the cards. Preparing the fan…'
            : 'Click or touch the deck to divide and recombine its energetic currents.'}
        </p>
      </motion.div>

      {/* Interactive Deck Cut Stage */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleCut}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCut(); }}
        className="relative w-[190px] sm:w-[210px] aspect-[7/12] cursor-pointer group pointer-events-auto"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        {/* Subtle hover prompt circle */}
        {!isCutting && !isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.4)] text-[#F2D675] text-[11px] font-mono tracking-wider shadow-lg pointer-events-none group-hover:scale-105 transition-transform"
          >
            <Scissors className="w-3 h-3 rotate-90" />
            <span>Click Deck to Cut</span>
          </motion.div>
        )}

        {/* Lower Portion of Deck (Cards 0 to 9) */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={
            isCutting
              ? {
                  x: [0, -75, -75, 0],
                  y: [0, 45, 45, -12], // Moves bottom-left, then slides on top of upper pile!
                  rotateZ: [0, -4, -4, 0],
                  scale: [1, 1.02, 1.02, 1],
                  zIndex: [10, 10, 30, 30],
                }
              : {}
          }
          transition={{ duration: 1.25, ease: 'easeInOut' }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`bottom-${i}`}
              className="absolute inset-0 rounded-2xl"
              style={{
                transform: `translate3d(0, ${-i * 1.2}px, 0)`,
                zIndex: i,
              }}
            >
              {i === 9 ? (
                <TarotCardBack isHovered={false} />
              ) : (
                <div className="w-full h-full rounded-2xl bg-[#081A15] border border-[rgba(212,175,55,0.2)]" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Upper Portion of Deck (Cards 10 to 19) */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ transform: 'translate3d(0, -12px, 0)' }}
          animate={
            isCutting
              ? {
                  x: [0, 75, 75, 0],
                  y: [-12, -45, -45, 0], // Moves top-right, then slides below
                  rotateZ: [0, 4, 4, 0],
                  scale: [1, 1.02, 1.02, 1],
                  zIndex: [20, 20, 10, 10],
                }
              : {}
          }
          transition={{ duration: 1.25, ease: 'easeInOut' }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`top-${i}`}
              className="absolute inset-0 rounded-2xl"
              style={{
                transform: `translate3d(0, ${-i * 1.2}px, 0)`,
                zIndex: i,
              }}
            >
              {i === 9 ? (
                <TarotCardBack isHovered={false} />
              ) : (
                <div className="w-full h-full rounded-2xl bg-[#0B211B] border border-[rgba(212,175,55,0.3)]" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Golden energy burst when cutting finishes */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 1.6] }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(0,155,119,0.3) 50%, transparent 75%)',
                filter: 'blur(16px)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Explicit Action Button */}
      <motion.button
        id="btn-cut-deck"
        type="button"
        onClick={handleCut}
        disabled={isCutting || isDone}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#006B5B_0%,#009B77_100%)] border border-[rgba(212,175,55,0.4)] text-[#F5F4EC] text-xs font-mono font-bold tracking-wider uppercase shadow-[0_4px_16px_rgba(0,107,91,0.4)] hover:brightness-110 cursor-pointer flex items-center gap-2"
      >
        <Scissors className="w-3.5 h-3.5 rotate-90 text-[#F2D675]" />
        <span>{isCutting ? 'Harmonizing currents…' : isDone ? 'Deck Consecrated ✦' : 'Cut the Deck'}</span>
      </motion.button>

      {/* Helper text */}
      <span className="text-[11px] font-mono text-[#8BB5A8] tracking-widest uppercase">
        {isDone ? '✦ Harmonized with your query ✦' : 'Tap deck or click button to split'}
      </span>
    </div>
  );
}
