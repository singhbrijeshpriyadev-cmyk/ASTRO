'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { ALL_TAROT_CARDS } from '@/lib/tarot/cards';
import { 
  getCryptoProvider, 
  getSecureRandomInt, 
  getSecureOrientation, 
  shuffleDeck 
} from '@/lib/tarot/randomizer';
import { tarotAudio } from '@/lib/tarot/sound-effects';
import { DeckStack } from './DeckStack';
import { DeckShuffleAnimation } from './DeckShuffleAnimation';
import { DeckCutInteraction } from './DeckCutInteraction';
import { CardFannedSpread } from './CardFannedSpread';
import { CinematicDrawnCard } from './CinematicDrawnCard';
import { CardDetailModal } from './CardDetailModal';
import { TarotSpreadSelector, TAROT_SPREADS, TarotSpreadDef } from './TarotSpreadSelector';
import { ReadingResultSummary, DrawnCardItem } from './ReadingResultSummary';
import { ReadingHistoryModal } from './ReadingHistoryModal';
import { 
  Volume2, 
  VolumeX, 
  History, 
  Sparkles, 
  RotateCcw, 
  Compass, 
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

type TarotTableState = 
  | 'IDLE'
  | 'SHUFFLING'
  | 'CUTTING'
  | 'SELECTING_CARD'
  | 'REVEALING'
  | 'READING_COMPLETE';

export function TarotTable() {
  const [tableState, setTableState] = useState<TarotTableState>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Spread & Question
  const [selectedSpread, setSelectedSpread] = useState<TarotSpreadDef>(TAROT_SPREADS[0]);
  const [question, setQuestion] = useState('');
  const [isQuestionFocused, setIsQuestionFocused] = useState(false);

  // Shuffled Deck State
  const [virtualDeck, setVirtualDeck] = useState<TarotCard[]>([]);
  const [selectedDeckIndices, setSelectedDeckIndices] = useState<number[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCardItem[]>([]);
  const [isDrawingInProgress, setIsDrawingInProgress] = useState(false);

  // Detailed Modal Card State
  const [modalCard, setModalCard] = useState<{ card: TarotCard; orientation: TarotOrientation } | null>(null);

  // Initial sound mute state
  useEffect(() => {
    setIsMuted(tarotAudio.getMuted());
  }, []);

  const handleToggleMute = () => {
    const updated = tarotAudio.toggleMute();
    setIsMuted(updated);
  };

  // Prepare a cryptographically randomized deck of 78 cards
  const prepareDeck = () => {
    const provider = getCryptoProvider();
    let cards = [...ALL_TAROT_CARDS];
    if (provider) {
      cards = shuffleDeck(cards, provider);
    } else {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
    }
    setVirtualDeck(cards);
  };

  // Step 4: User clicks "Shuffle Deck"
  const handleStartShuffle = () => {
    if (tableState !== 'IDLE') return;
    prepareDeck();
    setTableState('SHUFFLING');
  };

  // Step 7: Shuffle finishes -> Proceed to Cut
  const handleShuffleComplete = () => {
    setTableState('CUTTING');
  };

  // Step 7: Cut finishes -> Proceed to selecting cards from horizontal fanned spread
  const handleCutComplete = () => {
    setSelectedDeckIndices([]);
    setDrawnCards([]);
    setTableState('SELECTING_CARD');
  };

  // Step 10 & 11: User selects a card from fanned ribbon
  const handleSelectFannedCard = (index: number) => {
    if (tableState !== 'SELECTING_CARD') return;
    if (isDrawingInProgress) return;
    if (selectedDeckIndices.includes(index)) return;

    const currentSlotIndex = drawnCards.length;
    const targetSlot = selectedSpread.slots[currentSlotIndex];
    if (!targetSlot) return;

    setIsDrawingInProgress(true);

    // Cryptographic orientation determination
    const provider = getCryptoProvider();
    const orientation: TarotOrientation = provider
      ? getSecureOrientation(provider)
      : Math.random() < 0.5 ? 'upright' : 'reversed';

    const card = virtualDeck[index] || ALL_TAROT_CARDS[index % ALL_TAROT_CARDS.length];

    const newDrawnItem: DrawnCardItem = {
      card,
      orientation,
      slotTitle: targetSlot.title,
      slotSubtitle: targetSlot.subtitle,
    };

    const nextSelected = [...selectedDeckIndices, index];
    const nextDrawn = [...drawnCards, newDrawnItem];

    setSelectedDeckIndices(nextSelected);
    setDrawnCards(nextDrawn);

    // If all cards for the spread have been drawn:
    if (nextDrawn.length >= selectedSpread.cardCount) {
      setTimeout(() => {
        setTableState('REVEALING');
      }, 1000);
    }
  };

  // Step 24: New reading reset
  const handleNewReading = () => {
    setTableState('IDLE');
    setDrawnCards([]);
    setSelectedDeckIndices([]);
  };

  const currentPickNumber = drawnCards.length + 1;
  const currentSlotTitle = selectedSpread.slots[drawnCards.length]?.title || 'Next Card';

  return (
    <div
      className="relative w-full min-h-[92vh] rounded-[32px] overflow-hidden border border-[rgba(212,175,55,0.22)] shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between p-4 sm:p-8 select-none"
      style={{
        background: `
          radial-gradient(ellipse 90% 65% at 50% -10%, rgba(123,3,35,0.28) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 85% 85%, rgba(0,107,91,0.22) 0%, transparent 60%),
          radial-gradient(ellipse 80% 70% at 15% 90%, rgba(16,42,35,0.40) 0%, transparent 70%),
          radial-gradient(circle at 50% 50%, rgba(230,230,250,0.02) 0%, transparent 80%),
          #081714
        `,
      }}
    >
      {/* ======================================================== */}
      {/* ATMOSPHERIC BACKGROUND EFFECTS (Fog, Grid, Ambient Glow) */}
      {/* ======================================================== */}
      {/* Subtle table velvet texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(242,214,117,0.7) 1px, transparent 1px),' +
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        }}
      />

      {/* Atmospheric candle/lantern warm glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.14) 0%, rgba(123,3,35,0.12) 40%, transparent 75%)',
          filter: 'blur(45px)',
        }}
      />

      {/* Slow floating mist / fog layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(0,155,119,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(123,3,35,0.15) 0%, transparent 50%)',
        }}
      />

      {/* ======================================================== */}
      {/* TOP TABLE HEADER & NAVIGATION TOOLBAR */}
      {/* ======================================================== */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 z-20 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[linear-gradient(135deg,rgba(212,175,55,0.25)_0%,rgba(0,107,91,0.2)_100%)] border border-[rgba(212,175,55,0.4)] flex items-center justify-center text-[#D4AF37] shadow-lg">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#F5F4EC] tracking-tight">
              Virtual Tarot Altar
            </h1>
            <p className="text-[11px] font-mono text-[#8BB5A8]">
              78-Card Rider-Waite-Smith • Cryptographic Entropy
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            type="button"
            className="p-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.08)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title={isMuted ? 'Unmute Tarot soundscape' : 'Mute Tarot soundscape'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#009B77]" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* Past Readings Chronicle */}
          <button
            onClick={() => setShowHistory(true)}
            type="button"
            className="p-2 px-3 rounded-xl bg-[rgba(212,175,55,0.08)] hover:bg-[rgba(212,175,55,0.18)] border border-[rgba(212,175,55,0.3)] text-[#F2D675] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <History className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Sanctuary Chronicle</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STAGE AREA: DYNAMIC EXPERIENCE ACROSS STATE MACHINE */}
      {/* ======================================================== */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-6 z-10">
        {/* ---------------- STATE 1: IDLE ---------------- */}
        {tableState === 'IDLE' && (
          <div className="flex flex-col items-center justify-center space-y-7 w-full max-w-4xl animate-fade-in">
            {/* Optional Question Input (Step 22) */}
            <div className="w-full max-w-xl text-center space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#009B77] font-semibold">
                ✦ FORMULATE YOUR INQUIRY ✦
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What would you like spiritual guidance on? (or leave blank for general guidance)"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={() => setIsQuestionFocused(true)}
                  onBlur={() => setIsQuestionFocused(false)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[rgba(6,20,17,0.7)] border border-[rgba(212,175,55,0.3)] focus:border-[#D4AF37] focus:shadow-[0_0_24px_rgba(212,175,55,0.25)] text-sm font-sans text-[#F5F4EC] placeholder-[#AABDB7]/60 outline-none transition-all text-center"
                />
              </div>

              {/* Sample question pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {[
                  'What energy guides my vocational horizon?',
                  'What unspoken current surrounds my connection?',
                  'What spiritual lesson demands my conscious focus?',
                ].map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuestion(sample)}
                    className="text-[10px] font-mono text-[#8BB5A8] hover:text-[#F2D675] px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
                  >
                    ✦ {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Spread Selector */}
            <TarotSpreadSelector
              selectedSpreadId={selectedSpread.id}
              onSelectSpread={setSelectedSpread}
            />

            {/* Physical Deck Stack on Table */}
            <div className="flex flex-col items-center pt-2">
              <DeckStack onClick={handleStartShuffle} />

              <motion.button
                onClick={handleStartShuffle}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                className="mt-6 px-8 py-3.5 rounded-2xl bg-[linear-gradient(135deg,#006B5B_0%,#009B77_50%,#00856A_100%)] border border-[rgba(212,175,55,0.45)] text-[#F5F4EC] font-serif text-sm font-bold tracking-wider uppercase shadow-[0_4px_25px_rgba(0,107,91,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-110 cursor-pointer flex items-center gap-2.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#F2D675]" />
                <span>Begin Consecration & Shuffle</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* ---------------- STATE 2: SHUFFLING ---------------- */}
        {tableState === 'SHUFFLING' && (
          <DeckShuffleAnimation onComplete={handleShuffleComplete} />
        )}

        {/* ---------------- STATE 3: CUTTING ---------------- */}
        {tableState === 'CUTTING' && (
          <DeckCutInteraction onCutComplete={handleCutComplete} />
        )}

        {/* ---------------- STATE 4: SELECTING CARDS ---------------- */}
        {(tableState === 'SELECTING_CARD' || tableState === 'REVEALING') && (
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Draw Progression Slots Display */}
            <div className="w-full max-w-4xl flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              {selectedSpread.slots.map((slot, sIdx) => {
                const drawnItem = drawnCards[sIdx];
                return (
                  <div key={sIdx} className="flex flex-col items-center">
                    {drawnItem ? (
                      <CinematicDrawnCard
                        card={drawnItem.card}
                        orientation={drawnItem.orientation}
                        slotTitle={drawnItem.slotTitle}
                        slotSubtitle={drawnItem.slotSubtitle}
                        isFlipped={true}
                        autoFlipDelayMs={250}
                        onRevealComplete={() => setIsDrawingInProgress(false)}
                        onCardClick={() => setModalCard({ card: drawnItem.card, orientation: drawnItem.orientation })}
                      />
                    ) : (
                      /* Empty Target Reading Slot with active portal beacon */
                      (() => {
                        const isActiveSlot = sIdx === drawnCards.length;
                        return (
                          <div className="flex flex-col items-center w-[180px] sm:w-[200px]">
                            <div className="text-center mb-3">
                              <span className={`text-[11px] font-mono tracking-widest uppercase font-bold block ${
                                isActiveSlot ? 'text-[#F2D675] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'text-[#AABDB7]'
                              }`}>
                                {slot.title}
                              </span>
                              <span className="text-[10px] font-sans text-[#8BB5A8] block">
                                {slot.subtitle}
                              </span>
                            </div>
                            <motion.div
                              animate={
                                isActiveSlot
                                  ? {
                                      scale: [1, 1.025, 1],
                                      borderColor: ['rgba(212,175,55,0.4)', 'rgba(0,155,119,0.8)', 'rgba(212,175,55,0.4)'],
                                      boxShadow: [
                                        '0 0 15px rgba(212,175,55,0.15)',
                                        '0 0 30px rgba(0,155,119,0.35)',
                                        '0 0 15px rgba(212,175,55,0.15)',
                                      ],
                                    }
                                  : {}
                              }
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                              className={`relative w-[180px] sm:w-[200px] aspect-[7/12] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm transition-colors ${
                                isActiveSlot
                                  ? 'bg-[rgba(16,42,35,0.5)] border-[rgba(212,175,55,0.6)]'
                                  : 'border-[rgba(212,175,55,0.2)] bg-[rgba(6,20,17,0.35)]'
                              }`}
                            >
                              <div
                                className={`w-11 h-11 rounded-full border border-dashed flex items-center justify-center mb-2 transition-all ${
                                  isActiveSlot
                                    ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.12)] text-[#F2D675] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                                    : 'border-[rgba(0,155,119,0.35)] text-[#D4AF37]/50'
                                }`}
                              >
                                {isActiveSlot ? (
                                  <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                                ) : (
                                  <span className="font-mono text-sm">{sIdx + 1}</span>
                                )}
                              </div>
                              <span className={`text-[11px] font-mono tracking-wider font-semibold ${
                                isActiveSlot ? 'text-[#F2D675]' : 'text-[#AABDB7]/70'
                              }`}>
                                {isActiveSlot
                                  ? isDrawingInProgress
                                    ? 'Convergencing…'
                                    : 'Active Receptor'
                                  : 'Reserved Slot'}
                              </span>
                              <span className="text-[10px] font-sans text-[#8BB5A8]/80 mt-1 max-w-[140px] leading-tight">
                                {isActiveSlot
                                  ? isDrawingInProgress
                                    ? 'Card is flying into position'
                                    : 'Pick a card from ribbon'
                                  : `Position ${sIdx + 1}`}
                              </span>
                            </motion.div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                );
              })}
            </div>

            {/* Horizontal Fanned Ribbon for remaining selections */}
            {tableState === 'SELECTING_CARD' && drawnCards.length < selectedSpread.cardCount && (
              <div className="w-full pt-4">
                <CardFannedSpread
                  totalCards={78}
                  selectedIndices={selectedDeckIndices}
                  onSelectCard={handleSelectFannedCard}
                  disabled={isDrawingInProgress}
                  promptText={
                    isDrawingInProgress
                      ? '✦ Consecrating card in flight…'
                      : `Choose Card ${currentPickNumber} of ${selectedSpread.cardCount}: ${currentSlotTitle}`
                  }
                />
              </div>
            )}

            {tableState === 'REVEALING' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 pt-4"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                  <span className="w-2 h-2 rounded-full bg-[#009B77] animate-ping" />
                  <span>Synthesizing cosmic alignments…</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTableState('READING_COMPLETE')}
                  className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#006B5B_0%,#009B77_100%)] border border-[rgba(212,175,55,0.4)] text-[#F5F4EC] text-xs font-mono font-semibold hover:brightness-110 cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <span>Proceed to Synthesis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* ---------------- STATE 5: READING COMPLETE ---------------- */}
        {tableState === 'READING_COMPLETE' && (
          <ReadingResultSummary
            cards={drawnCards}
            spread={selectedSpread}
            question={question}
            onNewReading={handleNewReading}
            onOpenCardDetails={(card, orientation) => setModalCard({ card, orientation })}
          />
        )}
      </div>

      {/* ======================================================== */}
      {/* BOTTOM FOOTER STATUS BAR */}
      {/* ======================================================== */}
      <div className="w-full max-w-5xl flex items-center justify-between text-[11px] font-mono text-[#8BB5A8] pt-4 border-t border-[rgba(255,255,255,0.06)] z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#009B77] animate-pulse" />
          <span>Active Spread: {selectedSpread.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {tableState !== 'IDLE' && (
            <button
              onClick={handleNewReading}
              type="button"
              className="text-[#D4AF37] hover:text-[#F2D675] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Table</span>
            </button>
          )}
          <span>Kaalika Observatory Oracle</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD DETAIL MODAL */}
      {/* ======================================================== */}
      <CardDetailModal
        card={modalCard?.card || null}
        orientation={modalCard?.orientation || 'upright'}
        onClose={() => setModalCard(null)}
      />

      {/* ======================================================== */}
      {/* READING HISTORY MODAL */}
      {/* ======================================================== */}
      <ReadingHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}
