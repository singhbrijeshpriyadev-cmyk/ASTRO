'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  TarotReadingSnapshot, 
  TarotCard, 
  TarotTopic, 
  ProductionTarotReading 
} from '@/lib/tarot/types';
import { ALL_TAROT_CARDS, getTarotCardImageUrl } from '@/lib/tarot/cards';
import { drawRandomCards, DrawnCardResult } from '@/lib/tarot/randomizer';
import { interpretThreeCardSpread } from '@/lib/tarot/interpretation-engine';
import { TarotHomeStep } from './reading/TarotHomeStep';
import { QuestionStep } from './reading/QuestionStep';
import { ShuffleAnimation } from './reading/ShuffleAnimation';
import { InteractiveDeckDrawStep } from './reading/InteractiveDeckDrawStep';
import { CardRevealStep } from './reading/CardRevealStep';
import { ReadingResultStep } from './reading/ReadingResultStep';
import { ShareReadingModal } from './reading/ShareReadingModal';
import { ReadingHistoryDrawer } from './reading/ReadingHistoryDrawer';
import { TarotArchetypeShell } from './TarotArchetypeShell';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  History, 
  Search, 
  Compass, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  RotateCw,
  RefreshCw,
  Eye,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface TarotSanctuaryViewProps {
  onSynthesizeReading?: (snapshot: TarotReadingSnapshot) => void;
  birthProfileName?: string;
  astrologyContext?: {
    lagna?: string;
    moonSign?: string;
    nakshatra?: string;
    mahadasha?: string;
  };
}

type SanctuaryTab = 'reading' | 'compendium' | 'archetypes';
type ReadingFlowStep = 'home' | 'question' | 'shuffle' | 'draw' | 'reveal' | 'result';

