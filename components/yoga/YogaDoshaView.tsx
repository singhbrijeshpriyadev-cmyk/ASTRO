'use client';

import React, { useState } from 'react';
import { ChartData } from '@/types/astrology';
import { evaluateAllYogas } from '@/lib/yoga/evaluators';
import { evaluateAllDoshas } from '@/lib/dosha/evaluators';
import { DetectedYoga } from '@/lib/yoga/types';
import { DetectedDosha } from '@/lib/dosha/types';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  BookOpen, 
  Award,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface YogaDoshaViewProps {
  chart: ChartData;
}

export function YogaDoshaView({ chart }: YogaDoshaViewProps) {
  const [activeTab, setActiveTab] = useState<'yogas' | 'doshas'>('yogas');
  const [selectedYogaId, setSelectedYogaId] = useState<string | null>(null);
  const [selectedDoshaId, setSelectedDoshaId] = useState<string | null>(null);

  const detectedYogas = React.useMemo(() => evaluateAllYogas({
    planets: chart.planets,
    ascendantSignIndex: chart.ascendant.signIndex,
    houses: chart.houses,
  }), [chart]);

  const detectedDoshas = React.useMemo(() => evaluateAllDoshas({
    planets: chart.planets,
    ascendantSignIndex: chart.ascendant.signIndex,
    houses: chart.houses,
  }), [chart]);

  return (
    <div className="space-y-6 animate-fade-in text-vedic-text">
      {/* Header & Principle Banner */}
      <div className="bg-vedic-surface/70 border border-vedic-gold/20 rounded-lg p-5 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-vedic-gold text-xs font-mono tracking-widest uppercase mb-1">
            <Award className="w-3.5 h-3.5" />
            Deterministic Classical Combinations
          </div>
          <h2 className="font-serif text-2xl font-bold text-vedic-text tracking-wide">
            Yogas & Doshas Observatory
          </h2>
          <p className="text-xs text-vedic-muted mt-0.5">
            Transparent multi-condition evaluations with Parashari cancellations. Never labels any pattern as &quot;100% good&quot; or &quot;100% bad&quot;.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-vedic-bg p-1 rounded-lg border border-vedic-gold/20">
          <button
            onClick={() => setActiveTab('yogas')}
            className={`px-4 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'yogas'
                ? 'bg-vedic-gold text-vedic-bg font-bold shadow-md'
                : 'text-vedic-muted hover:text-vedic-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auspicious Yogas ({detectedYogas.length})
          </button>
          <button
            onClick={() => setActiveTab('doshas')}
            className={`px-4 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'doshas'
                ? 'bg-vedic-gold text-vedic-bg font-bold shadow-md'
                : 'text-vedic-muted hover:text-vedic-text'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Doshas & Cancellations ({detectedDoshas.length})
          </button>
        </div>
      </div>

      {/* Yogas Panel */}
      {activeTab === 'yogas' && (
        <div className="space-y-4">
          {detectedYogas.length === 0 ? (
            <div className="bg-vedic-surface/40 border border-vedic-gold/15 rounded p-8 text-center text-xs text-vedic-muted">
              No prominent classical yogas detected in current configuration.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detectedYogas.map(yoga => (
                <div
                  key={yoga.id}
                  className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-5 space-y-3 shadow-md hover:border-vedic-gold/45 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-vedic-gold/15">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                        {yoga.category} Yoga • {yoga.strength} Potency
                      </span>
                      <h3 className="font-serif text-lg font-bold text-vedic-gold mt-0.5">
                        {yoga.name}
                      </h3>
                      {yoga.sanskritName && (
                        <span className="text-xs font-serif text-vedic-muted">{yoga.sanskritName}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-vedic-gold/30 bg-vedic-bg text-vedic-gold">
                      {yoga.polarity}
                    </span>
                  </div>

                  <p className="text-xs text-vedic-text/90 leading-relaxed">
                    {yoga.interpretation}
                  </p>

                  {/* Conditions List */}
                  <div className="space-y-1.5 pt-2 border-t border-vedic-gold/10">
                    <span className="text-[10px] font-mono text-vedic-muted uppercase tracking-wider block">
                      Evaluated Parashari Conditions ({yoga.satisfiedConditions.length}/{yoga.conditions.length} Satisfied)
                    </span>
                    <div className="space-y-1">
                      {yoga.conditions.map((cond, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 text-[11px]">
                          {cond.isSatisfied ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-vedic-muted/50 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className={cond.isSatisfied ? 'text-vedic-text font-medium' : 'text-vedic-muted line-through'}>
                              {cond.description}
                            </span>
                            <span className="text-[10px] font-mono text-vedic-gold/80 block">
                              Found: {cond.actualValue} (Req: {cond.requiredValue})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-vedic-gold/10 flex items-center justify-between text-[10px] font-mono text-vedic-muted">
                    <span>Source: {yoga.traditionalSource}</span>
                    <span>v{yoga.calculationVersion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Doshas Panel */}
      {activeTab === 'doshas' && (
        <div className="space-y-4">
          {detectedDoshas.length === 0 ? (
            <div className="bg-vedic-surface/40 border border-vedic-gold/15 rounded p-8 text-center text-xs text-vedic-muted">
              No active or uncancelled classical doshas detected.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detectedDoshas.map(dosha => (
                <div
                  key={dosha.id}
                  className={`border rounded-lg p-5 space-y-3 shadow-md transition-colors ${
                    dosha.isCancelled
                      ? 'bg-vedic-surface/60 border-emerald-500/30'
                      : 'bg-vedic-surface/80 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-vedic-gold/15">
                    <div>
                      <span className="text-[10px] font-mono text-vedic-muted uppercase tracking-wider block">
                        {dosha.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-vedic-text mt-0.5">
                        {dosha.name}
                      </h3>
                      <span className="text-xs font-serif text-vedic-muted">{dosha.sanskritName}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-semibold ${
                        dosha.isCancelled
                          ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                          : 'border-amber-500/40 bg-amber-950/60 text-amber-300'
                      }`}
                    >
                      {dosha.isCancelled ? 'CANCELLED / BHANGA' : dosha.strength.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-vedic-text/90 leading-relaxed">
                    {dosha.interpretation}
                  </p>

                  {/* Mitigation and Cancellation Factor */}
                  {dosha.cancellationFactors.length > 0 && (
                    <div className="p-3 rounded bg-vedic-bg/70 border border-vedic-gold/15 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        Classical Cancellation (Bhanga) Analysis
                      </div>
                      <p className="text-[11px] text-vedic-text leading-relaxed">
                        {dosha.mitigationSummary}
                      </p>
                      <div className="space-y-1 pt-1">
                        {dosha.cancellationFactors.map((f, fIdx) => (
                          <div key={fIdx} className="text-[10px] font-mono text-vedic-muted">
                            • <span className="text-vedic-gold">{f.factor}:</span> {f.evidence} ({f.ruleCitation})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditions */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono text-vedic-muted uppercase block">
                      Trigger Conditions Verified:
                    </span>
                    {dosha.conditions.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2 text-[11px] text-vedic-text/80">
                        <AlertCircle className="w-3 h-3 text-vedic-gold shrink-0" />
                        <span>{c.description}: {c.actualValue}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-vedic-gold/10 flex items-center justify-between text-[10px] font-mono text-vedic-muted">
                    <span>Source: {dosha.traditionalSource}</span>
                    <span>Version: {dosha.calculationVersion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
