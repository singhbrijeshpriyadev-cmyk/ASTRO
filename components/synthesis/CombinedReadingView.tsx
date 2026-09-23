import React, { useState } from 'react';
import Image from 'next/image';
import { ChartData } from '@/types/astrology';
import { TarotReadingSnapshot } from '@/lib/tarot/types';
import { drawSpread, loadReadingHistory } from '@/lib/tarot/engine';
import { generateAstroTarotSynthesis } from '@/lib/synthesis/astro-tarot-engine';
import { CombinedAnalysis } from '@/lib/synthesis/types';
import { getTarotCardImageUrl } from '@/lib/tarot/cards';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  ArrowRightLeft, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  RotateCw,
  Award,
  Layers
} from 'lucide-react';

interface CombinedReadingViewProps {
  chart: ChartData;
  birthDate?: string;
  initialSnapshot?: TarotReadingSnapshot | null;
}

export function CombinedReadingView({ chart, birthDate = '1995-10-24T08:30:00Z', initialSnapshot }: CombinedReadingViewProps) {
  const [snapshot, setSnapshot] = useState<TarotReadingSnapshot>(() => {
    if (initialSnapshot) return initialSnapshot;
    const history = loadReadingHistory();
    if (history.length > 0) return history[0];
    return drawSpread('three_card', 'What highest trajectory guides my vocational and inner evolution?');
  });

  const [inquiryText, setInquiryText] = useState<string>(snapshot.userQuestion || 'What highest trajectory guides my vocational and inner evolution?');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const bDate = new Date(birthDate);

  const synthesis: CombinedAnalysis = React.useMemo(() => {
    return generateAstroTarotSynthesis({
      chart,
      tarotSnapshot: snapshot,
      birthDate: new Date(birthDate),
      userQuestion: inquiryText,
    });
  }, [chart, snapshot, birthDate, inquiryText]);

  const handleFreshDraw = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const newSnap = drawSpread(snapshot.spreadId || 'three_card', inquiryText);
      setSnapshot(newSnap);
      setIsSynthesizing(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#F5F4EC]">
      {/* Header & Philosophical Orientation */}
      <div className="liquid-glass-panel border border-[rgba(212,175,55,0.30)] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-mono tracking-widest uppercase mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#F2D675]" />
            Harmonic Macrocosm & Microcosm
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F5F4EC] tracking-wide">
            Combined Astrology + Tarot Synthesis
          </h2>
          <p className="text-xs text-[#AABDB7] mt-0.5">
            Converging deterministic astronomical mechanics with synchronistic archetypal inquiry. Divination is an interpretive lens, not fatal certainty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFreshDraw}
            disabled={isSynthesizing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D4AF37] bg-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.25)] text-xs font-mono text-[#F2D675] transition-colors font-semibold shadow-md cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            {isSynthesizing ? 'Calculating...' : 'Recalibrate Synthesis'}
          </button>
        </div>
      </div>

      {/* Epistemic Demarcation Banner */}
      <div className="liquid-glass-card border border-[rgba(212,175,55,0.20)] rounded-xl p-3.5 flex items-start gap-3 text-xs bg-[rgba(7,26,21,0.65)]">
        <ShieldAlert className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">
            Methodological Demarcation
          </span>
          <p className="text-[11px] text-[#AABDB7] leading-relaxed">
            {synthesis.epistemicDemarcation.statement}
          </p>
        </div>
      </div>

      {/* Synthesis Master Theme Card */}
      <div className="liquid-glass-card border border-[rgba(212,175,55,0.35)] rounded-2xl p-6 shadow-2xl space-y-2 bg-[rgba(5,20,16,0.85)]">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#F2D675]" />
          Master Convergent Theme
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#F5F4EC]">
          {synthesis.overallTheme}
        </h3>
        <p className="text-xs text-[#AABDB7] italic">
          Inquiry: &quot;{synthesis.userQuestion}&quot;
        </p>
      </div>

      {/* Synchronistic Tarot Array Visuals */}
      <div className="liquid-glass-panel border border-[rgba(212,175,55,0.25)] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="font-serif text-base font-bold text-[#F5F4EC]">
              Synchronistic Oracle Array ({snapshot.spreadName})
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#F2D675] px-2 py-0.5 rounded bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)]">
            {snapshot.cards.length} Archetypes In Play
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          {snapshot.cards.map((c, idx) => (
            <div
              key={idx}
              className="liquid-glass-card border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 flex flex-col justify-between text-center space-y-2 shadow-md hover:border-[rgba(212,175,55,0.45)] transition-all bg-[rgba(4,20,17,0.6)]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-[#AABDB7] truncate max-w-[70%] text-left">
                    {c.positionName.split('(')[0]}
                  </span>
                  {c.isReversed ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold text-[8.5px]">
                      REV
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-[#009B77]/20 text-[#009B77] border border-[#009B77]/40 text-[8.5px]">
                      UP
                    </span>
                  )}
                </div>

                <div className="w-full aspect-[2/3] rounded-lg border border-[rgba(212,175,55,0.30)] bg-black/80 overflow-hidden relative shadow-inner">
                  <Image
                    src={getTarotCardImageUrl(c.card)}
                    alt={c.card.name}
                    fill
                    className={`object-cover transition-transform duration-300 ${c.isReversed ? 'rotate-180' : ''}`}
                    sizes="120px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-1.5 pt-3 pointer-events-none">
                    <span className="font-serif text-[11px] font-bold text-[#F5F4EC] block truncate">
                      {c.card.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#D4AF37] truncate font-medium">
                {c.card.astrologicalAssociation.split('/')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Pillar Comparison: Astrological vs Tarot Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Astrological Determinants */}
        <div className="bg-vedic-surface/70 border border-cyan-500/20 rounded-lg p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h4 className="font-serif text-sm font-bold text-vedic-text">
                Astrological Factors (Macrocosm)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">CALCULATED FACTS</span>
          </div>

          <ul className="space-y-2 text-xs">
            {synthesis.astrologicalFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-vedic-text/90">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tarot Synchronistic Factors */}
        <div className="bg-vedic-surface/70 border border-vedic-gold/25 rounded-lg p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-vedic-gold/15">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-vedic-gold" />
              <h4 className="font-serif text-sm font-bold text-vedic-text">
                Tarot Factors (Microcosm)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-vedic-gold">SYNCHRONISTIC KEYS</span>
          </div>

          <ul className="space-y-2 text-xs">
            {synthesis.tarotFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-vedic-text/90">
                <span className="text-vedic-gold mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Converging Themes (Where systems agree) */}
      <div className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-vedic-gold/15">
          <div>
            <h4 className="font-serif text-base font-bold text-vedic-text">
              Converging Themes & Resonances
            </h4>
            <p className="text-xs text-vedic-muted">
              Where celestial positions and drawn archetypes reinforce each other.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            {synthesis.convergingThemes.length} Convergences
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {synthesis.convergingThemes.map((thm, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-vedic-bg/80 border border-vedic-gold/20 space-y-2.5 shadow-md"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-serif font-bold text-sm text-vedic-gold">{thm.theme}</span>
              </div>

              <div className="space-y-1.5 text-xs text-vedic-muted">
                <div className="bg-vedic-surface/60 rounded p-2 border border-vedic-gold/10">
                  <span className="text-[9px] font-mono text-cyan-300 uppercase block">ASTRO EVIDENCE</span>
                  <span className="text-[11px] text-vedic-text">{thm.astroEvidence}</span>
                </div>
                <div className="bg-vedic-surface/60 rounded p-2 border border-vedic-gold/10">
                  <span className="text-[9px] font-mono text-vedic-gold uppercase block">TAROT EVIDENCE</span>
                  <span className="text-[11px] text-vedic-text">{thm.tarotEvidence}</span>
                </div>
              </div>

              <p className="text-xs text-vedic-text leading-relaxed pt-1 border-t border-vedic-gold/10">
                {thm.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Differing Signals (Where systems contrast) */}
      {synthesis.differentSignals.length > 0 && (
        <div className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-vedic-gold/15">
            <div>
              <h4 className="font-serif text-base font-bold text-vedic-text">
                Contrasting Signals & Creative Friction
              </h4>
              <p className="text-xs text-vedic-muted">
                Divergences between outward astrological cycles and internal psychological mirrors.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
              {synthesis.differentSignals.length} Dialectics
            </span>
          </div>

          <div className="space-y-3">
            {synthesis.differentSignals.map((sig, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-vedic-bg/80 border border-vedic-gold/20 space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-vedic-text">{sig.dimension}</span>
                  <span className="text-[10px] font-mono text-vedic-muted">Creative Tension</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-vedic-surface/60 rounded p-2 border border-vedic-gold/10">
                    <span className="text-[9px] font-mono text-cyan-300 uppercase block">ASTRO INDICATION</span>
                    <span className="text-[11px] text-vedic-muted">{sig.astroIndication}</span>
                  </div>
                  <div className="bg-vedic-surface/60 rounded p-2 border border-vedic-gold/10">
                    <span className="text-[9px] font-mono text-vedic-gold uppercase block">TAROT INDICATION</span>
                    <span className="text-[11px] text-vedic-muted">{sig.tarotIndication}</span>
                  </div>
                </div>

                <div className="bg-vedic-surface/90 rounded p-2.5 border border-vedic-gold/20 text-xs">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase block">SYNTHESIS & RESOLUTION</span>
                  <p className="text-[11px] text-vedic-text leading-relaxed">{sig.synthesis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Reflections & Questions for Inquiry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Practical Reflection */}
        <div className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 pb-2 border-b border-vedic-gold/15">
            <Award className="w-4 h-4 text-vedic-gold" />
            <h4 className="font-serif text-sm font-bold text-vedic-text">
              Practical Actionable Reflection
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-vedic-text/90">
            {synthesis.practicalReflection.map((pr, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-vedic-gold mt-0.5">•</span>
                <span className="leading-relaxed">{pr}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions for Reflection */}
        <div className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 pb-2 border-b border-vedic-gold/15">
            <HelpCircle className="w-4 h-4 text-vedic-gold" />
            <h4 className="font-serif text-sm font-bold text-vedic-text">
              Contemplative Questions for the Soul
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-vedic-text/90">
            {synthesis.questionsForReflection.map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-vedic-gold mt-0.5">?</span>
                <span className="leading-relaxed italic">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
