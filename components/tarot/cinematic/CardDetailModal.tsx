'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { getTarotCardImageUrl } from '@/lib/tarot/cards';
import { 
  X, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Coins, 
  Compass, 
  RotateCw, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  BookOpen
} from 'lucide-react';

interface CardDetailModalProps {
  card: TarotCard | null;
  orientation?: TarotOrientation;
  onClose: () => void;
}

export function CardDetailModal({ card, orientation = 'upright', onClose }: CardDetailModalProps) {
  if (!card) return null;

  const isReversed = orientation === 'reversed';
  const imageUrl = card.image_path || getTarotCardImageUrl(card);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#061411]/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[rgba(212,175,55,0.3)] bg-gradient-to-br from-[#0B211B]/95 via-[#102A23]/90 to-[#061411]/98 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,155,119,0.18)] p-6 sm:p-8 z-10 no-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-2 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.1)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all cursor-pointer z-20"
            aria-label="Close card details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Card Artwork & Badges */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-[210px] aspect-[7/12] rounded-2xl overflow-hidden border-2 border-[rgba(212,175,55,0.45)] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
                <Image
                  src={imageUrl}
                  alt={card.name}
                  fill
                  sizes="210px"
                  className={`object-cover ${isReversed ? 'rotate-180' : ''}`}
                  priority
                />
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border ${
                    isReversed
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                      : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  {isReversed ? '↺ Drawn in Reverse' : '✦ Drawn Upright'}
                </span>
              </div>

              {/* Elemental & Astro Badges */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#AABDB7]">
                <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                  {card.element} Element
                </span>
                <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                  {card.astrologicalAssociation}
                </span>
              </div>
            </div>

            {/* Right: Rich Interpretive Dimensions */}
            <div className="md:col-span-7 space-y-6">
              {/* Header */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37]">
                  {card.arcana === 'major' ? `Major Arcana • Key ${card.number}` : `${card.suit?.toUpperCase()} SUIT`}
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#F5F4EC] tracking-tight mt-0.5">
                  {card.name}
                </h3>
              </div>

              {/* Keywords */}
              <div className="p-3.5 rounded-2xl bg-[rgba(0,107,91,0.15)] border border-[rgba(0,155,119,0.3)]">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#F2D675] block mb-1">
                  Active Resonance Keywords
                </span>
                <p className="text-sm font-mono text-[#D4AF37] font-semibold">
                  {(isReversed ? card.keywords_reversed : card.keywords_upright)?.join(' • ') ||
                    card.keywords_upright?.join(' • ')}
                </p>
              </div>

              {/* Core Archetypal Meaning */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#009B77] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Oracle Interpretation ({isReversed ? 'Reversed' : 'Upright'})</span>
                </h4>
                <p className="text-xs font-sans text-[#F5F4EC]/90 leading-relaxed bg-[rgba(255,255,255,0.03)] p-3.5 rounded-xl border border-[rgba(255,255,255,0.06)]">
                  {isReversed ? card.meaning_reversed : card.meaning_upright}
                </p>
              </div>

              {/* 4 Life Realms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Love */}
                <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center gap-1.5 text-[#FCA5A5] text-xs font-mono mb-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Love & Ties</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#AABDB7] line-clamp-3 leading-snug">
                    {isReversed ? card.love_reversed : card.love_upright}
                  </p>
                </div>

                {/* Career */}
                <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center gap-1.5 text-[#93C5FD] text-xs font-mono mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Vocation & Career</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#AABDB7] line-clamp-3 leading-snug">
                    {isReversed ? card.career_reversed : card.career_upright}
                  </p>
                </div>

                {/* Finance */}
                <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center gap-1.5 text-[#FDE047] text-xs font-mono mb-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Material & Wealth</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#AABDB7] line-clamp-3 leading-snug">
                    {isReversed ? card.finance_reversed : card.finance_upright}
                  </p>
                </div>

                {/* Spiritual */}
                <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center gap-1.5 text-[#C4B5FD] text-xs font-mono mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Spiritual Alchemy</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#AABDB7] line-clamp-3 leading-snug">
                    {isReversed ? card.spiritual_reversed : card.spiritual_upright}
                  </p>
                </div>
              </div>

              {/* Sacred Counsel */}
              <div className="pt-2 border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] block mb-0.5">
                  Sacred Advice
                </span>
                <p className="text-xs font-serif italic text-[#F5F4EC]">
                  &ldquo;{card.advice}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
