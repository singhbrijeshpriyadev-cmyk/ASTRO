'use client';

import React, { useState } from 'react';
import { TarotTopic } from '@/lib/tarot/types';
import { TOPIC_METADATA } from '@/lib/tarot/interpretation-engine';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Compass, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface QuestionStepProps {
  initialTopic: TarotTopic;
  initialQuestion?: string;
  birthProfileName?: string;
  astrologyContext?: {
    lagna?: string;
    moonSign?: string;
    nakshatra?: string;
    mahadasha?: string;
  };
  onSubmit: (data: { question: string; topic: TarotTopic; connectAstrology: boolean }) => void;
  onBack: () => void;
}

const MAX_QUESTION_CHARS = 500;

export function QuestionStep({
  initialTopic,
  initialQuestion = '',
  birthProfileName,
  astrologyContext,
  onSubmit,
  onBack,
}: QuestionStepProps) {
  const [topic, setTopic] = useState<TarotTopic>(initialTopic);
  const [question, setQuestion] = useState<string>(initialQuestion);
  const [connectAstrology, setConnectAstrology] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const sampleQuestions: Record<TarotTopic, string[]> = {
    general: [
      'What underlying energetic current is currently shaping my personal journey?',
      'What wisdom do the cards offer for my present phase of life?',
    ],
    love: [
      'What emotional pattern is asking to be recognized in my relationships?',
      'How can I deepen authenticity and vulnerability with my partner?',
    ],
    career: [
      'What should I prioritize right now to align with my vocational calling?',
      'What hidden variable or friction requires strategic patience in my career?',
    ],
    education: [
      'How can I best overcome current study blocks and absorb knowledge deeply?',
      'What mindset will support my upcoming examination or intellectual project?',
    ],
    finance: [
      'What relationship with material resources is ripening for conscious mastery?',
      'Where should I practice financial prudence versus calculated initiative?',
    ],
    family: [
      'How can I best support harmony and clear boundaries in my family sphere?',
      'What ancestral lesson or pattern is ready to be understood and healed?',
    ],
    growth: [
      'What unintegrated habit or shadow tendency is ready to transform into strength?',
      'How can I cultivate resilient inner peace amidst outer demands?',
    ],
    spirituality: [
      'What spiritual lesson is being mirrored by my current life circumstances?',
      'How can I align my daily actions more closely with my higher dharmic values?',
    ],
    decision: [
      'What essential truth should guide my perspective at this current crossroad?',
      'What unintended consequences or blessings lie hidden in this choice?',
    ],
    yes_no: [
      'Is the energy supportive of moving forward with this new venture right now?',
      'Does current momentum favor decisive action or waiting for further clarity?',
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = question.trim();
    if (!trimmed) {
      setValidationError('Please enter a question or intention for the cards.');
      return;
    }
    if (trimmed.length > MAX_QUESTION_CHARS) {
      setValidationError(`Question exceeds the maximum limit of ${MAX_QUESTION_CHARS} characters.`);
      return;
    }

    setValidationError(null);
    onSubmit({
      question: trimmed,
      topic,
      connectAstrology,
    });
  };

  const handlePickSample = (sample: string) => {
    setQuestion(sample);
    setValidationError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-mono text-[#AABDB7] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary</span>
        </button>
        <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
          Step 1 of 3: Inquiry Formulation
        </span>
      </div>

      <div className="liquid-glass-card p-6 sm:p-8 rounded-2xl border border-[rgba(212,175,55,0.30)] space-y-6 shadow-xl">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#F5F4EC]">
            What would you like guidance on?
          </h2>
          <p className="text-xs text-[#AABDB7] font-sans">
            Formulate an open-ended question. The cards do not fix destiny; they mirror the currents of consciousness.
          </p>
        </div>

        {/* Topic Selector Chips */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-[#AABDB7] tracking-wider block">
            Focus Domain / Topic:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {topicsList.map(t => {
              const meta = TOPIC_METADATA[t];
              const isSelected = topic === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTopic(t);
                    setValidationError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all border ${
                    isSelected
                      ? 'bg-[rgba(212,175,55,0.22)] border-[#D4AF37] text-[#F2D675] shadow-sm font-semibold'
                      : 'bg-[rgba(11,33,27,0.5)] border-[rgba(255,255,255,0.08)] text-[#AABDB7] hover:border-[rgba(212,175,55,0.25)] hover:text-[#F5F4EC]'
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#AABDB7] mt-1 italic">
            {TOPIC_METADATA[topic].description}
          </p>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="tarot-question-input" className="text-xs font-mono uppercase text-[#AABDB7] tracking-wider">
                Your Question / Contemplation:
              </label>
              <span
                className={`text-[11px] font-mono ${
                  question.length > MAX_QUESTION_CHARS ? 'text-red-400' : 'text-[#AABDB7]'
                }`}
              >
                {question.length} / {MAX_QUESTION_CHARS}
              </span>
            </div>

            <textarea
              id="tarot-question-input"
              rows={3}
              value={question}
              onChange={e => {
                setQuestion(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={`e.g. ${sampleQuestions[topic][0]}`}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(6,20,17,0.7)] border border-[rgba(255,255,255,0.12)] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-[#F5F4EC] text-sm font-sans placeholder-[#AABDB7]/60 transition-all resize-none shadow-inner"
            />

            {validationError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-sans mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Sample Questions helper */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#AABDB7] flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#D4AF37]" />
              Suggested contemplative inquiries for {TOPIC_METADATA[topic].label}:
            </span>
            <div className="flex flex-col gap-1">
              {sampleQuestions[topic].map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickSample(q)}
                  className="text-left text-xs text-[#AABDB7] hover:text-[#F2D675] hover:bg-[rgba(212,175,55,0.06)] px-2.5 py-1.5 rounded-lg border border-transparent hover:border-[rgba(212,175,55,0.15)] transition-all font-sans"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Optional Astrology Integration Toggle */}
          {astrologyContext && (
            <div className="p-3.5 rounded-xl bg-[rgba(139,107,190,0.08)] border border-[rgba(139,107,190,0.25)] flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#F5F4EC]">
                  <Compass className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Connect Vedic Astrological Horizon</span>
                </div>
                <p className="text-[11px] text-[#AABDB7] font-sans">
                  Weave birth blueprint ({birthProfileName || 'Querent'}) — {astrologyContext.lagna} Lagna, {astrologyContext.mahadasha} Dasha — as subtle contextual nuance without biasing card randomness.
                </p>
              </div>
              <input
                type="checkbox"
                checked={connectAstrology}
                onChange={e => setConnectAstrology(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#8B6BBE] text-[#8B6BBE] focus:ring-[#8B6BBE] bg-[#061411]"
              />
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#006B5B] to-[#009B77] hover:from-[#007D69] hover:to-[#00B388] text-[#F5F4EC] font-sans font-semibold text-sm shadow-[0_0_25px_rgba(0,155,119,0.35)] border border-[#009B77] flex items-center justify-center gap-2 transition-all group"
            >
              <span>Prepare Deck & Shuffle</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
