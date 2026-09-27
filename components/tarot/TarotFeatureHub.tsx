'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { LuxuryTarotCard } from './LuxuryTarotCard';
import { ALL_TAROT_CARDS, getTarotCardImageUrl } from '@/lib/tarot/cards';
import { TarotCard } from '@/lib/tarot/types';
import {
  Sun, Moon, Star, Calendar, Heart, Users, Eye, HelpCircle,
  Sparkles, RefreshCw, BookOpen, RotateCw, Clock, ChevronRight,
  CheckCircle2, Flame, Droplets, Wind, Mountain, ArrowRight,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
interface FeatureHubProps {
  astrologyContext?: {
    lagna?: string;
    moonSign?: string;
    nakshatra?: string;
    mahadasha?: string;
  };
}

type FeatureId =
  | 'daily'
  | 'celtic'
  | 'journal'
  | 'moment'
  | 'year'
  | 'relationship'
  | 'meditation'
  | 'yesno';

// ─── Utility ────────────────────────────────────────────────────────────────
function pickCard(seed?: string): { card: TarotCard; reversed: boolean } {
  const all = ALL_TAROT_CARDS;
  const idx = seed
    ? Math.abs(seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % all.length
    : Math.floor(Math.random() * all.length);
  return { card: all[idx], reversed: Math.random() < 0.4 };
}

function pickNCards(n: number): Array<{ card: TarotCard; reversed: boolean }> {
  const shuffled = [...ALL_TAROT_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(card => ({ card, reversed: Math.random() < 0.4 }));
}

function getElementIcon(elem: string) {
  if (elem?.includes('Fire')) return <Flame className="w-3.5 h-3.5 text-amber-400" />;
  if (elem?.includes('Water')) return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
  if (elem?.includes('Air')) return <Wind className="w-3.5 h-3.5 text-cyan-300" />;
  if (elem?.includes('Earth')) return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
  return <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />;
}

function getTodaySeed(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ─── Feature: Daily Card Draw ────────────────────────────────────────────────
function DailyCardDraw() {
  const { card, reversed } = useMemo(() => pickCard(getTodaySeed()), []);
  const [flipped, setFlipped] = useState(false);
  const [notes, setNotes] = useState('');

  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] text-xs font-mono tracking-widest uppercase">
          <Sun className="w-3.5 h-3.5" />
          <span>Daily Card — {dayNames[today.getDay()]}, {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Your Card of the Day</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">One sacred card chosen by celestial entropy for your unique journey today.</p>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8">
        {/* Card */}
        <div className="flex flex-col items-center gap-3">
          <LuxuryTarotCard
            card={card}
            orientation={reversed ? 'reversed' : 'upright'}
            isFlipped={flipped}
            onFlip={() => setFlipped(true)}
            size="lg"
            enable3DTilt
            showBackHint={!flipped}
          />
          {!flipped && (
            <motion.button
              onClick={() => setFlipped(true)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#006B5B] to-[#009B77] text-[#F5F4EC] text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,155,119,0.35)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F2D675]" />
              Reveal Today's Card
            </motion.button>
          )}
          {flipped && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1">
              <div className="font-serif text-lg font-bold text-[#F5F4EC]">{card.name}</div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${reversed ? 'border-amber-400/50 text-amber-300 bg-amber-950/40' : 'border-[#009B77]/50 text-[#009B77] bg-[#009B77]/10'}`}>
                {reversed ? '↻ Reversed' : '↑ Upright'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Interpretation panel */}
        {flipped && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-4 max-w-sm">
            <div className="liquid-glass-panel rounded-2xl border border-[rgba(212,175,55,0.25)] p-5 space-y-4">
              <div className="flex items-center gap-2">
                {getElementIcon(card.element)}
                <span className="text-xs font-mono text-[#AABDB7]">{card.element} · {card.astrologicalAssociation}</span>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-1">Today's Guidance</div>
                <p className="text-sm text-[#F5F4EC] leading-relaxed">{reversed ? card.reversedMeaning : card.uprightMeaning}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#009B77] mb-1">Key Themes</div>
                <div className="flex flex-wrap gap-1.5">
                  {(reversed ? card.reversedKeywords : card.uprightKeywords).slice(0, 5).map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] text-[#AABDB7]">{kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-1.5">Personal Reflection</div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Write your reflection for today..."
                  rows={3}
                  className="w-full bg-[rgba(6,24,20,0.7)] border border-[rgba(212,175,55,0.2)] rounded-xl px-3 py-2 text-xs text-[#F5F4EC] placeholder-[#AABDB7]/50 resize-none outline-none focus:border-[rgba(212,175,55,0.5)] transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Feature: Celtic Cross ───────────────────────────────────────────────────
const CELTIC_POSITIONS = [
  { label: 'Present', key: 'present', desc: 'The central issue or current situation' },
  { label: 'Challenge', key: 'challenge', desc: 'What crosses or opposes you' },
  { label: 'Foundation', key: 'foundation', desc: 'Unconscious influences from the past' },
  { label: 'Past', key: 'past', desc: 'Recent influences fading away' },
  { label: 'Crowning', key: 'crown', desc: 'Best possible outcome if aligned' },
  { label: 'Near Future', key: 'future', desc: 'Energy entering your path soon' },
  { label: 'Self', key: 'self', desc: 'How you see yourself in this situation' },
  { label: 'Environment', key: 'env', desc: 'How others and circumstances see you' },
  { label: 'Hopes & Fears', key: 'hopes', desc: 'Your deepest hopes and fears' },
  { label: 'Outcome', key: 'outcome', desc: 'The likely culmination of this journey' },
];

function CelticCrossSpread() {
  const [cards, setCards] = useState<Array<{ card: TarotCard; reversed: boolean; flipped: boolean }>>([]);
  const [active, setActive] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  function handleDraw() {
    const picked = pickNCards(10);
    setCards(picked.map(p => ({ ...p, flipped: false })));
    setDrawn(true);
    setActive(null);
  }

  function flipCard(i: number) {
    setCards(prev => prev.map((c, idx) => idx === i ? { ...c, flipped: true } : c));
    setActive(i);
  }

  // Grid layout positions [col, row] (1-indexed, 5-col × 5-row grid)
  const gridLayout = [
    [3, 3], [3, 3], [3, 2], [3, 4], [3, 1], [3, 5],
    [1, 2], [2, 2], [4, 2], [5, 2],
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(139,107,190,0.2)] border border-[rgba(139,107,190,0.5)] text-[#C4B5FD] text-xs font-mono tracking-widest uppercase">
          <Star className="w-3.5 h-3.5" />
          <span>Celtic Cross · 10-Card Deep Spread</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Celtic Cross Spread</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">The most comprehensive single-reading layout revealing root, path, external forces, and destiny.</p>
      </div>

      {!drawn ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="grid grid-cols-3 gap-2 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-10 h-14 rounded-lg border border-[rgba(212,175,55,0.3)] bg-gradient-to-br from-[#061814] to-[#0B251F]" />
            ))}
          </div>
          <motion.button onClick={handleDraw} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#5B3A8C] to-[#7C5BBE] text-white font-semibold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(139,107,190,0.4)] cursor-pointer border border-[rgba(139,107,190,0.5)]">
            <Star className="w-4 h-4 text-[#C4B5FD]" />
            Cast the Celtic Cross
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card grid */}
          <div className="flex flex-wrap gap-2 justify-center">
            {cards.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => flipCard(i)}>
                <div className={`text-[8px] font-mono uppercase tracking-widest ${active === i ? 'text-[#F2D675]' : 'text-[#AABDB7]'}`}>
                  {CELTIC_POSITIONS[i].label}
                </div>
                <LuxuryTarotCard card={c.card} orientation={c.reversed ? 'reversed' : 'upright'}
                  isFlipped={c.flipped} onFlip={() => flipCard(i)} size="sm" enable3DTilt showBackHint={!c.flipped} />
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="liquid-glass-panel rounded-2xl border border-[rgba(139,107,190,0.3)] p-5 space-y-3">
            {active !== null ? (
              <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[rgba(139,107,190,0.25)] text-[#C4B5FD] text-[10px] font-mono uppercase border border-[rgba(139,107,190,0.4)]">
                    Position {active + 1}: {CELTIC_POSITIONS[active].label}
                  </span>
                </div>
                <p className="text-[11px] text-[#AABDB7] italic">{CELTIC_POSITIONS[active].desc}</p>
                <div className="font-serif text-lg font-bold text-[#F5F4EC]">{cards[active].card.name}</div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${cards[active].reversed ? 'border-amber-400/50 text-amber-300 bg-amber-950/40' : 'border-[#009B77]/50 text-[#009B77] bg-[#009B77]/10'}`}>
                  {cards[active].reversed ? '↻ Reversed' : '↑ Upright'}
                </span>
                <p className="text-sm text-[#F5F4EC]/90 leading-relaxed">
                  {cards[active].reversed ? cards[active].card.reversedMeaning : cards[active].card.uprightMeaning}
                </p>
              </motion.div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Eye className="w-8 h-8 text-[#AABDB7]/40 mx-auto" />
                <p className="text-sm text-[#AABDB7]">Tap any card to reveal its position meaning</p>
              </div>
            )}
          </div>
        </div>
      )}

      {drawn && (
        <div className="text-center">
          <button onClick={handleDraw} className="text-xs font-mono text-[#AABDB7] hover:text-[#F2D675] flex items-center gap-1 mx-auto cursor-pointer">
            <RefreshCw className="w-3 h-3" /> Cast Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Feature: Tarot Journal ──────────────────────────────────────────────────
interface JournalEntry {
  id: string;
  date: string;
  cardName: string;
  cardImg: string;
  reversed: boolean;
  reflection: string;
}

function TarotJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('kaalika_journal') || '[]'); } catch { return []; }
  });
  const [drafting, setDrafting] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftCard] = useState(() => pickCard());

  function saveEntry() {
    if (!draftText.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      cardName: draftCard.card.name,
      cardImg: getTarotCardImageUrl(draftCard.card),
      reversed: draftCard.reversed,
      reflection: draftText.trim(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('kaalika_journal', JSON.stringify(updated));
    setDraftText('');
    setDrafting(false);
  }

  function deleteEntry(id: string) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('kaalika_journal', JSON.stringify(updated));
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(0,155,119,0.15)] border border-[rgba(0,155,119,0.4)] text-[#009B77] text-xs font-mono tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sacred Tarot Journal</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Personal Reading Journal</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">Record reflections, track patterns across readings, and document your inner journey.</p>
      </div>

      <div className="flex justify-end">
        <motion.button onClick={() => setDrafting(v => !v)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="px-4 py-2 rounded-xl bg-[rgba(0,155,119,0.15)] border border-[rgba(0,155,119,0.4)] text-[#009B77] text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-[rgba(0,155,119,0.25)] transition-all">
          {drafting ? 'Cancel' : '+ New Entry'}
        </motion.button>
      </div>

      <AnimatePresence>
        {drafting && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="liquid-glass-panel rounded-2xl border border-[rgba(0,155,119,0.3)] p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-[88px] flex-shrink-0 rounded-lg overflow-hidden border border-[rgba(212,175,55,0.35)]">
                <Image src={getTarotCardImageUrl(draftCard.card)} alt={draftCard.card.name} fill className="object-fill" sizes="70px" />
              </div>
              <div>
                <div className="font-serif font-bold text-[#F5F4EC]">{draftCard.card.name}</div>
                <div className="text-[10px] font-mono text-[#AABDB7] mt-0.5">{draftCard.reversed ? '↻ Reversed' : '↑ Upright'}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(draftCard.reversed ? draftCard.card.reversedKeywords : draftCard.card.uprightKeywords).slice(0, 4).map((kw, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[rgba(0,155,119,0.15)] text-[#009B77] border border-[rgba(0,155,119,0.3)]">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
            <textarea value={draftText} onChange={e => setDraftText(e.target.value)} rows={4}
              placeholder="What resonated with you today? What patterns, emotions, or insights emerged?"
              className="w-full bg-[rgba(6,24,20,0.7)] border border-[rgba(212,175,55,0.2)] rounded-xl px-3 py-2.5 text-sm text-[#F5F4EC] placeholder-[#AABDB7]/50 resize-none outline-none focus:border-[rgba(0,155,119,0.5)] transition-colors" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDrafting(false)} className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#AABDB7] cursor-pointer hover:text-[#F5F4EC]">Cancel</button>
              <button onClick={saveEntry} className="px-4 py-1.5 rounded-lg bg-[rgba(0,155,119,0.25)] border border-[rgba(0,155,119,0.5)] text-[#009B77] text-xs font-semibold cursor-pointer hover:bg-[rgba(0,155,119,0.35)] transition-all">
                Save Reflection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <BookOpen className="w-10 h-10 text-[#AABDB7]/30 mx-auto" />
          <p className="text-sm text-[#AABDB7]">No journal entries yet. Start by adding your first reflection.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="liquid-glass-panel rounded-xl border border-[rgba(255,255,255,0.08)] p-4 flex gap-4 hover:border-[rgba(0,155,119,0.3)] transition-colors">
              <div className="relative w-12 h-[66px] flex-shrink-0 rounded-lg overflow-hidden border border-[rgba(212,175,55,0.3)]">
                <Image src={entry.cardImg} alt={entry.cardName} fill className="object-fill" sizes="50px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-serif text-sm font-bold text-[#F5F4EC] truncate">{entry.cardName}</div>
                  <button onClick={() => deleteEntry(entry.id)} className="text-[#AABDB7]/40 hover:text-red-400/70 text-xs font-mono cursor-pointer ml-2 flex-shrink-0">✕</button>
                </div>
                <div className="text-[9px] font-mono text-[#AABDB7] mt-0.5">{entry.date} · {entry.reversed ? 'Reversed' : 'Upright'}</div>
                <p className="text-xs text-[#AABDB7] mt-1.5 leading-relaxed line-clamp-2">{entry.reflection}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Feature: Card of the Moment ────────────────────────────────────────────
function CardOfTheMoment({ astrologyContext }: { astrologyContext?: FeatureHubProps['astrologyContext'] }) {
  const seed = `${getTodaySeed()}-${new Date().getHours()}`;
  const { card, reversed } = useMemo(() => pickCard(seed + (astrologyContext?.lagna || '')), []);
  const [flipped, setFlipped] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI · Planetary Card Suggestion</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Card of the Moment</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">
          {astrologyContext?.lagna
            ? `Contextually chosen for ${astrologyContext.lagna} Lagna · ${astrologyContext.moonSign || ''} Moon · ${astrologyContext.nakshatra || ''} Nakshatra`
            : 'Drawn by celestial entropy engine for this exact moment in time.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center gap-4">
          <LuxuryTarotCard card={card} orientation={reversed ? 'reversed' : 'upright'}
            isFlipped={flipped} onFlip={() => setFlipped(true)} size="hero" enable3DTilt showBackHint={!flipped} />
          {!flipped && (
            <button onClick={() => setFlipped(true)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006B5B] to-[#009B77] text-sm text-[#F5F4EC] font-semibold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,155,119,0.3)]">
              <Eye className="w-4 h-4" /> Reveal Cosmic Message
            </button>
          )}
        </div>

        {flipped && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="liquid-glass-panel rounded-2xl border border-[rgba(212,175,55,0.25)] p-5 space-y-4">
              <div className="font-serif text-xl font-bold text-[#F5F4EC]">{card.name}</div>
              <div className="flex items-center gap-2">
                {getElementIcon(card.element)}
                <span className="text-xs font-mono text-[#AABDB7]">{card.element} · {card.astrologicalAssociation}</span>
              </div>
              {astrologyContext?.lagna && (
                <div className="rounded-xl bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] p-3 text-xs text-[#F2D675] font-mono space-y-1">
                  <div className="uppercase tracking-widest text-[10px] text-[#D4AF37]/70 mb-2">Planetary Context</div>
                  {astrologyContext.lagna && <div>◆ Lagna: <span className="text-[#F5F4EC]">{astrologyContext.lagna}</span></div>}
                  {astrologyContext.moonSign && <div>◆ Moon: <span className="text-[#F5F4EC]">{astrologyContext.moonSign}</span></div>}
                  {astrologyContext.nakshatra && <div>◆ Nakshatra: <span className="text-[#F5F4EC]">{astrologyContext.nakshatra}</span></div>}
                  {astrologyContext.mahadasha && <div>◆ Mahadasha: <span className="text-[#F5F4EC]">{astrologyContext.mahadasha}</span></div>}
                </div>
              )}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-1">Cosmic Message</div>
                <p className="text-sm text-[#F5F4EC]/90 leading-relaxed">{reversed ? card.reversedMeaning : card.uprightMeaning}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#009B77] mb-1">Advice</div>
                <p className="text-sm text-[#AABDB7] leading-relaxed">{card.advice}</p>
              </div>
            </div>
            <button onClick={() => { setFlipped(false); }} className="text-xs font-mono text-[#AABDB7] hover:text-[#F2D675] flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" /> Draw Another Moment Card
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Feature: Year Ahead Spread ──────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function YearAheadSpread() {
  const [cards, setCards] = useState<Array<{ card: TarotCard; reversed: boolean; flipped: boolean }>>([]);
  const [active, setActive] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  function handleDraw() {
    setCards(pickNCards(12).map(p => ({ ...p, flipped: false })));
    setDrawn(true);
    setActive(null);
  }

  const today = new Date();
  const startMonth = today.getMonth();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] text-xs font-mono tracking-widest uppercase">
          <Calendar className="w-3.5 h-3.5" />
          <span>12-Month Year Ahead Spread</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Year Ahead Spread</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">One sacred card for each coming month of the year, revealing energies, challenges and blessings.</p>
      </div>

      {!drawn ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="grid grid-cols-6 gap-1.5 opacity-30">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-8 h-11 rounded-md border border-[rgba(212,175,55,0.3)] bg-gradient-to-br from-[#061814] to-[#0B251F]" />
            ))}
          </div>
          <motion.button onClick={handleDraw} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#6B4300] to-[#D4AF37] text-[#06140F] font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer">
            <Calendar className="w-4 h-4" />
            Unfold the Year Ahead
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cards.map((c, i) => {
              const monthIdx = (startMonth + i) % 12;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => { if (!c.flipped) setCards(prev => prev.map((x, xi) => xi === i ? { ...x, flipped: true } : x)); setActive(i); }}
                  className={`cursor-pointer liquid-glass-panel rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${active === i ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.35)]'}`}>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37]">{MONTH_NAMES[monthIdx]}</div>
                  <LuxuryTarotCard card={c.card} orientation={c.reversed ? 'reversed' : 'upright'}
                    isFlipped={c.flipped} size="sm" enable3DTilt={false} showBackHint={!c.flipped} />
                  {c.flipped && (
                    <div className="text-center space-y-0.5">
                      <div className="text-[9px] font-serif font-bold text-[#F5F4EC] truncate max-w-[100px]">{c.card.name}</div>
                      <div className={`text-[8px] font-mono ${c.reversed ? 'text-amber-400' : 'text-[#009B77]'}`}>{c.reversed ? '↻' : '↑'} {c.reversed ? 'Rev' : 'Upr'}</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {active !== null && cards[active].flipped && (
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="liquid-glass-panel rounded-2xl border border-[rgba(212,175,55,0.3)] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-mono text-[#D4AF37] font-semibold">{MONTH_NAMES[(startMonth + active) % 12]}'s Energy</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ml-auto ${cards[active].reversed ? 'border-amber-400/50 text-amber-300' : 'border-[#009B77]/50 text-[#009B77]'}`}>
                  {cards[active].reversed ? '↻ Reversed' : '↑ Upright'}
                </span>
              </div>
              <div className="font-serif text-lg font-bold text-[#F5F4EC]">{cards[active].card.name}</div>
              <p className="text-sm text-[#F5F4EC]/90 leading-relaxed">
                {cards[active].reversed ? cards[active].card.reversedMeaning : cards[active].card.uprightMeaning}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {drawn && (
        <div className="text-center">
          <button onClick={handleDraw} className="text-xs font-mono text-[#AABDB7] hover:text-[#F2D675] flex items-center gap-1 mx-auto cursor-pointer">
            <RefreshCw className="w-3 h-3" /> Re-cast Year Ahead
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Feature: Relationship Spread ───────────────────────────────────────────
const REL_POSITIONS = [
  'Their Energy', 'Your Energy', 'Their Feelings', 'Your Feelings',
  'Connection Point', 'Challenge', 'Shared Path', 'Advice', 'Outcome',
];

function RelationshipSpread() {
  const [cards, setCards] = useState<Array<{ card: TarotCard; reversed: boolean; flipped: boolean }>>([]);
  const [active, setActive] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [nameA, setNameA] = useState('You');
  const [nameB, setNameB] = useState('Partner');

  function handleDraw() {
    setCards(pickNCards(9).map(p => ({ ...p, flipped: false })));
    setDrawn(true);
    setActive(null);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(219,39,119,0.15)] border border-[rgba(219,39,119,0.4)] text-[#F472B6] text-xs font-mono tracking-widest uppercase">
          <Heart className="w-3.5 h-3.5" />
          <span>Relationship · Dual Spread</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Relationship Spread</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">Illuminating the energies, feelings, and karmic path of two souls in connection.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <input value={nameA} onChange={e => setNameA(e.target.value)} placeholder="Your name"
          className="px-3 py-2 rounded-xl bg-[rgba(6,24,20,0.7)] border border-[rgba(219,39,119,0.25)] text-[#F5F4EC] text-sm outline-none focus:border-[#F472B6] transition-colors w-40 text-center" />
        <Heart className="w-4 h-4 text-[#F472B6]" />
        <input value={nameB} onChange={e => setNameB(e.target.value)} placeholder="Their name"
          className="px-3 py-2 rounded-xl bg-[rgba(6,24,20,0.7)] border border-[rgba(219,39,119,0.25)] text-[#F5F4EC] text-sm outline-none focus:border-[#F472B6] transition-colors w-40 text-center" />
        <motion.button onClick={handleDraw} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#831843] to-[#DB2777] text-white font-semibold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(219,39,119,0.3)] cursor-pointer">
          <Heart className="w-4 h-4" /> Reveal Connection
        </motion.button>
      </div>

      {drawn && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cards.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => { if (!c.flipped) setCards(prev => prev.map((x, xi) => xi === i ? { ...x, flipped: true } : x)); setActive(i); }}
                className={`cursor-pointer liquid-glass-panel rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${active === i ? 'border-[#F472B6] shadow-[0_0_20px_rgba(219,39,119,0.2)]' : 'border-[rgba(219,39,119,0.15)] hover:border-[rgba(219,39,119,0.4)]'}`}>
                <div className="text-[9px] font-mono uppercase tracking-widest text-[#F472B6]">{REL_POSITIONS[i]}</div>
                <LuxuryTarotCard card={c.card} orientation={c.reversed ? 'reversed' : 'upright'}
                  isFlipped={c.flipped} size="sm" enable3DTilt={false} showBackHint={!c.flipped} />
                {c.flipped && <div className="text-[9px] font-serif font-bold text-[#F5F4EC] text-center truncate max-w-[100px]">{c.card.name}</div>}
              </motion.div>
            ))}
          </div>

          {active !== null && cards[active].flipped && (
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="liquid-glass-panel rounded-2xl border border-[rgba(219,39,119,0.3)] p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Heart className="w-4 h-4 text-[#F472B6]" />
                <span className="text-sm font-mono text-[#F472B6] font-semibold">{REL_POSITIONS[active]}</span>
                <span className="text-xs text-[#AABDB7]">
                  {active < 2 ? `${nameA} & ${nameB}` : active < 4 ? nameA : active < 6 ? nameB : 'Combined'}
                </span>
              </div>
              <div className="font-serif text-lg font-bold text-[#F5F4EC]">{cards[active].card.name}</div>
              <p className="text-sm text-[#F5F4EC]/90 leading-relaxed">
                {cards[active].reversed ? cards[active].card.loveMeaning : cards[active].card.loveMeaning}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Feature: Tarot Meditation ───────────────────────────────────────────────
function TarotMeditationMode() {
  const [card, setCard] = useState(() => pickCard());
  const [fullscreen, setFullscreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const breath = setInterval(() => {
      setBreathPhase(p => p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale');
    }, 4000);
    return () => clearInterval(breath);
  }, [running]);

  const breathText = { inhale: 'Breathe In...', hold: 'Hold...', exhale: 'Breathe Out...' };
  const breathScale = { inhale: 1.15, hold: 1.15, exhale: 1.0 };
  const mins = Math.floor(timer / 60).toString().padStart(2, '0');
  const secs = (timer % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(139,107,190,0.2)] border border-[rgba(139,107,190,0.5)] text-[#C4B5FD] text-xs font-mono tracking-widest uppercase">
          <Moon className="w-3.5 h-3.5" />
          <span>Immersive Meditation Mode</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Tarot Meditation</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">Deep contemplation with your chosen card, guided breathing, and inner reflection.</p>
      </div>

      <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-[#030E0C] flex flex-col items-center justify-center p-8 space-y-8' : 'flex flex-col md:flex-row items-center gap-8'}`}>
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ scale: running ? breathScale[breathPhase] : 1 }} transition={{ duration: 4, ease: 'easeInOut' }}>
            <LuxuryTarotCard card={card.card} orientation={card.reversed ? 'reversed' : 'upright'}
              isFlipped={true} size={fullscreen ? 'hero' : 'lg'} enable3DTilt={!running} />
          </motion.div>

          {running && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center space-y-1">
              <div className="font-serif text-lg text-[#F2D675]">{breathText[breathPhase]}</div>
              <div className="font-mono text-2xl font-bold text-[#F5F4EC]">{mins}:{secs}</div>
            </motion.div>
          )}
        </div>

        <div className={`${fullscreen ? 'max-w-xs w-full space-y-4' : 'flex-1 space-y-4 max-w-sm'}`}>
          <div className="liquid-glass-panel rounded-2xl border border-[rgba(139,107,190,0.3)] p-5 space-y-3">
            <div className="font-serif text-xl font-bold text-[#F5F4EC]">{card.card.name}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#C4B5FD] mb-1">Contemplation Focus</div>
            <p className="text-sm text-[#F5F4EC]/90 leading-relaxed">{card.reversed ? card.card.spiritualMeaning : card.card.spiritualMeaning}</p>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-1">Shadow to Illuminate</div>
            <p className="text-sm text-[#AABDB7] leading-relaxed">{card.card.shadow}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setRunning(r => !r)}
              className={`flex-1 px-4 py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${running ? 'border-[#F472B6] text-[#F472B6] bg-[rgba(244,114,182,0.1)]' : 'border-[#C4B5FD] text-[#C4B5FD] bg-[rgba(139,107,190,0.15)]'}`}>
              <Clock className="w-4 h-4" />
              {running ? 'Pause' : 'Begin Meditation'}
            </button>
            {running && (
              <button onClick={() => { setRunning(false); setTimer(0); }}
                className="px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-[#AABDB7] text-sm cursor-pointer hover:text-[#F5F4EC]">
                End
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCard(pickCard())}
              className="text-xs font-mono text-[#AABDB7] hover:text-[#C4B5FD] flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" /> New Card
            </button>
            <button onClick={() => setFullscreen(v => !v)}
              className="text-xs font-mono text-[#AABDB7] hover:text-[#C4B5FD] flex items-center gap-1 cursor-pointer ml-auto">
              {fullscreen ? '✕ Exit Fullscreen' : '⛶ Full Screen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Feature: Yes/No Oracle ──────────────────────────────────────────────────
function YesNoOracle() {
  const [card, setCard] = useState<{ card: TarotCard; reversed: boolean } | null>(null);
  const [question, setQuestion] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const verdict = card
    ? (card.reversed
        ? card.card.yes_no === 'Yes' ? 'Maybe' : card.card.yes_no === 'No' ? 'Maybe' : 'No'
        : card.card.yes_no)
    : null;

  const verdictStyle: Record<string, { color: string; bg: string; label: string; icon: string }> = {
    Yes: { color: 'text-emerald-300', bg: 'bg-emerald-950/60 border-emerald-400/50', label: 'Yes', icon: '✓' },
    No: { color: 'text-rose-300', bg: 'bg-rose-950/60 border-rose-400/50', label: 'No', icon: '✕' },
    Maybe: { color: 'text-amber-300', bg: 'bg-amber-950/60 border-amber-400/50', label: 'Perhaps...', icon: '?' },
  };

  async function handleAsk() {
    if (!question.trim()) return;
    setDrawing(true);
    setFlipped(false);
    setCard(null);
    await new Promise(r => setTimeout(r, 800));
    setCard(pickCard());
    setDrawing(false);
    setTimeout(() => setFlipped(true), 200);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] text-xs font-mono tracking-widest uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Yes / No Instant Oracle</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F4EC] mt-2">Ask the Oracle</h2>
        <p className="text-sm text-[#AABDB7] max-w-md mx-auto">One decisive card. One clear answer. Ask your yes-or-no question with open heart.</p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="relative">
          <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AABDB7]" />
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask your yes/no question..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(6,24,20,0.8)] border border-[rgba(212,175,55,0.25)] text-[#F5F4EC] text-sm outline-none focus:border-[rgba(212,175,55,0.55)] transition-colors placeholder-[#AABDB7]/50"
          />
        </div>
        <motion.button onClick={handleAsk} disabled={drawing || !question.trim()}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#006B5B] to-[#009B77] text-[#F5F4EC] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,155,119,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {drawing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Drawing...</> : <><Sparkles className="w-4 h-4 text-[#F2D675]" /> Ask the Oracle</>}
        </motion.button>
      </div>

      {card && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 justify-center">
          <div className="flex flex-col items-center gap-3">
            <LuxuryTarotCard card={card.card} orientation={card.reversed ? 'reversed' : 'upright'}
              isFlipped={flipped} size="lg" enable3DTilt />

            {flipped && verdict && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                className={`px-6 py-2.5 rounded-xl border ${verdictStyle[verdict].bg} text-2xl font-serif font-bold ${verdictStyle[verdict].color} shadow-lg`}>
                {verdictStyle[verdict].icon} {verdictStyle[verdict].label}
              </motion.div>
            )}
          </div>

          {flipped && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="liquid-glass-panel rounded-2xl border border-[rgba(212,175,55,0.25)] p-5 space-y-3 max-w-xs">
              <div className="font-serif text-lg font-bold text-[#F5F4EC]">{card.card.name}</div>
              <div className="text-xs text-[#AABDB7] italic">"{question}"</div>
              <p className="text-sm text-[#F5F4EC]/90 leading-relaxed">
                {card.reversed ? card.card.reversedMeaning : card.card.uprightMeaning}
              </p>
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Advice</div>
              <p className="text-xs text-[#AABDB7] leading-relaxed">{card.card.advice}</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Master Feature Hub ───────────────────────────────────────────────────────
// Feature metadata with vivid, distinct color identities
const FEATURES: Array<{
  id: FeatureId;
  label: string;
  icon: React.ReactNode;
  tagline: string;
  // gradient for the card background
  gradient: string;
  // glow / shadow color
  glow: string;
  // border color
  border: string;
  // text color for label
  labelColor: string;
  // accent badge color
  badge: string;
  // number for display
  num: string;
}> = [
  {
    // 01 · Deep Ocean Navy
    id: 'daily',
    label: 'Daily Card',
    icon: <Sun className="w-8 h-8" />,
    tagline: 'One card every day',
    gradient: 'linear-gradient(145deg, #020818 0%, #061A40 45%, #0A2560 100%)',
    glow: 'rgba(30,100,220,0.6)',
    border: 'rgba(56,132,255,0.75)',
    labelColor: '#6EB4FF',
    badge: 'bg-[rgba(56,132,255,0.2)] text-[#6EB4FF] border-[rgba(56,132,255,0.6)]',
    num: '01',
  },
  {
    // 02 · Electric Cobalt
    id: 'celtic',
    label: 'Celtic Cross',
    icon: <Star className="w-8 h-8" />,
    tagline: '10-card deep spread',
    gradient: 'linear-gradient(145deg, #030D22 0%, #0C2A6E 45%, #1040A8 100%)',
    glow: 'rgba(64,140,255,0.65)',
    border: 'rgba(96,168,255,0.8)',
    labelColor: '#91C2FF',
    badge: 'bg-[rgba(96,168,255,0.2)] text-[#91C2FF] border-[rgba(96,168,255,0.65)]',
    num: '02',
  },
  {
    // 03 · Icy Cyan
    id: 'journal',
    label: 'Journal',
    icon: <BookOpen className="w-8 h-8" />,
    tagline: 'Track reflections',
    gradient: 'linear-gradient(145deg, #021418 0%, #053848 45%, #0A5868 100%)',
    glow: 'rgba(34,211,238,0.55)',
    border: 'rgba(34,211,238,0.75)',
    labelColor: '#67E8F9',
    badge: 'bg-[rgba(34,211,238,0.18)] text-[#67E8F9] border-[rgba(34,211,238,0.6)]',
    num: '03',
  },
  {
    // 04 · Liquid Aqua
    id: 'moment',
    label: 'Card of Moment',
    icon: <Sparkles className="w-8 h-8" />,
    tagline: 'AI planetary pick',
    gradient: 'linear-gradient(145deg, #011520 0%, #023D5A 45%, #045C7A 100%)',
    glow: 'rgba(14,165,233,0.6)',
    border: 'rgba(56,189,248,0.78)',
    labelColor: '#7DD3FC',
    badge: 'bg-[rgba(56,189,248,0.2)] text-[#7DD3FC] border-[rgba(56,189,248,0.65)]',
    num: '04',
  },
  {
    // 05 · Royal Sapphire
    id: 'year',
    label: 'Year Ahead',
    icon: <Calendar className="w-8 h-8" />,
    tagline: '12 months spread',
    gradient: 'linear-gradient(145deg, #020A28 0%, #07205C 45%, #0D3490 100%)',
    glow: 'rgba(99,102,241,0.6)',
    border: 'rgba(129,140,248,0.78)',
    labelColor: '#A5B4FC',
    badge: 'bg-[rgba(129,140,248,0.2)] text-[#A5B4FC] border-[rgba(129,140,248,0.65)]',
    num: '05',
  },
  {
    // 06 · Glacier Periwinkle
    id: 'relationship',
    label: 'Relationship',
    icon: <Heart className="w-8 h-8" />,
    tagline: 'Dual soul spread',
    gradient: 'linear-gradient(145deg, #04101E 0%, #0C2848 45%, #183870 100%)',
    glow: 'rgba(147,197,253,0.55)',
    border: 'rgba(147,197,253,0.75)',
    labelColor: '#BAD6FF',
    badge: 'bg-[rgba(147,197,253,0.18)] text-[#BAD6FF] border-[rgba(147,197,253,0.6)]',
    num: '06',
  },
  {
    // 07 · Midnight Indigo-Blue
    id: 'meditation',
    label: 'Meditation',
    icon: <Moon className="w-8 h-8" />,
    tagline: 'Immersive mode',
    gradient: 'linear-gradient(145deg, #010510 0%, #060D30 45%, #0C1855 100%)',
    glow: 'rgba(79,70,229,0.6)',
    border: 'rgba(99,102,241,0.75)',
    labelColor: '#C7D2FE',
    badge: 'bg-[rgba(99,102,241,0.2)] text-[#C7D2FE] border-[rgba(99,102,241,0.6)]',
    num: '07',
  },
  {
    // 08 · Steel-Blue Arctic
    id: 'yesno',
    label: 'Yes / No Oracle',
    icon: <HelpCircle className="w-8 h-8" />,
    tagline: 'Instant answer',
    gradient: 'linear-gradient(145deg, #021018 0%, #062840 45%, #0C4060 100%)',
    glow: 'rgba(125,211,252,0.55)',
    border: 'rgba(125,211,252,0.75)',
    labelColor: '#BAE6FD',
    badge: 'bg-[rgba(125,211,252,0.2)] text-[#BAE6FD] border-[rgba(125,211,252,0.6)]',
    num: '08',
  },
];

export function TarotFeatureHub({ astrologyContext }: FeatureHubProps) {
  const [active, setActive] = useState<FeatureId | null>(null);

  return (
    <div className="space-y-6">
      {/* ── Feature Grid ─────────────────────────────────────── */}
      {!active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, rgba(14,120,220,0.25), rgba(34,211,238,0.2))', border: '1px solid rgba(56,189,248,0.5)', boxShadow: '0 0 24px rgba(30,100,220,0.3)' }}>
              <Sparkles className="w-3.5 h-3.5 text-[#67E8F9]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7DD3FC]">8 Sacred Practices</span>
              <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F4EC] tracking-tight">
              ✦ Tarot Feature Sanctuary
            </h2>
            <p className="text-sm text-[#AABDB7] max-w-md mx-auto leading-relaxed">
              Choose your sacred practice — from daily draws and deep spreads<br className="hidden sm:block" /> to meditation, relationship readings and instant oracles.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.button
                key={f.id}
                onClick={() => setActive(f.id)}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: f.gradient,
                  boxShadow: `0 0 0 1px ${f.border}, 0 8px 32px ${f.glow}`,
                }}
                className="relative rounded-2xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer overflow-hidden transition-all group"
              >
                {/* Subtle top shine */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${f.glow.replace('0.55', '0.25')} 0%, transparent 70%)` }} />

                {/* Number badge top-left */}
                <span
                  className={`absolute top-2.5 left-3 text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${f.badge}`}>
                  {f.num}
                </span>

                {/* Icon with glow */}
                <div style={{ color: f.labelColor, filter: `drop-shadow(0 0 8px ${f.glow})` }}
                  className="mt-2 transition-transform duration-300 group-hover:scale-110">
                  {f.icon}
                </div>

                {/* Label */}
                <div className="font-serif font-bold text-sm leading-tight" style={{ color: f.labelColor }}>
                  {f.label}
                </div>

                {/* Tagline */}
                <div className="text-[10px] text-[#AABDB7]/80 font-mono leading-tight">{f.tagline}</div>

                {/* Bottom arrow */}
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: f.labelColor }}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Active Feature View ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="space-y-6">
            {/* Back nav */}
            <button onClick={() => setActive(null)}
              className="flex items-center gap-1.5 text-xs font-mono text-[#AABDB7] hover:text-[#F5F4EC] cursor-pointer transition-colors group">
              <ChevronRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              Back to Feature Sanctuary
            </button>

            {active === 'daily' && <DailyCardDraw />}
            {active === 'celtic' && <CelticCrossSpread />}
            {active === 'journal' && <TarotJournal />}
            {active === 'moment' && <CardOfTheMoment astrologyContext={astrologyContext} />}
            {active === 'year' && <YearAheadSpread />}
            {active === 'relationship' && <RelationshipSpread />}
            {active === 'meditation' && <TarotMeditationMode />}
            {active === 'yesno' && <YesNoOracle />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
