'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { getTarotCardImageUrl } from '@/lib/tarot/cards';
import { TarotSpreadDef } from './TarotSpreadSelector';
import { 
  Sparkles, 
  Bookmark, 
  RotateCcw, 
  Eye, 
  Check, 
  Share2, 
  ShieldCheck, 
  Compass,
  Flame,
  Droplets,
  Wind,
  Mountain
} from 'lucide-react';

export interface DrawnCardItem {
  card: TarotCard;
  orientation: TarotOrientation;
  slotTitle: string;
  slotSubtitle: string;
}

interface ReadingResultSummaryProps {
  cards: DrawnCardItem[];
  spread: TarotSpreadDef;
  question: string;
  onNewReading: () => void;
  onOpenCardDetails: (card: TarotCard, orientation: TarotOrientation) => void;
}

export function ReadingResultSummary({
  cards,
  spread,
  question,
  onNewReading,
  onOpenCardDetails,
}: ReadingResultSummaryProps) {
  const [saved, setSaved] = useState(false);

  // Compute elemental dominance
  const elements = cards.map(c => c.card.element);
  const elementCounts = elements.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Spirit';

  // Save to localStorage
  const handleSaveReading = () => {
    if (typeof window === 'undefined') return;
    try {
      const existingStr = localStorage.getItem('kaalika_saved_readings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newEntry = {
        id: `reading_${Date.now()}`,
        timestamp: new Date().toISOString(),
        question: question || 'General Inward Reflection',
        spreadId: spread.id,
        spreadName: spread.name,
        cards: cards.map(c => ({
          id: c.card.id,
          name: c.card.name,
          orientation: c.orientation,
          slotTitle: c.slotTitle,
          keywords: c.orientation === 'reversed' ? c.card.keywords_reversed : c.card.keywords_upright,
        })),
        dominantElement,
      };
      localStorage.setItem('kaalika_saved_readings', JSON.stringify([newEntry, ...existing]));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Failed to save reading:', e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="w-full max-w-5xl px-4 py-4 space-y-8 select-none"
    >
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-mono tracking-[0.25em] text-[#009B77] uppercase font-bold">
          ✦ CELESTIAL CONSULTATION SYNTHESIS ✦
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F4EC] tracking-tight">
          Your Oracle Reading Complete
        </h2>
        {question ? (
          <p className="text-sm font-sans italic text-[#D4AF37] max-w-lg mx-auto">
            &ldquo;{question}&rdquo;
          </p>
        ) : (
          <p className="text-xs font-mono text-[#8BB5A8]">
            Spread: {spread.name} • {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}
          </p>
        )}
      </div>

      {/* Cards Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {cards.map((item, idx) => {
          const isRev = item.orientation === 'reversed';
          const imgUrl = item.card.image_path || getTarotCardImageUrl(item.card);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.45 }}
              className="p-4 rounded-3xl bg-[rgba(16,42,35,0.65)] border border-[rgba(0,155,119,0.35)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col items-center text-center group"
            >
              {/* Slot Header */}
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#D4AF37] mb-0.5">
                {item.slotTitle}
              </span>
              <span className="text-[9px] font-sans text-[#8BB5A8] mb-3">
                {item.slotSubtitle}
              </span>

              {/* Card Thumbnail */}
              <div
                onClick={() => onOpenCardDetails(item.card, item.orientation)}
                className="relative w-[130px] aspect-[7/12] rounded-xl overflow-hidden border border-[rgba(212,175,55,0.4)] shadow-md cursor-pointer group-hover:scale-105 transition-transform"
              >
                <Image
                  src={imgUrl}
                  alt={item.card.name}
                  fill
                  sizes="130px"
                  className={`object-cover ${isRev ? 'rotate-180' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061411]/90 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-1 right-1 text-[9px] font-mono font-bold text-[#F5F4EC] truncate">
                  {item.card.name}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`mt-3 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-semibold border ${
                  isRev
                    ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {isRev ? '↺ Reversed' : '✦ Upright'}
              </span>

              {/* Keywords */}
              <p className="text-[10px] font-mono text-[#D4AF37] mt-2 line-clamp-1">
                {(isRev ? item.card.keywords_reversed : item.card.keywords_upright)?.slice(0, 3).join(' • ')}
              </p>

              {/* Brief Meaning */}
              <p className="text-[11px] font-sans text-[#AABDB7] mt-1.5 line-clamp-3 leading-snug">
                {isRev ? item.card.meaning_reversed : item.card.meaning_upright}
              </p>

              {/* Inspect Button */}
              <button
                type="button"
                onClick={() => onOpenCardDetails(item.card, item.orientation)}
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-[#009B77] hover:text-[#2DDBA0] transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Deep Inspection</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Synthesis & Elemental Matrix */}
      <div className="p-6 rounded-3xl bg-[rgba(6,20,17,0.75)] border border-[rgba(212,175,55,0.25)] shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-bold text-[#F5F4EC]">
              Overall Cosmic Energetic Horizon
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8BB5A8]">
            <span>Dominant Principle:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[rgba(0,155,119,0.2)] border border-[rgba(0,155,119,0.4)] text-[#2DDBA0] font-bold">
              {dominantElement} Alchemy
            </span>
          </div>
        </div>

        {/* Narrative Synthesis */}
        <p className="text-xs font-sans text-[#F5F4EC]/90 leading-relaxed mb-4">
          The currents of your draw reveal a transition guided by{' '}
          <strong className="text-[#D4AF37]">{cards[0]?.card.name}</strong> as foundational momentum, moving through{' '}
          <strong className="text-[#009B77]">{cards[1]?.card.name}</strong> in the active crucible, and harmonizing toward{' '}
          <strong className="text-[#F2D675]">{cards[2]?.card.name || cards[0]?.card.name}</strong>. Maintain conscious stillness,
          allowing your intuitive compass to align practical determination with inner integrity.
        </p>

        {/* Reflective Divination Notice (Step 16) */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[10px] font-sans text-[#8BB5A8] leading-normal">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Reflective Divination Sanctuary:</strong> Tarot serves as a sacred mirror for contemplative inquiry,
            archetypal mindfulness, and intuitive self-knowledge. It is presented as a spiritual guide for reflection
            rather than fatalistic prediction.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={handleSaveReading}
          type="button"
          className="px-5 py-2.5 rounded-xl border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.12)] hover:bg-[rgba(212,175,55,0.22)] text-[#F2D675] text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-[#2DDBA0]" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span>{saved ? 'Reading Saved to Sanctuary' : 'Save Reading'}</span>
        </button>

        <button
          onClick={onNewReading}
          type="button"
          className="px-5 py-2.5 rounded-xl border border-[rgba(0,155,119,0.5)] bg-[linear-gradient(135deg,#006B5B_0%,#009B77_100%)] text-[#F5F4EC] text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,107,91,0.4)] hover:brightness-110"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Reading (Reshuffle Deck)</span>
        </button>
      </div>
    </motion.div>
  );
}
