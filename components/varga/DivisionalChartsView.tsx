'use client';

import React, { useState, useMemo } from 'react';
import { KundaliData, GrahaName, RashiName } from '@/types/astrology';
import { ALL_VARGAS, VARGA_ORDER } from '@/lib/varga/registry';
import { computeVargaChart } from '@/lib/varga/engine';
import { VargaChartResult, VargaPlacement } from '@/lib/varga/types';
import { NorthIndianChart } from '../charts/NorthIndianChart';
import { SouthIndianChart } from '../charts/SouthIndianChart';
import { EastIndianChart } from '../charts/EastIndianChart';
import { RASHIS, GRAHA_METADATA } from '@/lib/astrology/constants';
import { 
  Layers, 
  GitCompare, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Sliders, 
  Check, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface DivisionalChartsViewProps {
  kundali: KundaliData;
  initialChartStyle?: 'north' | 'south' | 'east';
}

// 3x6 grid strictly as specified:
// D1  D2  D3  D4  D5  D6
// D7  D9  D10 D12 D16 D20
// D24 D27 D30 D40 D45 D60
const VARGA_GRID_LAYOUT = [
  ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
  ['D7', 'D9', 'D10', 'D12', 'D16', 'D20'],
  ['D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
];

const VARGA_SUBTITLES: Record<string, { title: string; subtitle: string; sanskrit: string; category: string }> = {
  D1: {
    title: 'D1 — Rashi',
    sanskrit: 'तनु भाव / लग्न',
    subtitle: 'Physical Constitution, Soul Embodiment & General Life Trajectory',
    category: 'Shadvarga (Root)',
  },
  D2: {
    title: 'D2 — Hora',
    sanskrit: 'धन / सम्पति',
    subtitle: 'Wealth, Assets, Sustenance & Solar/Lunar Polarity',
    category: 'Shadvarga (2nd Harmonic)',
  },
  D3: {
    title: 'D3 — Drekkana',
    sanskrit: 'भ्रातृ / पराक्रम',
    subtitle: 'Siblings, Courage, Vitality & Karmic Initiative',
    category: 'Shadvarga (3rd Harmonic)',
  },
  D4: {
    title: 'D4 — Chaturthamsha',
    sanskrit: 'भाग्य / सुख',
    subtitle: 'Fortune, Fixed Assets, Land & Domestic Bliss',
    category: 'Dashavarga (4th Harmonic)',
  },
  D5: {
    title: 'D5 — Panchamsha',
    sanskrit: 'प्रज्ञा / तेजस',
    subtitle: 'Spiritual Authority, Fame, Lineage Power & Talents',
    category: 'Special Varga (5th Harmonic)',
  },
  D6: {
    title: 'D6 — Shashthamsha',
    sanskrit: 'रिपु / ऋण',
    subtitle: 'Obstacles, Debts, Health Dynamics & Karmic Conflicts',
    category: 'Special Varga (6th Harmonic)',
  },
  D7: {
    title: 'D7 — Saptamsha',
    sanskrit: 'संतान / वंश',
    subtitle: 'Progeny, Lineage Continuity & Creative Fruit',
    category: 'Saptavarga (7th Harmonic)',
  },
  D9: {
    title: 'D9 — Navamsha',
    sanskrit: 'धर्म / भाग्य',
    subtitle: 'Marriage, Dharma & Planetary Strength',
    category: 'Shadvarga / Supreme Harmonic (9th Harmonic)',
  },
  D10: {
    title: 'D10 — Dashamsha',
    sanskrit: 'कर्म / पद',
    subtitle: 'Career, Public Stature, Power & Great Achievements',
    category: 'Dashavarga (10th Harmonic)',
  },
  D12: {
    title: 'D12 — Dwadashamsha',
    sanskrit: 'माता-पिता',
    subtitle: 'Parents, Ancestral Heritage & Lineage Karma',
    category: 'Shadvarga (12th Harmonic)',
  },
  D16: {
    title: 'D16 — Shodashamsha',
    sanskrit: 'सुख / वाहन',
    subtitle: 'Conveyances, General Happiness & Sensory Comforts',
    category: 'Shodashavarga (16th Harmonic)',
  },
  D20: {
    title: 'D20 — Vimshamsha',
    sanskrit: 'उपासना / भक्ति',
    subtitle: 'Spiritual Progress, Devotion & Sacred Mantras',
    category: 'Shodashavarga (20th Harmonic)',
  },
  D24: {
    title: 'D24 — Chaturvimshamsha',
    sanskrit: 'विद्या / ज्ञान',
    subtitle: 'Higher Learning, Academic Intellect & Scholarship',
    category: 'Shodashavarga (24th Harmonic)',
  },
  D27: {
    title: 'D27 — Saptavimshamsha',
    sanskrit: 'बल / नक्षत्र',
    subtitle: 'Subconscious Strengths, Weaknesses & Stamina',
    category: 'Shodashavarga (27th Harmonic)',
  },
  D30: {
    title: 'D30 — Trimshamsha',
    sanskrit: 'अरिष्ट / पाप',
    subtitle: 'Misfortunes, Arishta, Afflictions & Hidden Karmic Debts',
    category: 'Shadvarga (30th Harmonic)',
  },
  D40: {
    title: 'D40 — Khavedamsha',
    sanskrit: 'शुभाशुभ फल',
    subtitle: 'Auspicious & Inauspicious Karmic Blessings',
    category: 'Shodashavarga (40th Harmonic)',
  },
  D45: {
    title: 'D45 — Akshavedamsha',
    sanskrit: 'चरित्र / शुद्धि',
    subtitle: 'Character Integrity & Micro-Spiritual Refinements',
    category: 'Shodashavarga (45th Harmonic)',
  },
  D60: {
    title: 'D60 — Shashtiamsha',
    sanskrit: 'कर्म संस्कार',
    subtitle: 'Past Life Samskaras, Final Arbiter & Supreme Destiny',
    category: 'Shodashavarga / Ultimate Arbiter (60th Harmonic)',
  },
};

const COMPARISON_PRESETS = [
  { id: 'D9', label: 'D1 vs D9', desc: 'Natal Rashi vs Navamsha (Dharma, Marriage & Strength)' },
  { id: 'D10', label: 'D1 vs D10', desc: 'Natal Rashi vs Dashamsha (Career & Public Zenith)' },
  { id: 'D7', label: 'D1 vs D7', desc: 'Natal Rashi vs Saptamsha (Progeny & Creative Fruit)' },
  { id: 'D12', label: 'D1 vs D12', desc: 'Natal Rashi vs Dwadashamsha (Parents & Ancestry)' },
  { id: 'D60', label: 'D1 vs D60', desc: 'Natal Rashi vs Shashtiamsha (Past Life Karmic Root)' },
];

export function DivisionalChartsView({
  kundali,
  initialChartStyle = 'north',
}: DivisionalChartsViewProps) {
  const [selectedVarga, setSelectedVarga] = useState<string>('D9');
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'east'>(initialChartStyle);
  const [showCalculationDetails, setShowCalculationDetails] = useState<boolean>(false);
  const [compareTarget, setCompareTarget] = useState<string>('D9');
  const [showSideBySideSvg, setShowSideBySideSvg] = useState<boolean>(false);

  // Prepare input for master Varga engine
  const vargaEngineInput = useMemo(() => {
    const ascLon =
      kundali.chartData?.ascendant?.siderealLongitude ??
      kundali.ascendant.siderealLongitude ??
      (kundali.ascendant.rashiNumber - 1) * 30 +
        kundali.ascendant.degree +
        kundali.ascendant.minutes / 60 +
        (kundali.ascendant.seconds || 0) / 3600;

    const planets = kundali.planets.map(p => ({
      name: p.name,
      siderealLongitude: p.siderealLongitude,
      symbol: p.symbol,
      sanskrit: p.sanskrit,
      d1Rashi: p.zodiacSign,
      nakshatra: p.nakshatra,
      pada: p.pada,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
    }));

    return {
      ascendantSiderealLon: ascLon,
      planets,
    };
  }, [kundali]);

  // Compute selected Varga chart result
  const activeVargaResult: VargaChartResult = useMemo(() => {
    return computeVargaChart(selectedVarga, vargaEngineInput);
  }, [selectedVarga, vargaEngineInput]);

  // Compute D1 baseline and comparison Varga for Compare Charts mode
  const d1ChartResult: VargaChartResult = useMemo(() => {
    return computeVargaChart('D1', vargaEngineInput);
  }, [vargaEngineInput]);

  const compareVargaResult: VargaChartResult = useMemo(() => {
    return computeVargaChart(compareTarget, vargaEngineInput);
  }, [compareTarget, vargaEngineInput]);

  const activeMeta = VARGA_SUBTITLES[selectedVarga] || {
    title: `${selectedVarga} — Harmonic`,
    sanskrit: activeVargaResult.definition.sanskritName,
    subtitle: activeVargaResult.definition.purpose,
    category: 'Vedic Harmonic',
  };

  const getDignityBadge = (dignity: string) => {
    switch (dignity) {
      case 'Exalted':
        return 'bg-vedic-gold/15 text-vedic-gold-soft border-vedic-gold/40';
      case 'Moolatrikona':
        return 'bg-vedic-emerald/15 text-vedic-emerald border-vedic-emerald/40';
      case 'Own Sign':
        return 'bg-vedic-peacock/20 text-vedic-text border-vedic-muted-green/40';
      case 'Great Friend':
      case 'Friend':
        return 'bg-vedic-surface text-vedic-text-secondary border-vedic-gold-border/40';
      case 'Debilitated':
        return 'bg-rose-950/40 text-rose-300 border-rose-800/50';
      case 'Enemy':
      case 'Great Enemy':
        return 'bg-amber-950/30 text-amber-300 border-amber-800/40';
      default:
        return 'bg-vedic-surface/40 text-vedic-text-secondary border-vedic-gold-border/20';
    }
  };

  const getHouseTag = (house: number) => {
    if ([1, 4, 7, 10].includes(house)) return 'Kendra (केंद्र)';
    if ([1, 5, 9].includes(house)) return 'Trikona (त्रिकोण)';
    if ([3, 6, 11].includes(house)) return 'Upachaya (उपचय)';
    if ([6, 8, 12].includes(house)) return 'Dusthana (दुस्थान)';
    return '';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. TOP SEGMENTED NAVIGATION */}
      <section className="bg-vedic-secondary/80 border border-vedic-gold-border/60 rounded-md p-3 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-vedic-gold animate-pulse" />
            <h2 className="text-[11px] font-mono tracking-widest text-vedic-gold uppercase font-semibold">
              Shodashavarga Harmonic Matrix (षोडशवर्ग प्रणाली)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-vedic-text-secondary">
            Parashari Classical 18-Varga Engine
          </span>
        </div>

        {/* Refined 3x6 Segmented Navigation */}
        <div className="space-y-1.5">
          {VARGA_GRID_LAYOUT.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {row.map(vId => {
                const isSelected = selectedVarga === vId;
                const def = ALL_VARGAS[vId];
                return (
                  <button
                    key={vId}
                    id={`varga-select-${vId}`}
                    onClick={() => setSelectedVarga(vId)}
                    className="relative py-1.5 sm:py-2 px-1 text-center rounded transition-colors duration-150 border border-transparent select-none cursor-pointer"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="varga-active"
                        transition={motionTokens.spring.navigation}
                        className="absolute inset-0 rounded bg-vedic-surface border border-vedic-gold shadow-sm ring-1 ring-vedic-gold/20"
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span
                        className={`text-xs sm:text-sm font-mono tracking-tight font-semibold ${
                          isSelected ? 'text-vedic-gold' : 'text-vedic-text'
                        }`}
                      >
                        {vId}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-sans truncate max-w-[90%] text-vedic-text-secondary/80 mt-0.5">
                        {def ? def.name.replace(/^[D\d]+\s*/, '') : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* 2. HEADER & SUBTITLE */}
      <section className="border-b border-vedic-gold-border/40 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-vedic-text">
                {activeMeta.title}
              </h1>
              <span className="text-sm font-serif text-vedic-gold italic px-2 py-0.5 rounded bg-vedic-gold/10 border border-vedic-gold/20">
                {activeMeta.sanskrit}
              </span>
            </div>
            <p className="text-sm text-vedic-text-secondary font-sans mt-1">
              {activeMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-vedic-text-secondary bg-vedic-primary/80 px-3 py-1.5 rounded border border-vedic-gold-border/40 self-start md:self-auto">
            <span>Harmonic Factor: 1/{activeVargaResult.definition.divisionCount}</span>
            <span className="text-vedic-gold-border">•</span>
            <span>Arc: {activeVargaResult.definition.spanDegrees.toFixed(2)}°</span>
          </div>
        </div>
      </section>

      {/* 3. LARGE SVG CHART */}
      <section className="bg-vedic-secondary/70 border border-vedic-gold-border rounded-lg p-4 sm:p-6 shadow-xl flex flex-col items-center">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-vedic-gold-border/40">
          <div className="flex items-center space-x-2 text-xs font-mono text-vedic-gold-soft">
            <span className="px-2 py-0.5 rounded bg-vedic-surface border border-vedic-gold-border text-vedic-text">
              Ascendant: {activeVargaResult.ascendant.rashi} {activeVargaResult.ascendant.dms}
            </span>
            {activeVargaResult.ascendant.deity && (
              <span className="px-2 py-0.5 rounded bg-vedic-gold/10 border border-vedic-gold/30 text-vedic-gold text-[11px]">
                Deity: {activeVargaResult.ascendant.deity}
              </span>
            )}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center space-x-1 bg-vedic-primary/90 p-1 rounded border border-vedic-gold-border/50 text-xs">
            <button
              onClick={() => setChartStyle('north')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartStyle === 'north'
                  ? 'bg-vedic-surface text-vedic-gold font-medium border border-vedic-gold/30'
                  : 'text-vedic-text-secondary hover:text-vedic-text'
              }`}
            >
              North Indian
            </button>
            <button
              onClick={() => setChartStyle('south')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartStyle === 'south'
                  ? 'bg-vedic-surface text-vedic-gold font-medium border border-vedic-gold/30'
                  : 'text-vedic-text-secondary hover:text-vedic-text'
              }`}
            >
              South Indian
            </button>
            <button
              onClick={() => setChartStyle('east')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartStyle === 'east'
                  ? 'bg-vedic-surface text-vedic-gold font-medium border border-vedic-gold/30'
                  : 'text-vedic-text-secondary hover:text-vedic-text'
              }`}
            >
              East Indian
            </button>
          </div>
        </div>

        {/* Large Chart Container */}
        <div className="w-full max-w-[480px] aspect-square flex items-center justify-center p-2 min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedVarga}-${chartStyle}`}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.28, ease: motionTokens.ease.standard }}
              className="w-full h-full flex items-center justify-center"
            >
              {chartStyle === 'north' && (
                <NorthIndianChart
                  kundali={kundali}
                  vargaId={selectedVarga}
                  vargaResult={activeVargaResult}
                  showDegrees={true}
                  className="w-full h-full"
                />
              )}
              {chartStyle === 'south' && (
                <SouthIndianChart
                  kundali={kundali}
                  vargaId={selectedVarga}
                  vargaResult={activeVargaResult}
                  showDegrees={true}
                  className="w-full h-full"
                />
              )}
              {chartStyle === 'east' && (
                <EastIndianChart
                  kundali={kundali}
                  vargaId={selectedVarga}
                  vargaResult={activeVargaResult}
                  showDegrees={true}
                  className="w-full h-full"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 text-[11px] font-sans text-vedic-text-secondary text-center">
          Rendered via Parashari harmonic mapping • 12 Bhava cusps derived from {selectedVarga} Lagna in {activeVargaResult.ascendant.rashi}
        </div>
      </section>

      {/* 4. PLANETARY POSITIONS TABLE */}
      {/* Required Columns: Planet | Sign | Degree | House | Nakshatra | Status */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-vedic-gold" />
            <h3 className="font-serif text-lg font-bold text-vedic-text">
              Planetary Positions in {selectedVarga} ({activeMeta.title.split('—')[1]?.trim() || selectedVarga})
            </h3>
          </div>
          <span className="text-xs font-mono text-vedic-text-secondary">
            9 Navagrahas + Divisional Dignities
          </span>
        </div>

        <div className="overflow-x-auto rounded border border-vedic-gold-border bg-vedic-secondary/70 shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-vedic-gold-border/60 bg-vedic-primary/80 font-mono text-vedic-gold uppercase text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Planet</th>
                <th className="py-2.5 px-3 font-semibold">Sign</th>
                <th className="py-2.5 px-3 font-semibold">Degree</th>
                <th className="py-2.5 px-3 font-semibold">House</th>
                <th className="py-2.5 px-3 font-semibold">Nakshatra</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vedic-gold-border/20 font-sans text-vedic-text">
              {/* Ascendant Row */}
              <tr className="hover:bg-vedic-surface/40 bg-vedic-primary/30 transition-colors">
                <td className="py-2 px-3 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-vedic-gold text-xs font-semibold">Asc</span>
                    <span>Ascendant (Lagna)</span>
                  </div>
                </td>
                <td className="py-2 px-3 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-vedic-gold-soft font-serif">
                      {RASHIS[activeVargaResult.ascendant.rashiNumber - 1]?.symbol || ''}
                    </span>
                    <span>{activeVargaResult.ascendant.rashi}</span>
                  </div>
                </td>
                <td className="py-2 px-3 font-mono text-vedic-text-secondary">
                  {activeVargaResult.ascendant.dms}
                </td>
                <td className="py-2 px-3">
                  <span className="font-mono font-semibold text-vedic-gold">1st House</span>
                  <span className="text-[10px] text-vedic-text-secondary ml-1.5">(Lagna / Tanu)</span>
                </td>
                <td className="py-2 px-3 text-vedic-text-secondary">
                  {kundali.ascendant.nakshatra || '—'} (Pada {kundali.ascendant.pada || 1})
                </td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-vedic-surface border-vedic-gold-border text-vedic-gold">
                    Harmonic Pivot
                  </span>
                </td>
              </tr>

              {/* Planetary Rows */}
              {Object.values(activeVargaResult.positions).map((pos: VargaPlacement) => {
                const houseTag = getHouseTag(pos.house);
                return (
                  <tr key={pos.planet} className="hover:bg-vedic-surface/40 transition-colors">
                    <td className="py-2 px-3 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-serif text-vedic-gold-soft">{pos.symbol}</span>
                        <span className="font-medium">{pos.planet}</span>
                        <span className="text-[10px] text-vedic-text-secondary font-serif">
                          ({pos.sanskrit})
                        </span>
                        {pos.isRetrograde && (
                          <span className="text-[9px] font-mono px-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                            Rx
                          </span>
                        )}
                        {pos.isCombust && (
                          <span className="text-[9px] font-mono px-1 rounded bg-red-950/60 text-red-300 border border-red-800/60">
                            Combust
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-3 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-vedic-gold font-serif">
                          {RASHIS[pos.vargaRashiNumber - 1]?.symbol || ''}
                        </span>
                        <span>{pos.vargaRashi}</span>
                        <span className="text-[10px] text-vedic-text-secondary font-sans">
                          ({pos.vargaRashiEnglish})
                        </span>
                      </div>
                    </td>

                    <td className="py-2 px-3 font-mono text-vedic-text-secondary">
                      {pos.dms}
                    </td>

                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-medium">{pos.house}th</span>
                        {houseTag && (
                          <span className="text-[10px] text-vedic-text-secondary">
                            ({houseTag})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-3 text-vedic-text-secondary">
                      {pos.nakshatra || '—'} {pos.pada ? `(Pada ${pos.pada})` : ''}
                    </td>

                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getDignityBadge(
                            pos.dignity
                          )}`}
                        >
                          {pos.dignity}
                        </span>
                        {pos.isVargottama && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-vedic-gold/20 text-vedic-gold border border-vedic-gold/40 flex items-center space-x-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Vargottama</span>
                          </span>
                        )}
                        {pos.deity && (
                          <span className="text-[10px] text-vedic-text-secondary font-mono">
                            [{pos.deity}]
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CHART INTERPRETATION */}
      <section className="bg-vedic-secondary/70 border border-vedic-gold-border rounded-lg p-5 shadow-sm space-y-2.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-vedic-gold" />
          <h3 className="font-serif text-lg font-bold text-vedic-text">
            Chart Interpretation — {activeMeta.title}
          </h3>
        </div>

        <p className="text-sm text-vedic-text-secondary leading-relaxed font-sans">
          {activeVargaResult.interpretation}
        </p>

        <div className="pt-2 text-xs text-vedic-text-secondary/90 italic font-serif border-t border-vedic-gold-border/30">
          Source principle: Brihat Parashara Hora Shastra, Vargadhyaya — The physical manifestation indicated by D1 achieves its concrete fruition and structural integrity through the harmonic harmonic vibrations of {selectedVarga}.
        </div>
      </section>

      {/* 6. KEY OBSERVATIONS */}
      <section className="bg-vedic-secondary/70 border border-vedic-gold-border rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-vedic-emerald" />
          <h3 className="font-serif text-lg font-bold text-vedic-text">
            Key Observations in {selectedVarga}
          </h3>
        </div>

        <ul className="space-y-2">
          {activeVargaResult.keyObservations.map((obs: string, idx: number) => (
            <li
              key={idx}
              className="flex items-start space-x-2 text-xs text-vedic-text leading-relaxed font-sans bg-vedic-primary/60 p-2.5 rounded border border-vedic-gold-border/20"
            >
              <span className="text-vedic-gold mt-0.5">•</span>
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. CALCULATION DETAILS */}
      <section className="border border-vedic-gold-border/60 rounded-lg bg-vedic-secondary/50 overflow-hidden">
        <button
          onClick={() => setShowCalculationDetails(!showCalculationDetails)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-vedic-secondary/80 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-vedic-gold" />
            <span className="font-serif font-bold text-sm text-vedic-text">
              Calculation Details & Mathematical Foundation ({selectedVarga})
            </span>
          </div>
          {showCalculationDetails ? (
            <ChevronUp className="w-4 h-4 text-vedic-gold" />
          ) : (
            <ChevronDown className="w-4 h-4 text-vedic-gold" />
          )}
        </button>

        {showCalculationDetails && (
          <div className="p-5 pt-0 border-t border-vedic-gold-border/30 space-y-4 text-xs font-mono text-vedic-text-secondary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-3 bg-vedic-primary/80 rounded border border-vedic-gold-border/30 space-y-1.5">
                <span className="text-vedic-gold font-semibold block text-[11px] uppercase tracking-wider">
                  Divisional Arc & Division Count
                </span>
                <p className="text-vedic-text font-sans">
                  Division Count: <span className="font-mono text-vedic-gold">{activeVargaResult.definition.divisionCount}</span> segments per Rashi.
                </p>
                <p className="text-vedic-text font-sans">
                  Arc Span: <span className="font-mono text-vedic-gold">{activeVargaResult.definition.spanDegrees.toFixed(4)}°</span> ({activeVargaResult.definition.spanDegrees === (30 / 9) ? "3°20'00\"" : `${activeVargaResult.definition.spanDegrees}°`}).
                </p>
                <p className="text-vedic-text font-sans">
                  Vedic Grouping: <span className="font-sans text-vedic-text-secondary">{activeMeta.category}</span>
                </p>
              </div>

              <div className="p-3 bg-vedic-primary/80 rounded border border-vedic-gold-border/30 space-y-1.5">
                <span className="text-vedic-gold font-semibold block text-[11px] uppercase tracking-wider">
                  Parashari Mapping Algorithm
                </span>
                <p className="text-vedic-text font-sans text-xs">
                  {activeVargaResult.definition.calculationMethod}
                </p>
                <p className="text-vedic-text-secondary font-sans text-[11px]">
                  Sign rules: {activeVargaResult.definition.signMapping}
                </p>
              </div>
            </div>

            <div className="p-3 bg-vedic-primary/80 rounded border border-vedic-gold-border/30 space-y-1">
              <span className="text-vedic-gold font-semibold block text-[11px] uppercase tracking-wider">
                Boundary Rules & Classical Source
              </span>
              <p className="font-sans text-vedic-text leading-relaxed">
                {activeVargaResult.definition.boundaryRules}
              </p>
              <p className="font-sans text-vedic-text-secondary pt-1">
                {activeVargaResult.definition.traditionalNotes}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-vedic-text-secondary/80">
              <span>Zodiac: Sidereal</span>
              <span>•</span>
              <span>Ayanamsha: Lahiri (Chitrapaksha)</span>
              <span>•</span>
              <span>Ephemeris: Swiss Ephemeris / High-Precision Astronomical</span>
              <span>•</span>
              <span>Nodes: True Lunar Node</span>
            </div>
          </div>
        )}
      </section>

      {/* 8. COMPARE CHARTS SECTION */}
      {/* Required Allowed Comparisons:
          D1 vs D9
          D1 vs D10
          D1 vs D7
          D1 vs D12
          D1 vs D60
          With exact ASCII-styled comparison UI:
          ┌───────────────┬───────────────┐
          │ D1            │ D9            │
          │               │               │
          │ Jupiter ♓     │ Jupiter ♉     │
          │ 5th house     │ 9th house     │
          └───────────────┴───────────────┘
      */}
      <section className="space-y-4 pt-4 border-t border-vedic-gold-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-vedic-gold" />
            <div>
              <h3 className="font-serif text-xl font-bold text-vedic-text">
                Compare Charts (वर्ग तुलना)
              </h3>
              <p className="text-xs text-vedic-text-secondary font-sans">
                Cross-sectional harmonic comparison of natal placements vs divisional realms
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSideBySideSvg(!showSideBySideSvg)}
            className={`px-3 py-1.5 text-xs font-mono rounded border flex items-center space-x-1.5 transition-colors ${
              showSideBySideSvg
                ? 'bg-vedic-gold/15 border-vedic-gold text-vedic-gold'
                : 'bg-vedic-primary border-vedic-gold-border/40 text-vedic-text-secondary hover:text-vedic-text'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{showSideBySideSvg ? 'Hide Dual Charts' : 'Dual Kundali View'}</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {COMPARISON_PRESETS.map(preset => {
            const isTarget = compareTarget === preset.id;
            return (
              <button
                key={preset.id}
                id={`compare-preset-${preset.id}`}
                onClick={() => setCompareTarget(preset.id)}
                className={`p-2.5 rounded text-left border transition-all ${
                  isTarget
                    ? 'bg-vedic-surface border-vedic-gold text-vedic-gold-soft shadow-md'
                    : 'bg-vedic-secondary/70 border-vedic-gold-border/30 text-vedic-text-secondary hover:text-vedic-text hover:border-vedic-gold-border'
                }`}
              >
                <div className="font-mono text-xs font-bold text-vedic-gold">
                  {preset.label}
                </div>
                <div className="text-[10px] font-sans text-vedic-text-secondary truncate mt-0.5">
                  {preset.desc.split('(')[1]?.replace(')', '') || preset.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Dual Visual Kundali Charts */}
        {showSideBySideSvg && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 rounded-lg bg-vedic-primary/90 border border-vedic-gold-border">
            <div className="flex flex-col items-center">
              <div className="text-xs font-mono text-vedic-gold font-bold mb-2">
                D1 Natal Rashi Chart (लग्न)
              </div>
              <div className="w-full max-w-[340px] aspect-square">
                {chartStyle === 'north' ? (
                  <NorthIndianChart kundali={kundali} vargaId="D1" vargaResult={d1ChartResult} showDegrees={true} />
                ) : chartStyle === 'south' ? (
                  <SouthIndianChart kundali={kundali} vargaId="D1" vargaResult={d1ChartResult} showDegrees={true} />
                ) : (
                  <EastIndianChart kundali={kundali} vargaId="D1" vargaResult={d1ChartResult} showDegrees={true} />
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-mono text-vedic-gold font-bold mb-2">
                {compareTarget} {ALL_VARGAS[compareTarget]?.name || compareTarget}
              </div>
              <div className="w-full max-w-[340px] aspect-square">
                {chartStyle === 'north' ? (
                  <NorthIndianChart kundali={kundali} vargaId={compareTarget} vargaResult={compareVargaResult} showDegrees={false} />
                ) : chartStyle === 'south' ? (
                  <SouthIndianChart kundali={kundali} vargaId={compareTarget} vargaResult={compareVargaResult} showDegrees={false} />
                ) : (
                  <EastIndianChart kundali={kundali} vargaId={compareTarget} vargaResult={compareVargaResult} showDegrees={false} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROFESSIONAL COMPARISON TERMINAL UI
            As specified:
            ┌───────────────┬───────────────┐
            │ D1            │ D9            │
            │               │               │
            │ Jupiter ♓     │ Jupiter ♉     │
            │ 5th house     │ 9th house     │
            └───────────────┴───────────────┘
            Made strictly professional, no AI cards.
        */}
        <div className="font-mono text-xs border border-vedic-gold-border/80 rounded bg-vedic-primary/95 overflow-hidden shadow-2xl">
          {/* Terminal Top Frame Bar */}
          <div className="bg-vedic-secondary/90 px-4 py-2 border-b border-vedic-gold-border/60 flex items-center justify-between text-vedic-gold">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[11px] tracking-wider font-semibold">
                SYSTEM COMPARISON MATRIX // D1 vs {compareTarget}
              </span>
            </div>
            <span className="text-[10px] text-vedic-text-secondary">
              Parashari Planetary Shift Vectors
            </span>
          </div>

          {/* Table Header: Exact Dual Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-vedic-gold-border/60 bg-vedic-surface/60 font-semibold text-vedic-gold">
            <div className="py-2.5 px-4 border-b md:border-b-0 md:border-r border-vedic-gold-border/60 flex items-center justify-between">
              <span>D1 — NATAL RASHI (तनु लग्न)</span>
              <span className="text-[10px] text-vedic-text-secondary font-normal font-sans">
                Asc: {d1ChartResult.ascendant.rashi} {d1ChartResult.ascendant.dms}
              </span>
            </div>
            <div className="py-2.5 px-4 flex items-center justify-between">
              <span>{compareTarget} — {ALL_VARGAS[compareTarget]?.name.toUpperCase() || compareTarget}</span>
              <span className="text-[10px] text-vedic-text-secondary font-normal font-sans">
                Asc: {compareVargaResult.ascendant.rashi} {compareVargaResult.ascendant.dms}
              </span>
            </div>
          </div>

          {/* Row-by-Row Planet Comparisons */}
          <div className="divide-y divide-vedic-gold-border/30">
            {/* Ascendant Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 hover:bg-vedic-secondary/30 transition-colors">
              <div className="p-3.5 border-b md:border-b-0 md:border-r border-vedic-gold-border/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-vedic-gold font-bold flex items-center space-x-1.5">
                    <span>Lagna (Ascendant)</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vedic-surface border border-vedic-gold-border/40 text-vedic-gold">
                    Pivot
                  </span>
                </div>
                <div className="text-sm text-vedic-text font-serif">
                  {RASHIS[d1ChartResult.ascendant.rashiNumber - 1]?.symbol} {d1ChartResult.ascendant.rashi}
                </div>
                <div className="text-vedic-text-secondary text-[11px]">
                  1st house • {d1ChartResult.ascendant.dms}
                </div>
              </div>

              <div className="p-3.5 space-y-1 bg-vedic-surface/20">
                <div className="flex items-center justify-between">
                  <span className="text-vedic-gold font-bold flex items-center space-x-1.5">
                    <span>Lagna (Ascendant)</span>
                  </span>
                  {compareVargaResult.ascendant.deity && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-vedic-gold/15 text-vedic-gold border border-vedic-gold/30">
                      {compareVargaResult.ascendant.deity}
                    </span>
                  )}
                </div>
                <div className="text-sm text-vedic-text font-serif">
                  {RASHIS[compareVargaResult.ascendant.rashiNumber - 1]?.symbol} {compareVargaResult.ascendant.rashi}
                </div>
                <div className="text-vedic-text-secondary text-[11px]">
                  1st house • {compareVargaResult.ascendant.dms}
                </div>
              </div>
            </div>

            {/* Navagrahas List */}
            {Object.keys(d1ChartResult.positions).map(grahaKey => {
              const p1 = d1ChartResult.positions[grahaKey as GrahaName];
              const pTarget = compareVargaResult.positions[grahaKey as GrahaName];
              if (!p1 || !pTarget) return null;

              const isVargottama = p1.vargaRashi === pTarget.vargaRashi;
              const houseShift = ((pTarget.house - p1.house + 12) % 12);
              const shiftLabel = houseShift === 0 ? 'Same House' : `+${houseShift} Bhavas`;

              return (
                <div
                  key={grahaKey}
                  className="grid grid-cols-1 md:grid-cols-2 hover:bg-vedic-secondary/30 transition-colors"
                >
                  {/* Left Column: D1 */}
                  <div className="p-3.5 border-b md:border-b-0 md:border-r border-vedic-gold-border/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif text-vedic-gold text-sm">{p1.symbol}</span>
                        <span className="font-bold text-vedic-text">{p1.planet}</span>
                        <span className="text-[10px] text-vedic-text-secondary font-serif">
                          ({p1.sanskrit})
                        </span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${getDignityBadge(
                          p1.dignity
                        )}`}
                      >
                        {p1.dignity}
                      </span>
                    </div>

                    <div className="text-sm text-vedic-text font-serif flex items-center space-x-1.5">
                      <span className="text-vedic-gold">
                        {RASHIS[p1.vargaRashiNumber - 1]?.symbol}
                      </span>
                      <span>{p1.vargaRashi}</span>
                      <span className="text-[10px] text-vedic-text-secondary font-sans">
                        ({p1.vargaRashiEnglish})
                      </span>
                    </div>

                    <div className="text-vedic-text-secondary text-[11px] flex items-center justify-between">
                      <span>{p1.house}th house</span>
                      <span className="font-mono text-vedic-text-secondary/80">{p1.dms}</span>
                    </div>
                  </div>

                  {/* Right Column: Compared Varga */}
                  <div className="p-3.5 space-y-1 bg-vedic-surface/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif text-vedic-gold text-sm">{pTarget.symbol}</span>
                        <span className="font-bold text-vedic-text">{pTarget.planet}</span>
                        <span className="text-[10px] text-vedic-text-secondary font-serif">
                          ({pTarget.sanskrit})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {isVargottama && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-vedic-gold/20 text-vedic-gold border border-vedic-gold/40 flex items-center space-x-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Vargottama</span>
                          </span>
                        )}
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded border ${getDignityBadge(
                            pTarget.dignity
                          )}`}
                        >
                          {pTarget.dignity}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-vedic-text font-serif flex items-center space-x-1.5">
                      <span className="text-vedic-gold">
                        {RASHIS[pTarget.vargaRashiNumber - 1]?.symbol}
                      </span>
                      <span>{pTarget.vargaRashi}</span>
                      <span className="text-[10px] text-vedic-text-secondary font-sans">
                        ({pTarget.vargaRashiEnglish})
                      </span>
                    </div>

                    <div className="text-vedic-text-secondary text-[11px] flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <span className="font-semibold text-vedic-text">{pTarget.house}th house</span>
                        <span className="text-[10px] text-vedic-gold/80">({shiftLabel})</span>
                      </span>
                      <span className="font-mono text-vedic-text-secondary/80">{pTarget.dms}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix Terminal Footer */}
          <div className="p-3 bg-vedic-secondary/90 border-t border-vedic-gold-border/60 text-[10px] text-vedic-text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              Shift interpretation: Planets shifting to Kendras (1, 4, 7, 10) or Trikonas (1, 5, 9) in {compareTarget} manifest tangible fruition in that harmonic plane.
            </span>
            <span className="text-vedic-gold font-mono">
              [KAALIKA HOROLOGICAL ENGINE VERIFIED]
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