export function TarotSanctuaryView({ 
  onSynthesizeReading,
  birthProfileName = 'Ananda Sadhaka',
  astrologyContext = {
    lagna: 'Vrishchika (Scorpio)',
    moonSign: 'Tula (Libra)',
    nakshatra: 'Chitra',
    mahadasha: 'Guru (Jupiter)',
  }
}: TarotSanctuaryViewProps) {
  const [activeTab, setActiveTab] = useState<SanctuaryTab>('reading');
  const [flowStep, setFlowStep] = useState<ReadingFlowStep>('home');
  const [selectedTopic, setSelectedTopic] = useState<TarotTopic>('general');
  const [userQuestion, setUserQuestion] = useState<string>('');

  // Active production reading result
  const [currentReading, setCurrentReading] = useState<ProductionTarotReading | null>(() => {
    // Initial pre-generated benchmark reading
    const initialDraw = drawRandomCards(3);
    return interpretThreeCardSpread(
      initialDraw,
      'What energetic trajectory guides my current vocational and spiritual horizon?',
      'career'
    );
  });

  // Modal / Drawer state
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Compendium state
  const [compendiumFilter, setCompendiumFilter] = useState<string>('all');
  const [compendiumSearch, setCompendiumSearch] = useState<string>('');
  const [selectedCompendiumCard, setSelectedCompendiumCard] = useState<TarotCard | null>(ALL_TAROT_CARDS[0]);
  const [compendiumFlipped, setCompendiumFlipped] = useState<boolean>(false);

  // Handle flow transitions
  const handleStartFromHome = (topic: TarotTopic) => {
    setSelectedTopic(topic);
    setFlowStep('question');
  };

  const handleQuestionSubmit = (data: { question: string; topic: TarotTopic; connectAstrology: boolean }) => {
    setUserQuestion(data.question);
    setSelectedTopic(data.topic);

    // Transition to visual shuffle animation
    setFlowStep('shuffle');
  };

  const handleShuffleComplete = () => {
    // Shuffling complete -> Proceed to interactive user card draw!
    setFlowStep('draw');
  };

  const handleCardsDrawn = (drawnCards: DrawnCardResult[]) => {
    // 3 cards drawn by seeker -> Generate full interpretation
    const newReading = interpretThreeCardSpread(
      drawnCards,
      userQuestion || 'What energetic trajectory guides my current vocational and spiritual horizon?',
      selectedTopic
    );
    setCurrentReading(newReading);
    setFlowStep('reveal');
  };

  const handleRevealComplete = () => {
    setFlowStep('result');
  };

  const handleResetToNew = () => {
    setFlowStep('home');
  };

  const handleSelectSavedReading = (savedReading: ProductionTarotReading) => {
    setCurrentReading(savedReading);
    setFlowStep('result');
  };

  const handleSynthesizeAstrology = () => {
    if (!currentReading || !onSynthesizeReading) return;

    const snapshot: TarotReadingSnapshot = {
      readingId: currentReading.readingId,
      timestamp: currentReading.timestamp,
      spreadId: currentReading.spreadId,
      spreadName: currentReading.spreadName,
      userQuestion: currentReading.question,
      query: currentReading.question,
      topic: currentReading.topic,
      cards: currentReading.cards.map((c, i) => ({
        cardId: c.cardId,
        card: c.card,
        positionIndex: i,
        positionName: c.positionName,
        positionDescription: c.positionMeaning,
        isReversed: c.orientation === 'reversed',
      })),
      calculationMetadata: {
        totalDeckSize: 78,
        shuffleAlgorithm: 'Cryptographic Fisher-Yates with Rejection Sampling',
        allowReversed: true,
        timestampUTC: currentReading.timestamp,
      },
    };

    onSynthesizeReading(snapshot);
  };

  const getElementIcon = (elem: string) => {
    if (elem.includes('Fire')) return <Flame className="w-3.5 h-3.5 text-amber-400 inline mr-1" />;
    if (elem.includes('Water')) return <Droplets className="w-3.5 h-3.5 text-blue-400 inline mr-1" />;
    if (elem.includes('Air')) return <Wind className="w-3.5 h-3.5 text-cyan-300 inline mr-1" />;
    if (elem.includes('Earth')) return <Mountain className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />;
    return <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] inline mr-1" />;
  };

  // Filtered compendium cards
  const filteredCards = useMemo(() => {
    return ALL_TAROT_CARDS.filter(card => {
      if (compendiumFilter === 'major' && card.arcana !== 'major') return false;
      if (compendiumFilter === 'wands' && card.suit !== 'wands') return false;
      if (compendiumFilter === 'cups' && card.suit !== 'cups') return false;
      if (compendiumFilter === 'swords' && card.suit !== 'swords') return false;
      if (compendiumFilter === 'pentacles' && card.suit !== 'pentacles') return false;

      if (compendiumSearch.trim()) {
        const q = compendiumSearch.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesAstro = card.astrologicalAssociation.toLowerCase().includes(q);
        const matchesKeywords = [...card.uprightKeywords, ...card.reversedKeywords].some(kw =>
          kw.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesAstro && !matchesKeywords) return false;
      }
      return true;
    });
  }, [compendiumFilter, compendiumSearch]);

  return (
    <div className="space-y-6 text-[#F5F4EC] pb-12 animate-fade-in">
      {/* Top Sanctuary Navigation Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(3,16,14,0.6)] border border-[rgba(255,255,255,0.08)] overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('reading')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reading'
                ? 'bg-[rgba(212,175,55,0.20)] text-[#F2D675] font-semibold border border-[rgba(212,175,55,0.35)] shadow-sm'
                : 'text-[#AABDB7] hover:text-[#F5F4EC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Three-Card Oracle</span>
          </button>

          <button
            onClick={() => setActiveTab('compendium')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'compendium'
                ? 'bg-[rgba(212,175,55,0.20)] text-[#F2D675] font-semibold border border-[rgba(212,175,55,0.35)] shadow-sm'
                : 'text-[#AABDB7] hover:text-[#F5F4EC]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#009B77]" />
            <span>78-Card Compendium</span>
          </button>

          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'archetypes'
                ? 'bg-[rgba(212,175,55,0.20)] text-[#F2D675] font-semibold border border-[rgba(212,175,55,0.35)] shadow-sm'
                : 'text-[#AABDB7] hover:text-[#F5F4EC]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#8B6BBE]" />
            <span>Vedic Archetypes</span>
          </button>
        </div>

        {/* Sanctuary History Trigger */}
        <button
          onClick={() => setShowHistoryDrawer(true)}
          className="px-3.5 py-1.5 rounded-xl border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.15)] text-[#D4AF37] hover:text-[#F2D675] text-xs font-mono transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <History className="w-3.5 h-3.5" />
          <span>Past Readings Sanctuary</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. THREE-CARD ORACLE READING FLOW TAB */}
      {/* ======================================================== */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          {flowStep === 'home' && (
            <TarotHomeStep
              onStartReading={handleStartFromHome}
              onOpenHistory={() => setShowHistoryDrawer(true)}
              onOpenCompendium={() => setActiveTab('compendium')}
            />
          )}

          {flowStep === 'question' && (
            <QuestionStep
              initialTopic={selectedTopic}
              initialQuestion={userQuestion}
              birthProfileName={birthProfileName}
              astrologyContext={astrologyContext}
              onSubmit={handleQuestionSubmit}
              onBack={() => setFlowStep('home')}
            />
          )}

          {flowStep === 'shuffle' && (
            <ShuffleAnimation onComplete={handleShuffleComplete} />
          )}

          {flowStep === 'draw' && (
            <InteractiveDeckDrawStep
              question={userQuestion}
              topicLabel={selectedTopic}
              onCardsDrawn={handleCardsDrawn}
              onBack={() => setFlowStep('question')}
            />
          )}

          {flowStep === 'reveal' && currentReading && (
            <CardRevealStep
              reading={currentReading}
              onRevealComplete={handleRevealComplete}
            />
          )}

          {flowStep === 'result' && currentReading && (
            <ReadingResultStep
              reading={currentReading}
              onNewReading={handleResetToNew}
              onShareReading={() => setShowShareModal(true)}
              onSynthesizeAstrology={handleSynthesizeAstrology}
            />
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 78-CARD COMPENDIUM ENCYCLOPEDIA TAB */}
      {/* ======================================================== */}
      {activeTab === 'compendium' && (
        <div className="space-y-6 animate-fade-in">
          {/* Compendium Control Bar */}
          <div className="liquid-glass-card p-4 rounded-2xl border border-[rgba(255,255,255,0.10)] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#AABDB7]" />
              <input
                type="text"
                placeholder="Search card by name, astro key, keyword..."
                value={compendiumSearch}
                onChange={e => setCompendiumSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[rgba(6,20,17,0.6)] border border-[rgba(255,255,255,0.10)] focus:border-[#D4AF37] text-xs font-sans text-[#F5F4EC] placeholder-[#AABDB7]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'all', label: 'All 78 Cards' },
                { id: 'major', label: 'Major (22)' },
                { id: 'wands', label: 'Wands (14)' },
                { id: 'cups', label: 'Cups (14)' },
                { id: 'swords', label: 'Swords (14)' },
                { id: 'pentacles', label: 'Pentacles (14)' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCompendiumFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    compendiumFilter === cat.id
                      ? 'bg-[rgba(212,175,55,0.20)] text-[#F2D675] border border-[rgba(212,175,55,0.40)] font-semibold'
                      : 'text-[#AABDB7] hover:text-[#F5F4EC] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compendium Grid + Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredCards.map(card => {
                const isSelected = selectedCompendiumCard?.id === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedCompendiumCard(card);
                      setCompendiumFlipped(false);
                    }}
                    className={`liquid-glass-card p-2 rounded-xl border transition-all cursor-pointer group text-center space-y-1.5 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.12)] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                        : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.30)]'
                    }`}
                  >
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-black/60 border border-[rgba(255,255,255,0.08)]">
                      <Image
                        src={card.image_path || getTarotCardImageUrl(card)}
                        alt={card.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="140px"
                      />
                    </div>
                    <div className="text-[11px] font-serif font-bold text-[#F5F4EC] truncate">
                      {card.name}
                    </div>
                    <div className="text-[9px] font-mono text-[#AABDB7] uppercase">
                      {card.arcana === 'major' ? `Arcana ${card.number}` : `${card.rank} of ${card.suit}`}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Card Deep Archetype Dossier */}
            {selectedCompendiumCard && (
              <div className="liquid-glass-panel p-6 rounded-2xl border border-[rgba(212,175,55,0.35)] space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="relative w-44 h-64 mx-auto rounded-xl overflow-hidden border-2 border-[rgba(212,175,55,0.40)] bg-black/80 shadow-2xl">
                      <Image
                        src={selectedCompendiumCard.image_path || getTarotCardImageUrl(selectedCompendiumCard)}
                        alt={selectedCompendiumCard.name}
                        fill
                        className={`object-cover transition-transform duration-500 ${
                          compendiumFlipped ? 'rotate-180' : ''
                        }`}
                        sizes="200px"
                      />
                      {compendiumFlipped && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-amber-400/50 text-amber-300 text-[9px] font-mono uppercase">
                          Reversed
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setCompendiumFlipped(!compendiumFlipped)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.15)] text-[#D4AF37] text-[11px] font-mono transition-all"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{compendiumFlipped ? 'Show Upright View' : 'Inspect Reversed Angle'}</span>
                    </button>

                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#F5F4EC]">
                        {selectedCompendiumCard.name}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                        <span className="text-xs font-mono text-[#D4AF37]">
                          {selectedCompendiumCard.arcana === 'major'
                            ? `Major Arcana ${selectedCompendiumCard.number}`
                            : `${selectedCompendiumCard.rank} of ${selectedCompendiumCard.suit}`}
                        </span>
                        <span className="text-[#AABDB7]">•</span>
                        <span className="text-xs font-mono text-[#009B77]">
                          {selectedCompendiumCard.element}
                        </span>
                        <span className="text-[#AABDB7]">•</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(212,175,55,0.15)] text-[#F2D675] border border-[rgba(212,175,55,0.3)]">
                          {selectedCompendiumCard.arcana === 'major'
                            ? 'Mahat (Karma)'
                            : selectedCompendiumCard.suit === 'wands'
                            ? 'Dharma (Action)'
                            : selectedCompendiumCard.suit === 'cups'
                            ? 'Moksha (Flow)'
                            : selectedCompendiumCard.suit === 'swords'
                            ? 'Kama (Mind)'
                            : 'Artha (Reality)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Upright vs Reversed Meaning */}
                  <div className="space-y-3 text-xs font-sans">
                    <div className="p-3.5 rounded-xl bg-[rgba(11,33,27,0.5)] border border-[rgba(255,255,255,0.06)] space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#009B77] block font-semibold">
                        Upright Meaning:
                      </span>
                      <p className="text-[#F5F4EC] leading-relaxed">
                        {selectedCompendiumCard.meaning_upright || selectedCompendiumCard.uprightMeaning}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[rgba(11,33,27,0.5)] border border-[rgba(255,255,255,0.06)] space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
                        Reversed Meaning:
                      </span>
                      <p className="text-[#AABDB7] leading-relaxed">
                        {selectedCompendiumCard.meaning_reversed || selectedCompendiumCard.reversedMeaning}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[rgba(139,107,190,0.08)] border border-[rgba(139,107,190,0.25)] space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A78BFA] block font-semibold">
                        Astrological & Symbolic Resonance:
                      </span>
                      <p className="text-[#AABDB7] leading-relaxed">
                        {selectedCompendiumCard.astrologicalAssociation} — {selectedCompendiumCard.associated_symbolism || selectedCompendiumCard.symbolism}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] font-mono text-[#AABDB7]">
                  Card ID: {selectedCompendiumCard.id}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VEDIC ARCHETYPES SYNTHESIS TAB */}
      {/* ======================================================== */}
      {activeTab === 'archetypes' && (
        <div className="animate-fade-in">
          <TarotArchetypeShell />
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS: SHARE & HISTORY DRAWERS */}
      {/* ======================================================== */}
      {showShareModal && currentReading && (
        <ShareReadingModal
          reading={currentReading}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}

      <ReadingHistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        onSelectReading={handleSelectSavedReading}
      />
    </div>
  );
}
