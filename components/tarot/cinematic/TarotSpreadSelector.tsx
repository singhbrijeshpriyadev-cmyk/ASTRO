'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Heart, Briefcase, Sun, Check } from 'lucide-react';

export interface TarotSpreadDef {
  id: string;
  name: string;
  tagline: string;
  cardCount: number;
  slots: {
    title: string;
    subtitle: string;
  }[];
}

export const TAROT_SPREADS: TarotSpreadDef[] = [
  {
    id: 'general_past_present_future',
    name: 'Past • Present • Future',
    tagline: 'Timeless energetic trajectory and karma unfolding',
    cardCount: 3,
    slots: [
      { title: 'CARD 1: PAST', subtitle: 'Karmic roots & foundational impetus' },
      { title: 'CARD 2: PRESENT', subtitle: 'Immediate crucible & active focal point' },
      { title: 'CARD 3: FUTURE', subtitle: 'Emerging horizon & potential synthesis' },
    ],
  },
  {
    id: 'career_situation_challenge_advice',
    name: 'Situation • Challenge • Advice',
    tagline: 'Vocation, work ambitions, and practical counsel',
    cardCount: 3,
    slots: [
      { title: 'CARD 1: SITUATION', subtitle: 'Current professional climate & reality' },
      { title: 'CARD 2: CHALLENGE', subtitle: 'Underlying tension or obstacle' },
      { title: 'CARD 3: ADVICE', subtitle: 'Highest strategic & conscious action' },
    ],
  },
  {
    id: 'love_you_them_relationship',
    name: 'You • Them • Relationship',
    tagline: 'Emotional currents, unspoken resonance, and connection',
    cardCount: 3,
    slots: [
      { title: 'CARD 1: YOUR ENERGY', subtitle: 'Your emotional state & true desire' },
      { title: 'CARD 2: THEIR ENERGY', subtitle: 'Their conscious & subconscious vibration' },
      { title: 'CARD 3: THE BOND', subtitle: 'Mutual alchemy & evolutionary direction' },
    ],
  },
  {
    id: 'spiritual_mind_body_spirit',
    name: 'Mind • Body • Spirit',
    tagline: 'Holistic inner alignment, energy balance, and prana',
    cardCount: 3,
    slots: [
      { title: 'CARD 1: MIND', subtitle: 'Thought patterns & mental clarity' },
      { title: 'CARD 2: BODY', subtitle: 'Physical vitality & grounding energy' },
      { title: 'CARD 3: SPIRIT', subtitle: 'Higher soul guidance & intuition' },
    ],
  },
  {
    id: 'oracle_yes_no',
    name: 'Yes / No Single Oracle',
    tagline: 'Direct celestial inquiry for immediate clarity',
    cardCount: 1,
    slots: [
      { title: 'ORACLE CARD', subtitle: 'Direct cosmic discernment on your inquiry' },
    ],
  },
];

interface TarotSpreadSelectorProps {
  selectedSpreadId: string;
  onSelectSpread: (spread: TarotSpreadDef) => void;
  disabled?: boolean;
}

export function TarotSpreadSelector({
  selectedSpreadId,
  onSelectSpread,
  disabled = false,
}: TarotSpreadSelectorProps) {
  return (
    <div className="w-full max-w-4xl px-2">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#F2D675]">
          Select Divination Spread
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TAROT_SPREADS.map((spread) => {
          const isSelected = spread.id === selectedSpreadId;
          return (
            <button
              key={spread.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSpread(spread)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-[linear-gradient(135deg,rgba(0,107,91,0.3)_0%,rgba(16,42,35,0.7)_100%)] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#F5F4EC]">
                  {spread.name}
                </span>
                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-[#009B77] flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#D4AF37] px-1.5 py-0.5 rounded bg-[rgba(212,175,55,0.1)]">
                    {spread.cardCount} {spread.cardCount === 1 ? 'card' : 'cards'}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-sans text-[#AABDB7] line-clamp-2 leading-relaxed">
                {spread.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
