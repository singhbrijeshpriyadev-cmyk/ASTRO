'use client';

import React, { useState } from 'react';
import { ChartData, TraditionalGraha } from '@/types/astrology';
import { generateDeterministicInterpretation } from '@/lib/interpretation/interpretation-engine';
import { ThirteenLayerInterpretation, AnalysisLayer, RuleResult, EpistemicStatement } from '@/lib/interpretation/types';
import { 
  FileText, 
  Layers, 
  Compass, 
  Moon, 
  Sun, 
  Globe, 
  Home as HomeIcon, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Radio, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Info
} from 'lucide-react';

interface InterpretationViewProps {
  chart: ChartData;
  birthDate?: string;
}

export function InterpretationView({ chart, birthDate = '1995-10-24T08:30:00Z' }: InterpretationViewProps) {
  const [activeLayerId, setActiveLayerId] = useState<string>('layer_1');
  const [selectedPlanet, setSelectedPlanet] = useState<TraditionalGraha>('Sun');
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [selectedPurushartha, setSelectedPurushartha] = useState<'dharma' | 'artha' | 'kama' | 'moksha'>('dharma');

  const interpretation: ThirteenLayerInterpretation = React.useMemo(() => {
    return generateDeterministicInterpretation(chart, {
      querentName: 'Querent',
      birthDate: new Date(birthDate),
    });
  }, [chart, birthDate]);

  const layersList = [
    { id: 'layer_1', label: '1. Chart Summary', icon: Compass },
    { id: 'layer_2', label: '2. Lagna Analysis', icon: Globe },
    { id: 'layer_3', label: '3. Moon (Chandra)', icon: Moon },
    { id: 'layer_4', label: '4. Sun (Surya)', icon: Sun },
    { id: 'layer_5', label: '5. Nine Grahas', icon: Sparkles },
    { id: 'layer_6', label: '6. Twelve Bhavas', icon: HomeIcon },
    { id: 'layer_7', label: '7. Yogas & Doshas', icon: Award },
    { id: 'layer_8', label: '8. Core Strengths', icon: ShieldCheck },
    { id: 'layer_9', label: '9. Growth Edges', icon: AlertTriangle },
    { id: 'layer_10', label: '10. Dasha Cycle', icon: Clock },
    { id: 'layer_11', label: '11. Gochara (Transits)', icon: Radio },
    { id: 'layer_12', label: '12. Varga Harmonization', icon: Layers },
    { id: 'layer_13', label: '13. Purushartha Topics', icon: BookOpen },
  ];

  const getActiveLayerData = (): AnalysisLayer => {
    switch (activeLayerId) {
      case 'layer_1': return interpretation.layer1_chartSummary;
      case 'layer_2': return interpretation.layer2_lagnaAnalysis;
      case 'layer_3': return interpretation.layer3_moonAnalysis;
      case 'layer_4': return interpretation.layer4_sunAnalysis;
      case 'layer_5': return interpretation.layer5_planetAnalysis[selectedPlanet];
      case 'layer_6': return interpretation.layer6_houseAnalysis[selectedHouse];
      case 'layer_7': return interpretation.layer7_importantYogas;
      case 'layer_8': return interpretation.layer8_strengths;
      case 'layer_9': return interpretation.layer9_challenges;
      case 'layer_10': return interpretation.layer10_dashaAnalysis;
      case 'layer_11': return interpretation.layer11_transitAnalysis;
      case 'layer_12': return interpretation.layer12_vargaComparison;
      case 'layer_13': return interpretation.layer13_topicSpecific[selectedPurushartha];
      default: return interpretation.layer1_chartSummary;
    }
  };

  const currentLayer = getActiveLayerData();

  const renderEpistemicTag = (tag: EpistemicStatement['tag']) => {
    switch (tag) {
      case '[CALCULATED FACT]':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-semibold inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            CALCULATED FACT
          </span>
        );
      case '[TRADITIONAL INTERPRETATION]':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-vedic-gold/40 bg-vedic-surface text-vedic-gold font-semibold inline-flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            TRADITIONAL SHASTRA
          </span>
        );
      case '[INTERPRETIVE GUIDANCE]':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 font-semibold inline-flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            CONSTRUCTIVE GUIDANCE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-vedic-text">
      {/* Header & Epistemic Triad Banner */}
      <div className="bg-vedic-surface/70 border border-vedic-gold/20 rounded-lg p-5 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-vedic-gold text-xs font-mono tracking-widest uppercase mb-1">
            <FileText className="w-3.5 h-3.5" />
            Deterministic Vedic Interpretation Dossier
          </div>
          <h2 className="font-serif text-2xl font-bold text-vedic-text tracking-wide">
            13-Layer Classical Jyotish Analysis
          </h2>
          <p className="text-xs text-vedic-muted mt-0.5">
            Strict epistemic separation of astronomical facts, classical Parashari shastra, and actionable guidance. Zero fatalistic predictions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-vedic-bg border border-vedic-gold/20 text-vedic-muted">
            Rules Evaluated: <span className="text-vedic-gold font-bold">{interpretation.allRulesEvaluated.length}</span>
          </span>
        </div>
      </div>

      {/* Epistemic Triad Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded border border-cyan-500/20 bg-vedic-bg/60 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono font-bold text-cyan-300">[CALCULATED FACT]</span>
          </div>
          <p className="text-[11px] text-vedic-muted leading-relaxed">
            Exact astronomical coordinates, house lordships, Panchadha Maitri friendships, and divisional harmonics.
          </p>
        </div>

        <div className="p-3 rounded border border-vedic-gold/20 bg-vedic-bg/60 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vedic-gold"></span>
            <span className="text-xs font-mono font-bold text-vedic-gold">[TRADITIONAL INTERPRETATION]</span>
          </div>
          <p className="text-[11px] text-vedic-muted leading-relaxed">
            Classical aphorisms derived from Brihat Parashara Hora Shastra, Phaladeepika, and Saravali.
          </p>
        </div>

        <div className="p-3 rounded border border-emerald-500/20 bg-vedic-bg/60 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-bold text-emerald-300">[INTERPRETIVE GUIDANCE]</span>
          </div>
          <p className="text-[11px] text-vedic-muted leading-relaxed">
            Psychological cultivation, ethical alignment, and deliberate remediation honoring individual free will.
          </p>
        </div>
      </div>

      {/* Layer Navigation Tabs & Content Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer Selector Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-vedic-surface/50 border border-vedic-gold/15 rounded-lg p-2 max-h-[700px] overflow-y-auto">
          {layersList.map(layer => {
            const Icon = layer.icon;
            const isSelected = activeLayerId === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayerId(layer.id)}
                className={`w-full px-3 py-2 rounded text-xs font-mono text-left flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-vedic-gold text-vedic-bg font-bold shadow-md'
                    : 'text-vedic-muted hover:text-vedic-text hover:bg-vedic-surface/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{layer.label}</span>
              </button>
            );
          })}
        </div>

        {/* Layer Content Pane */}
        <div className="lg:col-span-3 space-y-5">
          {/* Sub-selectors for complex layers */}
          {activeLayerId === 'layer_5' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-vedic-surface/40 p-2 rounded border border-vedic-gold/10">
              {(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'] as TraditionalGraha[]).map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedPlanet(g)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    selectedPlanet === g
                      ? 'bg-vedic-gold text-vedic-bg font-bold'
                      : 'text-vedic-muted hover:text-vedic-text'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {activeLayerId === 'layer_6' && (
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 bg-vedic-surface/40 p-2 rounded border border-vedic-gold/10">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHouse(h)}
                  className={`py-1 rounded text-xs font-mono text-center transition-colors ${
                    selectedHouse === h
                      ? 'bg-vedic-gold text-vedic-bg font-bold'
                      : 'text-vedic-muted hover:text-vedic-text bg-vedic-bg/60'
                  }`}
                >
                  H{h}
                </button>
              ))}
            </div>
          )}

          {activeLayerId === 'layer_13' && (
            <div className="flex items-center gap-2 bg-vedic-surface/40 p-2 rounded border border-vedic-gold/10">
              {(['dharma', 'artha', 'kama', 'moksha'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPurushartha(p)}
                  className={`px-3 py-1 rounded text-xs font-mono uppercase transition-colors ${
                    selectedPurushartha === p
                      ? 'bg-vedic-gold text-vedic-bg font-bold'
                      : 'text-vedic-muted hover:text-vedic-text'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Active Layer Header */}
          <div className="bg-vedic-surface/80 border border-vedic-gold/25 rounded-lg p-5 shadow-lg space-y-2">
            <span className="text-[10px] font-mono text-vedic-gold uppercase tracking-widest block">
              {currentLayer.subtitle}
            </span>
            <h3 className="font-serif text-xl font-bold text-vedic-text">
              {currentLayer.title}
            </h3>
            <p className="text-xs text-vedic-muted leading-relaxed">
              {currentLayer.summary}
            </p>
          </div>

          {/* Rules Evaluated within this Layer */}
          <div className="space-y-3">
            {currentLayer.rules.length === 0 ? (
              <div className="bg-vedic-surface/40 border border-vedic-gold/10 rounded p-6 text-center text-xs text-vedic-muted">
                No specific rules evaluated for this filter.
              </div>
            ) : (
              currentLayer.rules.map(rule => (
                <div
                  key={rule.ruleId}
                  className="bg-vedic-bg/90 border border-vedic-gold/20 rounded-lg p-4 space-y-3 shadow-md hover:border-vedic-gold/40 transition-colors"
                >
                  {/* Rule Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-vedic-gold/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-vedic-gold">{rule.ruleId}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-vedic-surface border border-vedic-gold/20 text-vedic-muted uppercase">
                        {rule.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-vedic-muted">
                      Source: {rule.sourceTradition}
                    </span>
                  </div>

                  {/* Triad Statements */}
                  <div className="space-y-2 text-xs">
                    {rule.statements.map((stmt, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div>{renderEpistemicTag(stmt.tag)}</div>
                        <p className="text-xs text-vedic-text/90 leading-relaxed pl-2 border-l border-vedic-gold/20">
                          {stmt.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
