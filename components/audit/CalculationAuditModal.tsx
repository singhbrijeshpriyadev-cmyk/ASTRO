'use client';

import React, { useState, useMemo } from 'react';
import { ChartData, NormalizedBirthData, CalculationSettings, TraditionalGraha, GrahaName } from '@/types/astrology';
import { generateCompleteCalculationAudit, CalculationStepAudit, PlanetCalculationAudit } from '@/lib/audit/calculation-audit';
import { 
  X, 
  Compass, 
  Cpu, 
  Clock, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BookOpen, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CalculationAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: ChartData;
  normalized: NormalizedBirthData;
  settings: CalculationSettings;
}

export function CalculationAuditModal({
  isOpen,
  onClose,
  chart,
  normalized,
  settings,
}: CalculationAuditModalProps) {
  const [activeTab, setActiveTab] = useState<'planet' | 'steps' | 'matrix' | 'traditions'>('planet');
  const [selectedPlanetName, setSelectedPlanetName] = useState<string>('Jupiter');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const auditReport = useMemo(() => {
    return generateCompleteCalculationAudit(chart, normalized, settings);
  }, [chart, normalized, settings]);

  if (!isOpen) return null;

  const currentPlanetAudit = auditReport.planetAudits.find(
    p => p.planet.toLowerCase() === selectedPlanetName.toLowerCase() ||
         (selectedPlanetName === 'Jupiter' && (p.planet === 'Guru' || p.planet === 'Jupiter')) ||
         (selectedPlanetName === 'Sun' && (p.planet === 'Surya' || p.planet === 'Sun')) ||
         (selectedPlanetName === 'Moon' && (p.planet === 'Chandra' || p.planet === 'Moon')) ||
         (selectedPlanetName === 'Mars' && (p.planet === 'Mangala' || p.planet === 'Mars')) ||
         (selectedPlanetName === 'Mercury' && (p.planet === 'Budha' || p.planet === 'Mercury')) ||
         (selectedPlanetName === 'Venus' && (p.planet === 'Shukra' || p.planet === 'Venus')) ||
         (selectedPlanetName === 'Saturn' && (p.planet === 'Shani' || p.planet === 'Saturn')) ||
         (selectedPlanetName === 'Rahu' && p.planet === 'Rahu') ||
         (selectedPlanetName === 'Ketu' && p.planet === 'Ketu')
  ) || auditReport.planetAudits[0];

  const filteredSteps = auditReport.steps.filter(step => {
    const matchesCategory = categoryFilter === 'all' || step.category === categoryFilter;
    const matchesSearch = 
      step.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.formulaOrRule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.output.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    'all',
    'Time & Coordinates',
    'Astronomical Ephemeris',
    'D1 Natal Kundali',
    'Divisional Harmonics (Vargas)',
    'Dasha & Predictive',
    'Classical Combinations & Bala',
  ];

  const grahaTabs = [
    { label: 'Sun', sanskrit: 'Surya' },
    { label: 'Moon', sanskrit: 'Chandra' },
    { label: 'Mars', sanskrit: 'Mangala' },
    { label: 'Mercury', sanskrit: 'Budha' },
    { label: 'Jupiter', sanskrit: 'Guru' },
    { label: 'Venus', sanskrit: 'Shukra' },
    { label: 'Saturn', sanskrit: 'Shani' },
    { label: 'Rahu', sanskrit: 'Rahu' },
    { label: 'Ketu', sanskrit: 'Ketu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-vedic-bg border border-vedic-gold-border rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-vedic-text">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-vedic-gold-border/40 bg-vedic-surface/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-vedic-gold/10 border border-vedic-gold/30 flex items-center justify-center text-vedic-gold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-vedic-text">
                  Complete Astrology Calculation Audit
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-vedic-gold/30 bg-vedic-gold/10 text-vedic-gold">
                  35-Step Deterministic Trace
                </span>
              </div>
              <p className="text-xs text-vedic-muted font-sans mt-0.5">
                Deterministic mathematical verification: <span className="font-mono text-vedic-gold-soft">INPUT → FORMULA/RULE → OUTPUT</span>. Zero AI calculations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-vedic-muted hover:text-vedic-text hover:bg-vedic-surface border border-transparent hover:border-vedic-gold-border/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 border-b border-vedic-gold-border/30 bg-vedic-bg flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('planet')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-all ${
              activeTab === 'planet'
                ? 'border-vedic-gold text-vedic-gold bg-vedic-surface/40'
                : 'border-transparent text-vedic-muted hover:text-vedic-text'
            }`}
          >
            Planet-by-Planet Inspector
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-all ${
              activeTab === 'steps'
                ? 'border-vedic-gold text-vedic-gold bg-vedic-surface/40'
                : 'border-transparent text-vedic-muted hover:text-vedic-text'
            }`}
          >
            Master 35-Step Trace Table
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-all ${
              activeTab === 'matrix'
                ? 'border-vedic-gold text-vedic-gold bg-vedic-surface/40'
                : 'border-transparent text-vedic-muted hover:text-vedic-text'
            }`}
          >
            Varga Verification Matrix
          </button>
          <button
            onClick={() => setActiveTab('traditions')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-all ${
              activeTab === 'traditions'
                ? 'border-vedic-gold text-vedic-gold bg-vedic-surface/40'
                : 'border-transparent text-vedic-muted hover:text-vedic-text'
            }`}
          >
            Configurable Traditions & Discrepancies
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: PLANET-BY-PLANET INSPECTOR */}
          {activeTab === 'planet' && currentPlanetAudit && (
            <div className="space-y-6">
              {/* Graha Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-vedic-gold-border/20">
                {grahaTabs.map(g => (
                  <button
                    key={g.label}
                    onClick={() => setSelectedPlanetName(g.label)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                      selectedPlanetName.toLowerCase() === g.label.toLowerCase()
                        ? 'bg-vedic-gold text-vedic-bg font-bold shadow-md'
                        : 'bg-vedic-surface/60 text-vedic-muted hover:text-vedic-text hover:bg-vedic-surface'
                    }`}
                  >
                    <span>{g.label}</span>
                    <span className="text-[10px] opacity-75 font-serif">({g.sanskrit})</span>
                  </button>
                ))}
              </div>

              {/* Exact Requested Verification Screen Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-vedic-gold-border/40 rounded bg-vedic-surface/50 p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-vedic-gold-border/20">
                    <span className="text-vedic-muted uppercase tracking-wider text-[11px]">Primary Coordinates</span>
                    <span className="text-vedic-gold font-bold text-sm">{currentPlanetAudit.planet} ({currentPlanetAudit.sanskritName})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px]">
                    <div>
                      <span className="text-vedic-muted block text-[10px]">Planet:</span>
                      <span className="text-vedic-text font-bold">{currentPlanetAudit.planet}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">UTC Date:</span>
                      <span className="text-vedic-text truncate block">{currentPlanetAudit.utcDate}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Julian Day:</span>
                      <span className="text-cyan-300 font-bold">{currentPlanetAudit.julianDay}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Tropical Longitude:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.tropicalLongitude}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Ayanamsha:</span>
                      <span className="text-vedic-gold-soft">{currentPlanetAudit.ayanamshaValue} ({currentPlanetAudit.ayanamshaSystem})</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Sidereal Longitude:</span>
                      <span className="text-vedic-gold font-bold text-xs">{currentPlanetAudit.siderealLongitude}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Rashi:</span>
                      <span className="text-vedic-text font-semibold">{currentPlanetAudit.rashi} (#{currentPlanetAudit.rashiNumber})</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Degree in Rashi:</span>
                      <span className="text-vedic-gold font-bold">{currentPlanetAudit.degreeInRashi}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Nakshatra:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.nakshatra} (#{currentPlanetAudit.nakshatraNumber})</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Pada:</span>
                      <span className="text-vedic-gold font-bold">{currentPlanetAudit.pada} (Lord: {currentPlanetAudit.nakshatraLord})</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">House:</span>
                      <span className="text-emerald-300 font-bold">{currentPlanetAudit.house}th House</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Speed / Motion:</span>
                      <span className={currentPlanetAudit.isRetrograde ? 'text-amber-400 font-bold' : 'text-vedic-text'}>
                        {currentPlanetAudit.speedDegPerDay} {currentPlanetAudit.isRetrograde ? '[Vakra / Retro]' : '[Margi]'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divisional & Functional Status */}
                <div className="border border-vedic-gold-border/40 rounded bg-vedic-surface/50 p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-vedic-gold-border/20">
                    <span className="text-vedic-muted uppercase tracking-wider text-[11px]">Harmonics & Dignities</span>
                    <span className="text-vedic-gold-soft text-[11px] font-sans">Vedic Astrological State</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px]">
                    <div>
                      <span className="text-vedic-muted block text-[10px]">D9 Navamsha:</span>
                      <span className="text-vedic-gold font-bold">{currentPlanetAudit.d9Placement} {currentPlanetAudit.isVargottama ? '★ [Vargottama]' : ''}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D10 Dasamsha:</span>
                      <span className="text-vedic-text font-bold">{currentPlanetAudit.d10Placement}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D2 Hora:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.d2Placement}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D3 Drekkana:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.d3Placement}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D4 Chaturthamsha:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.d4Placement}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D12 Dvadasamsha:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.d12Placement}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D60 Shashtiamsha:</span>
                      <span className="text-vedic-text">{currentPlanetAudit.d60Placement}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">D60 Deity:</span>
                      <span className="text-cyan-300 font-semibold">{currentPlanetAudit.d60Deity || 'Classical Deity'}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Planetary Dignity:</span>
                      <span className="text-emerald-300 font-bold">{currentPlanetAudit.dignity}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted block text-[10px]">Combustion Status:</span>
                      <span className={currentPlanetAudit.isCombust ? 'text-red-400 font-bold' : 'text-vedic-text'}>
                        {currentPlanetAudit.isCombust ? `Combust (${currentPlanetAudit.combustionDegreesFromSun} from Sun)` : 'Direct / Non-Combust'}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-vedic-muted block text-[10px]">5-Fold Compound Relationship (Panchadha Maitri):</span>
                      <span className="text-vedic-gold-soft">{currentPlanetAudit.compoundRelationshipToSignLord}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Traceable Mathematical Equations */}
              <div className="border border-vedic-gold-border/30 rounded bg-vedic-bg p-4 space-y-2 font-mono text-xs">
                <div className="text-vedic-gold text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ArrowRight className="w-3.5 h-3.5 text-vedic-gold" />
                  Deterministic Formula Trace for {currentPlanetAudit.planet}
                </div>

                <div className="space-y-1.5 text-[11px] text-vedic-text leading-relaxed">
                  <div className="p-2 rounded bg-vedic-surface/40 border border-vedic-gold/10">
                    <span className="text-vedic-muted">Tropical Coordinates: </span>
                    <span>{currentPlanetAudit.traceableFormulas.tropicalFormula}</span>
                  </div>
                  <div className="p-2 rounded bg-vedic-surface/40 border border-vedic-gold/10">
                    <span className="text-vedic-muted">Nirayana Deduction: </span>
                    <span className="text-cyan-300">{currentPlanetAudit.traceableFormulas.siderealFormula}</span>
                  </div>
                  <div className="p-2 rounded bg-vedic-surface/40 border border-vedic-gold/10">
                    <span className="text-vedic-muted">Rashi & Degree: </span>
                    <span className="text-vedic-gold">{currentPlanetAudit.traceableFormulas.rashiFormula}</span>
                  </div>
                  <div className="p-2 rounded bg-vedic-surface/40 border border-vedic-gold/10">
                    <span className="text-vedic-muted">Nakshatra & Pada: </span>
                    <span>{currentPlanetAudit.traceableFormulas.nakshatraFormula} → {currentPlanetAudit.traceableFormulas.padaFormula}</span>
                  </div>
                  <div className="p-2 rounded bg-vedic-surface/40 border border-vedic-gold/10">
                    <span className="text-vedic-muted">D9 Harmonic: </span>
                    <span className="text-vedic-gold-soft">{currentPlanetAudit.traceableFormulas.d9Formula}</span>
                  </div>
                  <div className="p-2 rounded bg-vedic-surface/40 border border-vedic-gold/10">
                    <span className="text-vedic-muted">D10 Harmonic: </span>
                    <span>{currentPlanetAudit.traceableFormulas.d10Formula}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER 35-STEP TRACE TABLE */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              {/* Filter and Search Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-vedic-surface/40 p-3 rounded border border-vedic-gold-border/20 text-xs font-mono">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-4 h-4 text-vedic-gold shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search step, formula, or output..."
                    className="bg-transparent border-none outline-none text-vedic-text placeholder-vedic-muted w-full text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-vedic-muted shrink-0" />
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-vedic-bg border border-vedic-gold-border/30 rounded px-2 py-1 text-vedic-text outline-none text-xs"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c === 'all' ? 'All Categories (35 Steps)' : c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Steps Table */}
              <div className="border border-vedic-gold-border/30 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-vedic-surface/80 border-b border-vedic-gold-border/30 text-vedic-gold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Calculation</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Input</th>
                      <th className="py-2.5 px-3 min-w-[240px]">Formula / Classical Rule</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Output</th>
                      <th className="py-2.5 px-3 min-w-[160px]">Tradition / Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vedic-gold-border/20">
                    {filteredSteps.map(step => (
                      <tr key={step.stepNumber} className="hover:bg-vedic-surface/40 transition-colors">
                        <td className="py-2 px-3 text-center text-vedic-gold font-bold">
                          {step.stepNumber}
                        </td>
                        <td className="py-2 px-3 font-semibold text-vedic-text">
                          <div>{step.name}</div>
                          <span className="text-[9px] text-vedic-muted font-sans block">{step.category}</span>
                        </td>
                        <td className="py-2 px-3 text-vedic-text-secondary">
                          {step.input}
                        </td>
                        <td className="py-2 px-3 text-cyan-300 font-sans text-[11px] leading-tight">
                          {step.formulaOrRule}
                        </td>
                        <td className="py-2 px-3 text-vedic-gold-soft font-bold">
                          {step.output}
                        </td>
                        <td className="py-2 px-3 text-vedic-muted text-[10px] font-sans">
                          <div>{step.traditionOrStandard}</div>
                          {step.discrepanciesOrVariations && (
                            <span className="text-amber-400 text-[9px] block mt-0.5">
                              ⚠️ {step.discrepanciesOrVariations}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VARGA VERIFICATION MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-vedic-muted">
                Harmonic sign placements across D1 through D60. Highlighted rows indicate <span className="text-vedic-gold font-bold">★ Vargottama</span> (same sign in D1 and D9).
              </div>

              <div className="border border-vedic-gold-border/30 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-vedic-surface/80 border-b border-vedic-gold-border/30 text-vedic-gold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Planet</th>
                      <th className="py-2.5 px-3">D1 Rashi</th>
                      <th className="py-2.5 px-3">D2 Hora</th>
                      <th className="py-2.5 px-3">D3 Drekkana</th>
                      <th className="py-2.5 px-3">D4 Chaturth</th>
                      <th className="py-2.5 px-3">D7 Saptam</th>
                      <th className="py-2.5 px-3 text-vedic-gold">D9 Navamsha</th>
                      <th className="py-2.5 px-3">D10 Dasam</th>
                      <th className="py-2.5 px-3">D12 Dvadas</th>
                      <th className="py-2.5 px-3">D60 Shashti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vedic-gold-border/20">
                    {auditReport.planetAudits.map(pa => (
                      <tr key={pa.planet} className={`hover:bg-vedic-surface/40 transition-colors ${pa.isVargottama ? 'bg-vedic-gold/10' : ''}`}>
                        <td className="py-2 px-3 font-bold text-vedic-gold flex items-center gap-1.5">
                          <span>{pa.planet}</span>
                          {pa.isVargottama && <span className="text-[10px] text-vedic-gold" title="Vargottama">★</span>}
                        </td>
                        <td className="py-2 px-3 text-vedic-text font-semibold">{pa.d1Placement}</td>
                        <td className="py-2 px-3 text-vedic-muted">{pa.d2Placement}</td>
                        <td className="py-2 px-3 text-vedic-muted">{pa.d3Placement}</td>
                        <td className="py-2 px-3 text-vedic-muted">{pa.d4Placement}</td>
                        <td className="py-2 px-3 text-vedic-muted">{pa.d7Placement}</td>
                        <td className={`py-2 px-3 font-bold ${pa.isVargottama ? 'text-vedic-gold' : 'text-cyan-300'}`}>
                          {pa.d9Placement}
                        </td>
                        <td className="py-2 px-3 text-vedic-gold-soft">{pa.d10Placement}</td>
                        <td className="py-2 px-3 text-vedic-muted">{pa.d12Placement}</td>
                        <td className="py-2 px-3 text-vedic-muted text-[10px]">{pa.d60Placement} ({pa.d60Deity})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURABLE TRADITIONS & DISCREPANCIES */}
          {activeTab === 'traditions' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded border border-vedic-gold/30 bg-vedic-surface/50 space-y-1">
                <div className="font-serif text-sm font-bold text-vedic-text flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-vedic-gold" />
                  Transparency in Jyotish Traditions
                </div>
                <p className="text-xs text-vedic-muted leading-relaxed font-sans">
                  Vedic astrology includes multiple traditional schools (Sampradayas). Kaalika explicitly exposes its selected mathematical parameters and alternative traditions rather than obscuring assumptions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditReport.traditionVariations.map(tv => (
                  <div key={tv.parameter} className="border border-vedic-gold-border/30 rounded bg-vedic-surface/40 p-4 space-y-2 font-mono text-xs">
                    <div className="text-vedic-gold font-bold text-xs uppercase tracking-wide">
                      {tv.parameter}
                    </div>

                    <div>
                      <span className="text-vedic-muted text-[10px] block">Selected in Kaalika:</span>
                      <span className="text-emerald-300 font-bold">{tv.selectedTradition}</span>
                    </div>

                    <div>
                      <span className="text-vedic-muted text-[10px] block">Alternative Traditions:</span>
                      <span className="text-vedic-text-secondary text-[11px]">{tv.alternativeTraditions.join(', ')}</span>
                    </div>

                    <div className="pt-1 border-t border-vedic-gold-border/20 text-[11px] text-vedic-muted font-sans leading-relaxed">
                      {tv.technicalRationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-vedic-gold-border/40 bg-vedic-surface/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-vedic-muted text-[11px]">
            Generated at {new Date(auditReport.generatedAt).toLocaleTimeString()} • VSOP87/ELP2000 Ephemeris Engine
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded bg-vedic-gold text-vedic-bg font-bold hover:bg-vedic-gold-soft transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
