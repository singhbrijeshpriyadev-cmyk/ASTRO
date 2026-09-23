'use client';

import React, { useState, useEffect } from 'react';
import { 
  draw3CardSpread, 
  ThreeCardReadingResult, 
  ThreeCardDrawError 
} from '@/lib/tarot/three-card-engine';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export interface ThreeCardDrawEngineProps {
  onReadingComplete?: (result: ThreeCardReadingResult) => void;
}

export function ThreeCardDrawEngine({ onReadingComplete }: ThreeCardDrawEngineProps) {
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [result, setResult] = useState<ThreeCardReadingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Animation states
  const [drawState, setDrawState] = useState<'idle' | 'shuffling' | 'dealing' | 'revealed'>('idle');
  const [cardRevealed, setCardRevealed] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const handleDraw = () => {
    if (drawState === 'shuffling' || drawState === 'dealing') return;

    setErrorMessage(null);
    setResult(null);
    setCardRevealed([false, false, false]);
    setDrawState('shuffling');

    // 1. Randomization happens in application code FIRST
    setTimeout(() => {
      const drawRes = draw3CardSpread(userQuestion, { storeQuestion: true });
      if ('error' in drawRes) {
        setErrorMessage(drawRes.error);
        setDrawState('idle');
        return;
      }

      setResult(drawRes);
      setDrawState('dealing');

      // 2. Sequential card reveal animation
      // Reveal Card 1
      setTimeout(() => {
        setCardRevealed([true, false, false]);
      }, 500);

      // Reveal Card 2
      setTimeout(() => {
        setCardRevealed([true, true, false]);
      }, 1100);

      // Reveal Card 3
      setTimeout(() => {
        setCardRevealed([true, true, true]);
        setDrawState('revealed');
        if (onReadingComplete) {
          onReadingComplete(drawRes);
        }
      }, 1700);
    }, 700);
  };

  const handleReset = () => {
    setDrawState('idle');
    setCardRevealed([false, false, false]);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 text-vedic-text">
      {/* Altar Banner & Controls */}
      <div className="bg-vedic-surface/75 border border-vedic-gold/25 rounded-lg p-5 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-vedic-gold text-xs font-mono tracking-widest uppercase mb-1">
            <Layers className="w-3.5 h-3.5" />
            Deterministic 3-Card Oracle Engine
          </div>
          <h2 className="font-serif text-2xl font-bold text-vedic-text tracking-wide">
            Past • Present • Future Spread
          </h2>
          <p className="text-xs text-vedic-muted mt-0.5">
            Strict sampling without replacement from 78-card Rider-Waite-Smith deck using cryptographic entropy.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {drawState === 'revealed' && (
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded border border-vedic-gold/30 bg-vedic-surface text-xs font-mono text-vedic-gold hover:bg-vedic-gold/15 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Altar
            </button>
          )}

          <button
            onClick={handleDraw}
            disabled={drawState === 'shuffling' || drawState === 'dealing'}
            className="w-full md:w-auto px-6 py-2.5 rounded bg-vedic-gold text-vedic-bg font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-vedic-gold-soft transition-all shadow-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCw className={`w-3.5 h-3.5 ${drawState === 'shuffling' ? 'animate-spin' : ''}`} />
            {drawState === 'shuffling'
              ? 'Shuffling 78-Card Deck...'
              : drawState === 'dealing'
              ? 'Dealing Altar...'
              : 'Draw 3 Cards'}
          </button>
        </div>
      </div>

      {/* Optional Inquiry Input (Question never affects random draw) */}
      <div className="bg-vedic-bg/70 border border-vedic-gold/20 rounded-lg p-3.5 flex flex-col sm:flex-row items-center gap-3 shadow-md">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-mono text-vedic-muted uppercase tracking-wider block mb-1">
            Inquiry or Contemplative Lens (Interpretation Context Only)
          </label>
          <input
            type="text"
            value={userQuestion}
            onChange={e => setUserQuestion(e.target.value)}
            disabled={drawState === 'shuffling' || drawState === 'dealing'}
            placeholder="Focus your inquiry (e.g. What guidance illuminates my vocational transition?)"
            className="w-full bg-vedic-surface/80 border border-vedic-gold/30 rounded px-3 py-1.5 text-xs font-mono text-vedic-text focus:outline-none focus:border-vedic-gold disabled:opacity-50"
          />
        </div>
        <div className="text-[10px] font-mono text-vedic-gold/80 flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero AI Selection Bias</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-200">
          Error: {errorMessage}
        </div>
      )}

      {/* Three Altar Slots: [ 🂠 ] [ 🂠 ] [ 🂠 ] */}
      <div className="bg-gradient-to-b from-vedic-surface/80 to-vedic-bg border border-vedic-gold/25 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-vedic-gold/15">
          <span className="text-[10px] font-mono text-vedic-gold uppercase tracking-widest">
            Cryptographic Altar Surface
          </span>
          <span className="text-[10px] font-mono text-vedic-muted">
            {result ? result.readingId : 'Initial State: 3 Face-Down Cards'}
          </span>
        </div>

        {/* 3-Card Display Grid with 3D Flip Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            { posIdx: 0, label: 'Position 1', name: 'Past / Background' },
            { posIdx: 1, label: 'Position 2', name: 'Present / Current Energy' },
            { posIdx: 2, label: 'Position 3', name: 'Future / Direction' },
          ].map(({ posIdx, label, name }) => {
            const card = result?.cards[posIdx];
            const isFlipped = cardRevealed[posIdx];

            return (
              <div key={posIdx} className="flex flex-col items-center space-y-2.5">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-vedic-gold uppercase tracking-wider block">
                    {label}
                  </span>
                  <span className="text-xs font-serif font-bold text-vedic-text block">
                    {name}
                  </span>
                </div>

                {/* 3D Flip Card Container */}
                <div 
                  className="w-48 sm:w-56 aspect-[2/3] relative rounded-lg"
                  style={{ perspective: '1200px' }}
                >
                  <div
                    className={`w-full h-full relative rounded-lg transition-transform duration-700 shadow-2xl ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* BACK FACE: Celestial Ornamental Card Back */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-lg border-2 border-vedic-gold/40 bg-gradient-to-br from-obsidian-950 via-[#0d1624] to-obsidian-900 p-2.5 flex flex-col justify-between items-center shadow-xl select-none"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-full flex justify-between text-[8px] font-mono text-vedic-gold/40">
                        <span>🂠</span>
                        <span>KAALIKA</span>
                        <span>🂠</span>
                      </div>

                      {/* Sacred Geometric Mandala Medallion */}
                      <div className="w-24 h-24 rounded-full border border-vedic-gold/30 flex items-center justify-center relative p-1 bg-black/40">
                        <div className="w-18 h-18 rounded-full border border-vedic-gold/20 flex items-center justify-center rotate-45">
                          <div className="w-12 h-12 border border-vedic-gold/40 rotate-45 flex items-center justify-center">
                            <span className="text-lg text-vedic-gold -rotate-45">✦</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[9px] font-mono text-vedic-gold/60 tracking-widest uppercase">
                        {drawState === 'shuffling' ? 'Shuffling...' : 'Face Down'}
                      </div>
                    </div>

                    {/* FRONT FACE: Authentic Tarot Card Artwork */}
                    {card && (
                      <div 
                        className="absolute inset-0 w-full h-full rounded-lg border-2 border-vedic-gold/60 p-1.5 bg-black/90 shadow-2xl overflow-hidden [transform:rotateY(180deg)] flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="relative w-full h-full rounded overflow-hidden">
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              card.orientation === 'Reversed' ? 'rotate-180' : ''
                            }`}
                          />

                          {/* Orientation & Arcana Badges */}
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 border border-vedic-gold/40 text-[9px] font-mono text-vedic-gold">
                            {card.arcana === 'Major Arcana' ? `ARC ${card.number}` : card.suit}
                          </div>

                          {card.orientation === 'Reversed' ? (
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-red-950/90 text-red-200 border border-red-500/50 text-[9px] font-mono font-bold">
                              REVERSED
                            </div>
                          ) : (
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-200 border border-emerald-500/40 text-[9px] font-mono">
                              UPRIGHT
                            </div>
                          )}

                          {/* Card Name Overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 pt-3 text-center">
                            <span className="font-serif text-xs font-bold text-vedic-text leading-tight block drop-shadow">
                              {card.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Title & Orientation Indicator */}
                {card && isFlipped && (
                  <div className="text-center animate-fade-in space-y-0.5">
                    <span className="text-xs font-serif font-bold text-vedic-gold block">
                      {card.name}
                    </span>
                    <span className={`text-[10px] font-mono ${card.orientation === 'Reversed' ? 'text-red-400' : 'text-emerald-400'}`}>
                      [{card.orientation}]
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Interpretation Section (Shown after cards are revealed) */}
      {result && drawState === 'revealed' && (
        <div className="space-y-5 animate-fade-in">
          {/* Card-by-Card Interpretation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.cards.map((c, i) => (
              <div
                key={c.cardId + i}
                className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-4 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="pb-2 border-b border-vedic-gold/15">
                    <span className="text-[10px] font-mono text-vedic-gold uppercase tracking-wider block">
                      Card {c.position} • {c.positionName}
                    </span>
                    <h4 className="font-serif text-base font-bold text-vedic-text flex items-center justify-between mt-0.5">
                      <span>{c.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        c.orientation === 'Reversed'
                          ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {c.orientation}
                      </span>
                    </h4>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-vedic-muted uppercase block">
                        Traditional Archetype
                      </span>
                      <p className="text-vedic-text/90 leading-relaxed">
                        {c.traditionalMeaning}
                      </p>
                    </div>

                    <div className="bg-vedic-bg/70 p-2.5 rounded border border-vedic-gold/15">
                      <span className="text-[10px] font-mono text-vedic-gold uppercase block">
                        Spread Position Significance
                      </span>
                      <p className="text-vedic-text leading-relaxed">
                        {c.positionMeaning}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-vedic-gold/10">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Practical Reflection
                  </span>
                  <p className="text-[11px] text-vedic-muted leading-relaxed">
                    {c.practicalReflection}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Reading Narrative Card */}
          <div className="bg-gradient-to-br from-vedic-surface to-vedic-bg border border-vedic-gold/35 rounded-lg p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-vedic-gold/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-vedic-gold" />
                <h3 className="font-serif text-lg font-bold text-vedic-text">
                  Overall Reading & Archetypal Synthesis
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vedic-surface border border-vedic-gold/30 text-vedic-gold">
                Deterministic Triad
              </span>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-vedic-text space-y-2 leading-relaxed">
              {result.interpretation.overallReading.split('\n').filter(Boolean).map((line, idx) => {
                if (line.startsWith('### ')) {
                  return null;
                }
                if (line.startsWith('- ')) {
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2">
                      <span className="text-vedic-gold mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/^- \*\*(.*?)\*\*:/, '<strong>$1:</strong>') }} />
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-vedic-muted text-xs leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
