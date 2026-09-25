'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { ALL_TAROT_CARDS } from '@/lib/tarot/cards';
import { 
  getCryptoProvider, 
  getSecureRandomInt, 
  getSecureOrientation, 
  shuffleDeck, 
  DrawnCardResult 
} from '@/lib/tarot/randomizer';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCw, 
  Zap, 
  CheckCircle2, 
  Eye, 
  Compass,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motionTokens } from '@/lib/motion/animationTokens';
import { LuxuryTarotCard } from '../LuxuryTarotCard';

interface InteractiveDeckDrawStepProps {
  question: string;
  topicLabel: string;
  onCardsDrawn: (cards: DrawnCardResult[]) => void;
  onBack: () => void;
}

interface FannedCardItem {
  id: string;
  card: TarotCard;
  deckIndex: number;
}

export function InteractiveDeckDrawStep({
  question,
  topicLabel,
  onCardsDrawn,
  onBack,
}: InteractiveDeckDrawStepProps) {
  // Cryptographically shuffled deck of 78 cards
  const [shuffledDeck, setShuffledDeck] = useState<FannedCardItem[]>([]);
  // Indices in shuffledDeck that have been picked (0 to 77)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  // Drawn card objects with orientation
  const [drawnResults, setDrawnResults] = useState<DrawnCardResult[]>([]);
  
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Initialize shuffled deck once on mount
  useEffect(() => {
    const provider = getCryptoProvider();
    let cards = [...ALL_TAROT_CARDS];
    if (provider) {
      cards = shuffleDeck(cards, provider);
    } else {
      // Fallback Fisher-Yates
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }

    setShuffledDeck(
      cards.map((c, idx) => ({
        id: `deck-${c.id}-${idx}`,
        card: c,
        deckIndex: idx,
      }))
    );
  }, []);

  const slotMetadata = [
    { title: 'CARD 1: PAST', subtitle: 'Root & Foundation Impetus', color: '#D4AF37' },
    { title: 'CARD 2: PRESENT', subtitle: 'Immediate Crucible & Reality', color: '#009B77' },
    { title: 'CARD 3: FUTURE', subtitle: 'Evolving Horizon & Outcome', color: '#F2D675' },
  ];

  const currentStepNum = drawnResults.length; // 0, 1, 2, or 3
  const isComplete = currentStepNum >= 3;

  // Handle clicking a specific card in the fanned deck
  const handleSelectCard = (deckIdx: number) => {
    if (selectedIndices.includes(deckIdx) || isComplete) return;

    const provider = getCryptoProvider();
    const orientation: TarotOrientation = provider 
      ? getSecureOrientation(provider)
      : Math.random() < 0.5 ? 'upright' : 'reversed';

    const card = shuffledDeck[deckIdx].card;
    const newDrawn: DrawnCardResult = { card, orientation };

    setSelectedIndices(prev => [...prev, deckIdx]);
    setDrawnResults(prev => [...prev, newDrawn]);
  };

  // Quick Draw: Auto-select 3 random cards without replacement
  const handleQuickDraw = () => {
    if (shuffledDeck.length < 3) return;

    const provider = getCryptoProvider();
    const available = shuffledDeck
      .map((_, i) => i)
      .filter(i => !selectedIndices.includes(i));

    const pickedIndices: number[] = [];
    const results: DrawnCardResult[] = [];

    // Fill up to 3 cards
    const needed = 3 - drawnResults.length;
    for (let k = 0; k < needed; k++) {
      if (available.length === 0) break;
      const randIdx = provider 
        ? getSecureRandomInt(provider, available.length)
        : Math.floor(Math.random() * available.length);
      const chosenDeckIdx = available.splice(randIdx, 1)[0];
      pickedIndices.push(chosenDeckIdx);

      const orientation: TarotOrientation = provider 
        ? getSecureOrientation(provider)
        : Math.random() < 0.5 ? 'upright' : 'reversed';

      results.push({
        card: shuffledDeck[chosenDeckIdx].card,
        orientation,
      });
    }

    setSelectedIndices(prev => [...prev, ...pickedIndices]);
    setDrawnResults(prev => [...prev, ...results]);
  };

  // Reset current selection
  const handleResetDraw = () => {
    setSelectedIndices([]);
    setDrawnResults([]);
  };

  const handleContinue = () => {
    if (drawnResults.length >= 3) {
      onCardsDrawn(drawnResults.slice(0, 3));
    }
  };

  // Scroll ribbon helper
  const handleScrollRibbon = (direction: 'left' | 'right') => {
    if (ribbonRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ribbonRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: motionTokens.ease.standard }}
      className="max-w-5xl mx-auto space-y-6 select-none"
    >
      {/* Top Sanctuary Guidance Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.18)]">
          <Layers className="w-3.5 h-3.5 text-[#F2D675]" />
          <span>STEP 2: DRAW YOUR 3 CELESTIAL CARDS</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#F5F4EC]">
          {isComplete
            ? 'All 3 Archetypes Drawn'
            : currentStepNum === 0
            ? 'Draw Card 1: Your Past & Foundation'
            : currentStepNum === 1
            ? 'Draw Card 2: Your Present Crucible'
            : 'Draw Card 3: Your Future Horizon'}
        </h2>

        <p className="text-xs sm:text-sm text-[#AABDB7] max-w-xl mx-auto font-sans leading-relaxed">
          {isComplete
            ? 'Your 3 resonance cards have been selected from the 78-card deck. Proceed to uncover their archetypal revelations.'
            : 'Center your mind on your inquiry and tap a card from the deck below. Each card is drawn with authentic cryptographic entropy.'}
        </p>

        {question && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-[rgba(5,20,16,0.8)] border border-[rgba(212,175,55,0.22)] text-xs text-[#D4AF37] italic font-serif">
            &ldquo;{question}&rdquo;
          </div>
        )}
      </div>

      {/* 3 Spread Target Slots (Past • Present • Future) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto py-3">
        {[0, 1, 2].map((slotIdx) => {
          const meta = slotMetadata[slotIdx];
          const drawn = drawnResults[slotIdx];
          const isSlotActive = currentStepNum === slotIdx;

          return (
            <div
              key={slotIdx}
              className="flex flex-col items-center space-y-3"
            >
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  {meta.title}
                </span>
                <span className="text-[10px] text-[#AABDB7] font-sans block">
                  {meta.subtitle}
                </span>
              </div>

              {/* Target Slot Box */}
              <div
                className={`relative w-[190px] sm:w-[210px] h-[310px] sm:h-[345px] rounded-[22px] transition-all duration-300 flex items-center justify-center ${
                  drawn
                    ? ''
                    : isSlotActive
                    ? 'border-2 border-dashed border-[#F2D675] bg-[rgba(212,175,55,0.06)] shadow-[0_0_25px_rgba(212,175,55,0.2)] animate-pulse'
                    : 'border-2 border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(5,20,16,0.35)]'
                }`}
              >
                {drawn ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0, y: 40, rotateZ: -6 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateZ: 0 }}
                    transition={motionTokens.spring.medium}
                    className="w-full h-full flex items-center justify-center relative"
                  >
                    <LuxuryTarotCard
                      card={drawn.card}
                      orientation={drawn.orientation}
                      isFlipped={false}
                      size="md"
                      enable3DTilt={true}
                      slotLabel={meta.title}
                      showBackHint={false}
                    />

                    {/* Checkmark Tag */}
                    <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-[rgba(11,33,27,0.95)] border border-[#009B77] text-[10px] font-mono text-[#009B77] font-semibold flex items-center gap-1 shadow-lg z-20">
                      <CheckCircle2 className="w-3 h-3 text-[#009B77]" />
                      <span>Drawn</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-mono font-bold transition-all ${
                      isSlotActive 
                        ? 'border-[#F2D675] text-[#F2D675] bg-[rgba(212,175,55,0.18)] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110' 
                        : 'border-[rgba(255,255,255,0.15)] text-[#AABDB7]'
                    }`}>
                      {slotIdx + 1}
                    </div>
                    <span className={`text-xs font-sans max-w-[120px] ${isSlotActive ? 'text-[#F2D675] font-semibold' : 'text-[#AABDB7]'}`}>
                      {isSlotActive ? 'Select a card from the deck below' : 'Awaiting draw'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Deck Ribbon Controls */}
      <div className="liquid-glass-panel p-5 sm:p-6 rounded-2xl border border-[rgba(212,175,55,0.30)] space-y-4 shadow-2xl relative overflow-hidden bg-[rgba(4,18,14,0.85)]">
        {/* Ribbon Header with Quick Draw CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F2D675] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5F4EC] font-semibold">
              Shuffled 78-Card Observatory Deck ({78 - selectedIndices.length} Available)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isComplete && (
              <button
                onClick={handleQuickDraw}
                className="px-3.5 py-1.5 rounded-xl bg-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.25)] border border-[rgba(212,175,55,0.45)] text-[#F2D675] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.15)]"
              >
                <Zap className="w-3.5 h-3.5 text-[#F2D675]" />
                <span>Quick Auto-Draw</span>
              </button>
            )}

            {selectedIndices.length > 0 && !isComplete && (
              <button
                onClick={handleResetDraw}
                className="px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.12)] text-[#AABDB7] hover:text-[#F5F4EC] text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleScrollRibbon('left')}
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(212,175,55,0.20)] border border-[rgba(255,255,255,0.12)] text-[#AABDB7] hover:text-[#F2D675] flex items-center justify-center transition-colors cursor-pointer"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScrollRibbon('right')}
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(212,175,55,0.20)] border border-[rgba(255,255,255,0.12)] text-[#AABDB7] hover:text-[#F2D675] flex items-center justify-center transition-colors cursor-pointer"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Fanned Deck Ribbon with Rich Card Quality & Hover Physics */}
        <div
          ref={ribbonRef}
          className="flex items-center overflow-x-auto py-8 px-6 scrollbar-thin scrollbar-thumb-[rgba(212,175,55,0.25)] scrollbar-track-transparent select-none relative"
          style={{ scrollBehavior: 'smooth' }}
        >
          {shuffledDeck.map((item, idx) => {
            const isDrawn = selectedIndices.includes(idx);

            return (
              <motion.div
                key={item.id}
                onClick={() => handleSelectCard(idx)}
                whileHover={!isDrawn && !isComplete ? { 
                  y: -22, 
                  scale: 1.15, 
                  zIndex: 60,
                  boxShadow: '0 20px 35px rgba(0,0,0,0.8), 0 0 25px rgba(212,175,55,0.5)',
                } : undefined}
                whileTap={!isDrawn && !isComplete ? { scale: 0.95 } : undefined}
                className={`relative flex-shrink-0 w-16 sm:w-20 h-28 sm:h-34 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isDrawn
                    ? 'opacity-20 pointer-events-none border-transparent translate-y-6'
                    : 'border-[rgba(212,175,55,0.5)] hover:border-[#F2D675] bg-gradient-to-br from-[#061814] via-[#0B251F] to-[#04120E] shadow-[0_10px_25px_rgba(0,0,0,0.65)]'
                }`}
                style={{
                  marginLeft: idx === 0 ? '0' : '-16px',
                  zIndex: idx,
                }}
              >
                {/* Gilded Rim Accent */}
                <div className="absolute -inset-[1px] rounded-[13px] bg-gradient-to-br from-[#F5F4EC]/60 via-[#D4AF37]/80 to-[#8A6E1E]/60 pointer-events-none opacity-80" />

                {/* Traditional geometric card back pattern */}
                <div className="relative w-full h-full rounded-lg border border-[rgba(212,175,55,0.4)] flex flex-col items-center justify-between p-1.5 overflow-hidden bg-gradient-to-br from-[#0B211B] via-[#061411] to-[#0B211B]">
                  <div className="text-[7.5px] font-mono tracking-widest text-[#D4AF37]/80">काल</div>
                  
                  {/* Miniature Sacred Yantra Emblem */}
                  <div className="w-6 h-6 rounded-full border border-[rgba(212,175,55,0.5)] bg-[rgba(11,33,27,0.9)] flex items-center justify-center text-[#F2D675] text-[9px] font-serif shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                    ✦
                  </div>
                  
                  <div className="text-[7.5px] font-mono tracking-widest text-[#D4AF37]/80">ASTRA</div>

                  {/* Micro Shimmer Line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center text-[11px] font-mono text-[#AABDB7]">
          Tip: Scroll or drag horizontally across the deck. Click any 3 cards to draw your Past, Present, and Future archetypes.
        </div>
      </div>

      {/* Action Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] text-xs text-[#AABDB7] font-mono transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Question</span>
        </button>

        <motion.button
          onClick={handleContinue}
          disabled={!isComplete}
          whileHover={isComplete ? { scale: 1.02 } : undefined}
          whileTap={isComplete ? { scale: 0.98 } : undefined}
          className={`px-8 py-3 rounded-xl font-sans font-semibold text-sm border flex items-center gap-2 transition-all ${
            isComplete
              ? 'bg-gradient-to-r from-[#006B5B] to-[#009B77] hover:from-[#007D69] hover:to-[#00B388] text-[#F5F4EC] border-[#009B77] shadow-[0_0_25px_rgba(0,155,119,0.35)] cursor-pointer'
              : 'bg-[rgba(11,33,27,0.3)] border-[rgba(255,255,255,0.08)] text-[#AABDB7] cursor-not-allowed'
          }`}
        >
          <span>Continue to Card Reveal</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </motion.button>
      </div>
    </motion.div>
  );
}
