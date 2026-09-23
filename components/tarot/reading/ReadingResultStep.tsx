'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductionTarotReading } from '@/lib/tarot/types';
import { saveTarotReading } from '@/lib/tarot/history';
import { 
  Sparkles, 
  RotateCw, 
  Share2, 
  Bookmark, 
  Check, 
  Compass, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Layers,
  Clock,
  BookOpen
} from 'lucide-react';

interface ReadingResultStepProps {
  reading: ProductionTarotReading;
  onNewReading: () => void;
  onShareReading: () => void;
  onSynthesizeAstrology?: () => void;
}

export function ReadingResultStep({
  reading,
  onNewReading,
  onShareReading,
  onSynthesizeAstrology,
}: ReadingResultStepProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeCardTab, setActiveCardTab] = useState<number>(0);
  const [inspectFlipped, setInspectFlipped] = useState<boolean>(false);

  const handleSave = async () => {
    saveTarotReading(reading);
    try {
      await fetch('/api/tarot/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadName: reading.spreadName,
          question: reading.question,
          cardsPayload: reading.cards,
          synthesisPayload: {
            overallReading: reading.overallReading,
            guidance: reading.guidance,
            reflection: reading.reflection,
          },
        }),
      });
    } catch (err) {
      // Graceful fallback to localStorage already completed
    }
    setIsSaved(true);
  };

  const handleCopySummary = () => {
    const summaryText = `✦ KAALIKA CELESTIAL TAROT READING ✦\nQuestion: "${reading.question}"\nTopic: ${reading.topicLabel} | Spread: ${reading.spreadName}\nDate: ${new Date(reading.timestamp).toLocaleDateString()}\n\nCARDS DRAWN:\n1. Past: ${reading.cards[0].name} (${reading.cards[0].orientation})\n2. Present: ${reading.cards[1].name} (${reading.cards[1].orientation})\n3. Future: ${reading.cards[2].name} (${reading.cards[2].orientation})\n\nSYNTHESIS:\n${reading.overallReading}\n\nHARMONIC GUIDANCE:\n${reading.guidance}\n\nCONTEMPLATION:\n"${reading.reflection}"`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const getPurusharthaBadge = (suit?: string | null, arcana?: string) => {
    if (arcana === 'major') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(212,175,55,0.15)] text-[#F2D675] border border-[rgba(212,175,55,0.35)]">
          Cosmic Karma • Mahat
        </span>
      );
    }
    if (suit === 'wands') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950/40 text-amber-300 border border-amber-500/30">
          Dharma • Right Action
        </span>
      );
    }
    if (suit === 'cups') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/40 text-blue-300 border border-blue-500/30">
          Moksha • Inner Devotion
        </span>
      );
    }
    if (suit === 'swords') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
          Kama • Mental Horizon
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
        Artha • Manifest Reality
      </span>
    );
  };

  const getElementBadge = (element: string) => {
    if (element.includes('Fire')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
          <Flame className="w-3 h-3" />
          <span>Fire • Tejas</span>
        </span>
      );
    }
    if (element.includes('Water')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/30">
          <Droplets className="w-3 h-3" />
          <span>Water • Jala</span>
        </span>
      );
    }
    if (element.includes('Air')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
          <Wind className="w-3 h-3" />
          <span>Air • Vayu</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
        <Mountain className="w-3 h-3" />
        <span>Earth • Prithvi</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Top Reading Metadata Bar */}
      <div className="liquid-glass-panel p-4 sm:p-5 rounded-2xl border border-[rgba(212,175,55,0.30)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[rgba(212,175,55,0.35)]">
              {reading.topicLabel}
            </span>
            <span className="text-[#AABDB7]">•</span>
            <span className="text-[#AABDB7]">{reading.spreadName}</span>
            <span className="text-[#AABDB7]">•</span>
            <span className="text-[#AABDB7]">{new Date(reading.timestamp).toLocaleDateString()}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F4EC]">
            &ldquo;{reading.question}&rdquo;
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.4)] text-[#AABDB7] hover:text-[#F2D675] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-[#009B77]" /> : <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-[rgba(0,155,119,0.2)] border-[#009B77] text-[#009B77]'
                : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.4)] text-[#AABDB7] hover:text-[#F2D675]'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>{isSaved ? 'Saved to Sanctuary' : 'Save Reading'}</span>
          </button>

          <button
            onClick={onShareReading}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.4)] text-[#AABDB7] hover:text-[#F2D675] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Share</span>
          </button>

          <button
            onClick={onNewReading}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.35)] hover:bg-[rgba(212,175,55,0.22)] text-[#D4AF37] hover:text-[#F2D675] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>New Draw</span>
          </button>
        </div>
      </div>

      {/* 3 Revealed Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reading.cards.map((card, idx) => {
          const isSelected = activeCardTab === idx;
          const isReversed = card.orientation === 'reversed';

          return (
            <div
              key={card.cardId}
              onClick={() => setActiveCardTab(idx)}
              className={`liquid-glass-card rounded-2xl p-4 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-[rgba(11,33,27,0.7)]'
                  : 'border-[rgba(255,255,255,0.10)] hover:border-[rgba(212,175,55,0.30)] bg-[rgba(4,20,17,0.5)]'
              }`}
            >
              {/* Position Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                  {card.positionName}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    isReversed
                      ? 'border-amber-400/40 text-amber-300 bg-amber-950/30'
                      : 'border-[#009B77]/40 text-[#009B77] bg-[#009B77]/10'
                  }`}
                >
                  {card.orientation}
                </span>
              </div>

              {/* Card Thumbnail */}
              <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-black/70 border border-[rgba(255,255,255,0.08)] mb-3">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className={`object-cover ${isReversed ? 'rotate-180' : ''}`}
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                  <div>
                    <div className="font-serif text-base font-bold text-[#F5F4EC] leading-tight">
                      {card.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#D4AF37] mt-0.5">
                      {card.arcana === 'major' ? 'Major Arcana' : `${card.rank} of ${card.suit}`}
                    </div>
                  </div>
                  {getElementBadge(card.card.element)}
                </div>
              </div>

              {/* Key Themes chips */}
              <div className="flex flex-wrap gap-1 mt-2">
                {card.keywords.slice(0, 3).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-sans px-2 py-0.5 rounded bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#AABDB7]"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Purushartha Alignment Tag */}
              <div className="pt-2.5 mt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <span className="text-[9.5px] font-mono text-[#AABDB7] uppercase">Purushartha</span>
                {getPurusharthaBadge(card.suit, card.arcana)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Card Contextual Inspector */}
      <div className="liquid-glass-panel p-6 sm:p-8 rounded-2xl border border-[rgba(212,175,55,0.35)] space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.08)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[#D4AF37] font-serif text-lg font-bold">
              {activeCardTab + 1}
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
                {reading.cards[activeCardTab].positionName}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#F5F4EC]">
                {reading.cards[activeCardTab].name} ({reading.cards[activeCardTab].orientation})
              </h3>
            </div>
          </div>

          {/* Quick tab switcher between Card 1, 2, 3 */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(6,20,17,0.6)] border border-[rgba(255,255,255,0.08)]">
            {['1: Past', '2: Present', '3: Future'].map((label, idx) => (
              <button
                key={label}
                onClick={() => setActiveCardTab(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeCardTab === idx
                    ? 'bg-[rgba(212,175,55,0.22)] text-[#F2D675] font-semibold border border-[rgba(212,175,55,0.35)]'
                    : 'text-[#AABDB7] hover:text-[#F5F4EC]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Interpretive Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Position & Context */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Spread Position Meaning</span>
              </h4>
              <p className="text-sm text-[#F5F4EC] leading-relaxed font-sans bg-[rgba(11,33,27,0.4)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                {reading.cards[activeCardTab].positionMeaning}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase text-[#009B77] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inquiry Domain Focus ({reading.topicLabel})</span>
              </h4>
              <p className="text-sm text-[#AABDB7] leading-relaxed font-sans bg-[rgba(11,33,27,0.4)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                {reading.cards[activeCardTab].topicMeaning}
              </p>
            </div>
          </div>

          {/* Right: Traditional Essence & Practical Reflection */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase text-[#8B6BBE] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Traditional Archetypal Root</span>
              </h4>
              <p className="text-sm text-[#AABDB7] leading-relaxed font-sans bg-[rgba(11,33,27,0.4)] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                {reading.cards[activeCardTab].baseMeaning}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase text-[#F2D675] tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mindful Action & Reflection</span>
              </h4>
              <p className="text-sm text-[#F5F4EC] leading-relaxed font-sans bg-[rgba(212,175,55,0.06)] p-4 rounded-xl border border-[rgba(212,175,55,0.20)]">
                {reading.cards[activeCardTab].practicalReflection}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Card Combination & Structural Synthesis */}
      <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl border border-[rgba(212,175,55,0.30)] space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
          <Layers className="w-4 h-4" />
          <span>Synthesis Engine • Cross-Card Combination Dynamics</span>
        </div>

        {/* Structural Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[rgba(11,33,27,0.5)] border border-[rgba(255,255,255,0.08)]">
            <div className="text-[10px] text-[#AABDB7] uppercase">Major Arcana</div>
            <div className="text-[#F2D675] font-semibold text-sm mt-0.5">
              {reading.combination.majorArcanaCount} / 3 Cards
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(11,33,27,0.5)] border border-[rgba(255,255,255,0.08)]">
            <div className="text-[10px] text-[#AABDB7] uppercase">Orientation Balance</div>
            <div className="text-[#AABDB7] font-semibold text-sm mt-0.5">
              {reading.combination.uprightRatio}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(11,33,27,0.5)] border border-[rgba(255,255,255,0.08)]">
            <div className="text-[10px] text-[#AABDB7] uppercase">Suit Patterns</div>
            <div className="text-[#009B77] font-semibold text-sm mt-0.5">
              {reading.combination.repeatedSuits.length > 0
                ? reading.combination.repeatedSuits.join(', ')
                : 'Balanced Suits'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(11,33,27,0.5)] border border-[rgba(255,255,255,0.08)]">
            <div className="text-[10px] text-[#AABDB7] uppercase">Cycle Magnitude</div>
            <div className="text-[#8B6BBE] font-semibold text-sm mt-0.5">
              {reading.combination.majorArcanaEmphasis ? 'Pivotal Turning Point' : 'Practical Agency'}
            </div>
          </div>
        </div>

        {/* Overall Synthesis Reading */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#F5F4EC]">
            Overall Narrative Synthesis
          </h3>
          <div className="prose prose-invert max-w-none text-sm text-[#AABDB7] leading-relaxed space-y-3 font-sans whitespace-pre-line">
            {reading.overallReading}
          </div>
        </div>

        {/* Key Themes Chips */}
        <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <span className="text-xs font-mono uppercase text-[#AABDB7] tracking-wider block">
            Core Archetypal Themes:
          </span>
          <div className="flex flex-wrap gap-2">
            {reading.themes.map((theme, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)] text-[#F2D675] text-xs font-sans font-medium"
              >
                ✦ {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Practical Guidance Callout */}
        <div className="p-5 rounded-xl bg-[rgba(0,155,119,0.08)] border border-[rgba(0,155,119,0.25)] space-y-1.5">
          <h4 className="font-serif text-base font-bold text-[#F5F4EC] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#009B77]" />
            <span>Harmonic Guidance</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#AABDB7] leading-relaxed font-sans">
            {reading.guidance}
          </p>
        </div>

        {/* Thoughtful Reflection Question */}
        <div className="p-5 rounded-xl bg-[rgba(139,107,190,0.08)] border border-[rgba(139,107,190,0.25)] space-y-1.5">
          <h4 className="font-serif text-base font-bold text-[#F5F4EC] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#A78BFA]" />
            <span>Contemplative Reflection</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#F5F4EC] italic leading-relaxed font-serif">
            &ldquo;{reading.reflection}&rdquo;
          </p>
        </div>
      </div>

      {/* Optional Astrology Integration Synthesis CTA */}
      {onSynthesizeAstrology && (
        <div className="liquid-glass-purple p-6 rounded-2xl border border-[rgba(139,107,190,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono uppercase tracking-wider text-[#A78BFA]">
              <Compass className="w-4 h-4" />
              <span>Vedic Horology + Tarot Synthesis</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#F5F4EC]">
              Weave this Tarot draw into your Natal Kundali Blueprint
            </h4>
            <p className="text-xs text-[#AABDB7] max-w-xl font-sans">
              Correlate these three cards with active Dasha periods, Lagna lord placements, and transiting Grahas for an integrated cosmic compass.
            </p>
          </div>
          <button
            onClick={onSynthesizeAstrology}
            className="px-5 py-2.5 rounded-xl bg-[rgba(139,107,190,0.25)] hover:bg-[rgba(139,107,190,0.40)] border border-[rgba(139,107,190,0.50)] text-[#F5F4EC] text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(139,107,190,0.25)]"
          >
            <span>Synthesize with Chart</span>
            <Compass className="w-3.5 h-3.5 text-[#F2D675]" />
          </button>
        </div>
      )}

      {/* Subtle Standard Disclaimer */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-[#AABDB7] font-sans max-w-2xl mx-auto leading-relaxed">
          {reading.disclaimer}
        </p>
      </div>
    </div>
  );
}
