'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProductionTarotReading } from '@/lib/tarot/types';
import { LuxuryTarotCard } from '@/components/tarot/LuxuryTarotCard';
import { 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  Eye,
  Sparkles
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
    // Sequential cinematic staggered flip
    setFlipped(prev => [true, prev[1], prev[2]]);
    setTimeout(() => {
      setFlipped(prev => [prev[0], true, prev[2]]);
    }, 280);
    setTimeout(() => {
      setFlipped([true, true, true]);
    }, 560);
  };

  const cardPositions = [
    { label: 'CARD 1: PAST', subtitle: 'Root & Karmic Foundation' },
    { label: 'CARD 2: PRESENT', subtitle: 'Current Crucible & Reality' },
    { label: 'CARD 3: FUTURE', subtitle: 'Horizon & Unfolding Destiny' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: motionTokens.ease.standard }}
      className="max-w-5xl mx-auto space-y-8 text-center select-none"
    >
      {/* Header Guidance */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.18)]">
          <Eye className="w-3.5 h-3.5 text-[#F2D675]" />
          <span>STEP 3: UNVEIL YOUR ARCHETYPES</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#F5F4EC]">
          {allFlipped ? 'All 3 Archetypes Unveiled' : 'Tap Each Card to Initiate 3D Reveal'}
        </h2>
        <p className="text-xs sm:text-sm text-[#AABDB7] max-w-xl mx-auto font-sans leading-relaxed">
          {allFlipped
            ? 'Your three cosmic archetypes have been uncovered. Proceed to examine your synthesized oracle interpretation.'
            : 'Tap each face-down gilded card to reveal its divine archetype. Each card embodies sacred geometry and holographic foil depth.'}
        </p>
      </div>

      {/* 3 Luxury Cards Container with 3D Parallax & Realistic Gilded Edges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center py-2">
        {reading.cards.map((drawnCard, index) => {
          const idx = index as 0 | 1 | 2;
          const isFlipped = flipped[idx];
          const posMeta = cardPositions[idx];

          return (
            <motion.div 
              key={drawnCard.cardId}
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.12,
                duration: 0.5,
                ease: motionTokens.ease.standard,
              }}
              className="flex flex-col items-center space-y-3.5 w-full max-w-[260px]"
            >
              {/* Position Header */}
              <div className="text-center">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block font-semibold">
                  {posMeta.label}
                </span>
                <span className="text-[11px] text-[#AABDB7] font-sans block">
                  {posMeta.subtitle}
                </span>
              </div>

              {/* Master 3D Luxury Tarot Card */}
              <LuxuryTarotCard
                card={drawnCard.card || drawnCard}
                orientation={drawnCard.orientation}
                isFlipped={isFlipped}
                onFlip={() => handleFlipCard(idx)}
                size="md"
                enable3DTilt={true}
                slotLabel={posMeta.label}
                showBackHint={true}
                priority={index === 0}
              />

              {/* Status pill & astrological alignment under each card */}
              <div className="text-xs font-mono min-h-[36px] flex flex-col items-center justify-center">
                {isFlipped ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span className="inline-flex items-center gap-1 text-[#009B77] font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#009B77]" />
                      <span>Archetype Unveiled</span>
                    </span>
                    <span className="text-[10px] text-[#AABDB7] font-mono truncate max-w-[210px]">
                      {drawnCard.card.element} • {drawnCard.card.astrologicalAssociation}
                    </span>
                  </motion.div>
                ) : (
                  <span className="text-[#8FA39E] text-[11px] animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F2D675]" />
                    <span>Tap card to reveal</span>
                  </span>
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
            className="px-5 py-2.5 rounded-xl bg-[rgba(212,175,55,0.12)] hover:bg-[rgba(212,175,55,0.22)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#F2D675]" />
            <span>✦ Reveal All Cards</span>
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

