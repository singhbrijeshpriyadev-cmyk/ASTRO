'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ProductionTarotReading } from '@/lib/tarot/types';
import { 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  Eye 
} from 'lucide-react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface CardRevealStepProps {
  reading: ProductionTarotReading;
  onRevealComplete: () => void;
}

export function CardRevealStep({ reading, onRevealComplete }: CardRevealStepProps) {
  // Flip states for Card 0 (Past), Card 1 (Present), Card 2 (Future)
  const [flipped, setFlipped] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const allFlipped = flipped[0] && flipped[1] && flipped[2];

  const handleFlipCard = (index: 0 | 1 | 2) => {
    if (flipped[index]) return;
    setFlipped(prev => {
      const next: [boolean, boolean, boolean] = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleRevealAll = () => {
    setFlipped([true, true, true]);
  };

  const cardPositions = [
    { label: 'CARD 1: PAST', subtitle: 'Foundation & Root Impetus' },
    { label: 'CARD 2: PRESENT', subtitle: 'Current Crucible & Awareness' },
    { label: 'CARD 3: FUTURE', subtitle: 'Potential Direction & Horizon' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: motionTokens.ease.standard }}
      className="max-w-4xl mx-auto space-y-8 text-center select-none"
    >
      {/* Header Guidance */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.30)] text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
          <Eye className="w-3.5 h-3.5 text-[#F2D675]" />
          <span>STEP 2: CARD REVEAL</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC]">
          {allFlipped ? 'All Cards Revealed' : 'Select Each Card to Reveal'}
        </h2>
        <p className="text-xs sm:text-sm text-[#AABDB7] max-w-lg mx-auto font-sans">
          {allFlipped
            ? 'Your three resonance archetypes have been uncovered. Proceed to examine your detailed interpretations.'
            : 'Tap each face-down card to initiate its 3D flip. Take a quiet breath to absorb each archetype.'}
        </p>
      </div>

      {/* 3 Cards Container with subtle 3D perspective */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center py-4" style={{ perspective: '1000px' }}>
        {reading.cards.map((drawnCard, index) => {
          const idx = index as 0 | 1 | 2;
          const isFlipped = flipped[idx];
          const isReversed = drawnCard.orientation === 'reversed';
          const posMeta = cardPositions[idx];

          return (
            <motion.div 
              key={drawnCard.cardId}
              initial={{ opacity: 0, y: 20, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.12,
                duration: 0.5,
                ease: motionTokens.ease.standard,
              }}
              className="flex flex-col items-center space-y-3 w-full max-w-[240px]"
            >
              {/* Position Header */}
              <div className="text-center">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] block font-semibold">
                  {posMeta.label}
                </span>
                <span className="text-[11px] text-[#AABDB7] font-sans block">
                  {posMeta.subtitle}
                </span>
              </div>

              {/* 3D Flip Card Container with Desktop Hover Tilt (Requirement 29: translateY -8px, rotateX 2deg, rotateY -2deg) */}
              <motion.div
                onClick={() => handleFlipCard(idx)}
                whileHover={!isFlipped ? { y: -8, rotateX: 2, rotateY: -2 } : { y: -2 }}
                transition={{ duration: 0.2 }}
                className={`w-[210px] sm:w-[220px] h-[350px] sm:h-[370px] relative rounded-2xl cursor-pointer select-none ${
                  !isFlipped ? 'hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]' : ''
                }`}
                style={{
                  perspective: '1000px',
                }}
              >
                {/* Inner Flip Wrapper with 3D Rotate (Requirement 32: 600-800ms) */}
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: motionTokens.ease.elegant }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* FRONT FACE (Card Back when dealt) */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.45)] bg-gradient-to-br from-[#0B211B] via-[#102A23] to-[#061411] shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col items-center justify-between p-3.5"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full rounded-xl border border-[rgba(212,175,55,0.30)] flex flex-col items-center justify-between p-3 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(0,155,119,0.18)_0%,transparent_80%)]">
                      <div className="text-[10px] font-mono tracking-widest text-[#D4AF37]/80">
                        KAALIKA
                      </div>

                      {/* Sacred Vedic Yantra & Star Geometry */}
                      <div className="space-y-2 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(11,33,27,0.85)] flex items-center justify-center text-[#F2D675] font-serif text-2xl mx-auto shadow-[0_0_20px_rgba(212,175,55,0.25)] relative">
                          <svg className="absolute inset-0 w-full h-full text-[#D4AF37]/30 animate-spin" style={{ animationDuration: '30s' }} viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                            <polygon points="50,15 79,66 21,66" fill="none" stroke="currentColor" strokeWidth="0.6" />
                            <polygon points="50,85 79,34 21,34" fill="none" stroke="currentColor" strokeWidth="0.6" />
                          </svg>
                          <span className="relative z-10 text-xl font-bold">काल</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#F2D675] tracking-widest uppercase animate-pulse">
                          ✦ Tap to Reveal ✦
                        </div>
                      </div>

                      <div className="text-[10px] font-mono tracking-widest text-[#D4AF37]/80">
                        ASTRA
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE (Actual Tarot Card Image when flipped) */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.55)] bg-[#061411] shadow-[0_15px_35px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col p-2.5"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Tarot Artwork Container */}
                    <div className="relative w-full h-[270px] sm:h-[290px] rounded-xl overflow-hidden bg-black/60 border border-[rgba(255,255,255,0.10)]">
                      <Image
                        src={drawnCard.imageUrl}
                        alt={drawnCard.name}
                        fill
                        className={`object-cover transition-transform duration-500 ${
                          isReversed ? 'rotate-180' : ''
                        }`}
                        sizes="240px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                      {isReversed && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/85 border border-amber-400/60 text-amber-300 text-[9px] font-mono uppercase tracking-wider shadow">
                          Reversed
                        </div>
                      )}
                    </div>

                    {/* Card Title & Orientation Footer */}
                    <div className="mt-2 text-center space-y-0.5">
                      <div className="text-xs font-serif font-bold text-[#F5F4EC] truncate">
                        {drawnCard.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#F2D675] uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <span>{drawnCard.orientation}</span>
                        <span>•</span>
                        <span>{drawnCard.rank}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Status pill & astrological alignment under each card */}
              <div className="text-xs font-mono">
                {isFlipped ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[#009B77] font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Archetype Unveiled</span>
                    </span>
                    <span className="text-[10px] text-[#AABDB7] font-mono truncate max-w-[200px]">
                      {drawnCard.card.element} • {drawnCard.card.astrologicalAssociation}
                    </span>
                  </div>
                ) : (
                  <span className="text-[#8FA39E] text-[11px] animate-pulse">Waiting for tap...</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {!allFlipped && (
          <motion.button
            onClick={handleRevealAll}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(212,175,55,0.12)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.4)] text-[#AABDB7] hover:text-[#F2D675] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reveal All Cards</span>
          </motion.button>
        )}

        <motion.button
          onClick={onRevealComplete}
          disabled={!allFlipped}
          whileHover={allFlipped ? { y: -1, scale: 1.02 } : undefined}
          whileTap={allFlipped ? { scale: 0.97 } : undefined}
          className={`px-8 py-3 rounded-xl font-sans font-semibold text-sm border flex items-center gap-2 transition-all ${
            allFlipped
              ? 'bg-gradient-to-r from-[#006B5B] to-[#009B77] hover:from-[#007D69] hover:to-[#00B388] text-[#F5F4EC] border-[#009B77] shadow-[0_0_25px_rgba(0,155,119,0.35)] cursor-pointer'
              : 'bg-[rgba(11,33,27,0.3)] border-[rgba(255,255,255,0.08)] text-[#AABDB7] cursor-not-allowed'
          }`}
        >
          <span>Continue to Detailed Interpretation</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </motion.button>
      </div>
    </motion.div>
  );
}
