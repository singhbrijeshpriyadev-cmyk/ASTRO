'use client';

import React from 'react';
import { TarotTopic } from '@/lib/tarot/types';
import { TOPIC_METADATA } from '@/lib/tarot/interpretation-engine';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  History, 
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface TarotHomeStepProps {
  onStartReading: (topic: TarotTopic) => void;
  onOpenHistory: () => void;
  onOpenCompendium: () => void;
}

export function TarotHomeStep({
  onStartReading,
  onOpenHistory,
  onOpenCompendium,
}: TarotHomeStepProps) {
  const [selectedTopic, setSelectedTopic] = React.useState<TarotTopic>('general');

  const topicsList: TarotTopic[] = [
    'general',
    'love',
    'career',
    'education',
    'finance',
    'family',
    'growth',
    'spirituality',
    'decision',
    'yes_no',
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Mystical Header Banner */}
      <div className="liquid-glass-card p-8 sm:p-10 rounded-2xl relative overflow-hidden text-center border border-[rgba(212,175,55,0.30)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Subtle background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(0,155,119,0.18)_0%,rgba(139,107,190,0.12)_50%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#F2D675]" />
            TAROT OBSERVATORY • 78 ARCHETYPES
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F4EC] tracking-tight">
            Your Cards. Your Reflection.
          </h1>

          <p className="text-sm sm:text-base text-[#AABDB7] max-w-2xl mx-auto leading-relaxed font-sans">
            A deterministic, cryptographically randomized 78-card oracle designed for introspection, clarity, and philosophical inquiry—bridging ancient archetypes with modern consciousness.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs text-[#AABDB7] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009B77]" />
              True Cryptographic Entropy
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Strict Sampling Without Replacement
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#8B6BBE]" />
              Non-Fatalistic Guidance
            </span>
          </div>
        </div>
      </div>

      {/* Main Reading Selection Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Spread: Three-Card Spread (Active & Featured) */}
        <div className="md:col-span-2 liquid-glass-panel p-6 sm:p-8 rounded-2xl border border-[rgba(212,175,55,0.40)] relative flex flex-col justify-between shadow-lg">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] px-2.5 py-1 rounded bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.25)]">
                Default Observatory Reading
              </span>
              <span className="text-xs font-mono text-[#AABDB7]">3 Cards • 78-Card Deck</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#F5F4EC]">
                Three-Card Oracle: Past • Present • Future
              </h2>
              <p className="text-xs sm:text-sm text-[#AABDB7] mt-1.5 leading-relaxed">
                Traces the causal trajectory of your inquiry: the foundational impetus of the past, the immediate crucible of the present, and the evolving direction of the future.
              </p>
            </div>

            {/* Quick Topic Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-[#AABDB7] tracking-wider flex items-center justify-between">
                <span>Select Your Inquiry Focus</span>
                <span className="text-[10px] text-[#D4AF37] font-semibold">10 Classical Domains</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {topicsList.map(t => {
                  const meta = TOPIC_METADATA[t];
                  const isSelected = selectedTopic === t;
                  
                  // Topic icon mappings
                  let TopicIcon = Sparkles;
                  if (t === 'love') TopicIcon = Compass;
                  else if (t === 'career') TopicIcon = Layers;
                  else if (t === 'finance') TopicIcon = ShieldCheck;
                  else if (t === 'spirituality') TopicIcon = Sparkles;
                  else if (t === 'decision') TopicIcon = ArrowRight;
                  else if (t === 'growth') TopicIcon = CheckCircle2;

                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`p-2.5 rounded-xl text-xs font-sans text-left transition-all duration-200 border relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'bg-[rgba(212,175,55,0.18)] border-[#D4AF37] text-[#F5F4EC] shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                          : 'bg-[rgba(7,26,21,0.6)] border-[rgba(255,255,255,0.08)] text-[#AABDB7] hover:border-[rgba(212,175,55,0.35)] hover:text-[#F5F4EC] hover:bg-[rgba(11,33,27,0.7)]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#D4AF37]/30 to-transparent pointer-events-none rounded-tr-xl" />
                      )}
                      <div className="flex items-center gap-1.5 mb-1">
                        <TopicIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F2D675]' : 'text-[#AABDB7] group-hover:text-[#D4AF37]'}`} />
                        <span className="font-semibold truncate text-[11.5px]">{meta.label.split(' ')[0]}</span>
                      </div>
                      <div className="text-[10px] text-[#AABDB7] group-hover:text-[#F5F4EC] truncate font-mono uppercase tracking-wider">
                        {t}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Card Fan Preview */}
          <div className="pt-4 my-2 flex items-center justify-center gap-3 select-none pointer-events-none">
            {[-8, 0, 8].map((deg, idx) => (
              <div
                key={idx}
                style={{ transform: `rotate(${deg}deg) translateY(${Math.abs(deg) * 0.8}px)` }}
                className="w-16 h-24 rounded-lg border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[#0B211B] via-[#102A23] to-[#061411] shadow-lg flex flex-col items-center justify-between p-1.5 transition-transform duration-300"
              >
                <span className="text-[7px] font-mono text-[#D4AF37]/60">KAALIKA</span>
                <div className="w-5 h-5 rounded-full border border-[rgba(212,175,55,0.4)] flex items-center justify-center text-[#F2D675] text-[8px]">
                  ✦
                </div>
                <span className="text-[7px] font-mono text-[#D4AF37]/60">
                  {idx === 0 ? 'PAST' : idx === 1 ? 'PRESENT' : 'FUTURE'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <div className="text-xs text-[#AABDB7] font-mono">
              Inquiry: <span className="text-[#F2D675] font-semibold">{TOPIC_METADATA[selectedTopic].label}</span>
            </div>
            <button
              onClick={() => onStartReading(selectedTopic)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006B5B] to-[#009B77] hover:from-[#007D69] hover:to-[#00B388] text-[#F5F4EC] font-sans font-semibold text-sm shadow-[0_0_20px_rgba(0,155,119,0.35)] border border-[#009B77] flex items-center gap-2 transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-[#F2D675]" />
              <span>Draw 3 Cards Oracle</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Side Column: Archives & Compendium */}
        <div className="space-y-4 flex flex-col">
          {/* Compendium Card */}
          <div className="liquid-glass-card p-5 rounded-2xl border border-[rgba(255,255,255,0.10)] flex-1 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[#D4AF37] mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F4EC]">
                78-Card Compendium
              </h3>
              <p className="text-xs text-[#AABDB7] mt-1 leading-relaxed">
                Explore the complete encyclopedia of 22 Major Arcana and 56 Minor Arcana with elemental, astrological, and psychological keys.
              </p>
            </div>
            <button
              onClick={onOpenCompendium}
              className="mt-4 w-full py-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] hover:border-[rgba(212,175,55,0.30)] text-xs text-[#AABDB7] hover:text-[#F5F4EC] font-sans transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Compendium</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>

          {/* Reading History Card */}
          <div className="liquid-glass-card p-5 rounded-2xl border border-[rgba(255,255,255,0.10)] flex-1 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[rgba(139,107,190,0.15)] border border-[rgba(139,107,190,0.35)] flex items-center justify-center text-[#A78BFA] mb-3">
                <History className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F5F4EC]">
                Reading Sanctuary
              </h3>
              <p className="text-xs text-[#AABDB7] mt-1 leading-relaxed">
                Review your saved readings, explore evolving patterns across readings, and track reflection themes over time.
              </p>
            </div>
            <button
              onClick={onOpenHistory}
              className="mt-4 w-full py-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] hover:border-[rgba(139,107,190,0.35)] text-xs text-[#AABDB7] hover:text-[#F5F4EC] font-sans transition-all flex items-center justify-center gap-1.5"
            >
              <span>Past Readings Archive</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A78BFA]" />
            </button>
          </div>
        </div>
      </div>

      {/* Future Spreads Architecture Showcase */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-[#AABDB7] tracking-widest">
          Observatory Spread Architecture (Future Modules)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'One-Card Oracle', count: '1 Card', desc: 'Daily Focus & Essence' },
            { name: 'Love & Union Spread', count: '5 Cards', desc: 'Relational Resonance' },
            { name: 'Career Crossroads', count: '5 Cards', desc: 'Vocational Trajectory' },
            { name: 'Celtic Cross', count: '10 Cards', desc: 'Master Archetypal Map' },
          ].map(s => (
            <div
              key={s.name}
              className="liquid-glass-card p-3.5 rounded-xl border border-[rgba(255,255,255,0.05)] opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37]">
                <span>{s.count}</span>
                <Lock className="w-3 h-3 text-[#AABDB7]" />
              </div>
              <div className="text-xs font-serif font-bold text-[#F5F4EC] mt-1">{s.name}</div>
              <div className="text-[10px] text-[#AABDB7] mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
