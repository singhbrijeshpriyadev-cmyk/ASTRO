import React, { useState } from 'react';
import { KundaliData } from '@/types/astrology';
import { Tabs } from '@/components/ui/tabs';
import { NorthIndianChart } from '../charts/NorthIndianChart';
import { SouthIndianChart } from '../charts/SouthIndianChart';
import { EastIndianChart } from '../charts/EastIndianChart';
import { ChartControls } from '../charts/ChartControls';
import { PanchangCard } from '../astrology/PanchangCard';
import { PlanetaryTable } from '../astrology/PlanetaryTable';
import { BhavaTable } from '../astrology/BhavaTable';
import { VargaGrid } from '../varga/VargaGrid';
import { TarotArchetypeShell } from '../tarot/TarotArchetypeShell';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BookOpen, Layers, Clock } from 'lucide-react';

interface KundaliDashboardProps {
  kundali: KundaliData;
  onOpenDetails?: () => void;
}

export function KundaliDashboard({ kundali, onOpenDetails }: KundaliDashboardProps) {
  const [activeTab, setActiveTab] = useState('chart');
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'east'>('north');
  const [showDegrees, setShowDegrees] = useState(true);
  const [activeVarga, setActiveVarga] = useState('D1');

  const tabItems = [
    { id: 'chart', label: 'Natal Kundali', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'ephemeris', label: 'Planets & Bhavas', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'vargas', label: 'Divisional Vargas', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'dashas', label: 'Vimshottari Dasha', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'yogas', label: 'Yogas & Doshas', count: kundali.yogas.length, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'tarot', label: 'Archetypes', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  const moon = kundali.planets.find(p => p.name === 'Chandra')!;
  const sun = kundali.planets.find(p => p.name === 'Surya')!;

  return (
    <div className="space-y-4">
      {/* Panchanga Observatory Strip */}
      <PanchangCard panchang={kundali.panchang} />

      {/* Main Tabs Navigation */}
      <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Natal Kundali */}
      {activeTab === 'chart' && (
        <div className="space-y-4">
          <ChartControls
            chartStyle={chartStyle}
            onStyleChange={setChartStyle}
            showDegrees={showDegrees}
            onToggleDegrees={() => setShowDegrees(!showDegrees)}
            activeVarga={activeVarga}
            onVargaChange={setActiveVarga}
            onOpenDetails={onOpenDetails}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 flex justify-center">
              <Card className="w-full flex flex-col items-center p-4 bg-vedic-secondary/70 border-vedic-gold-border">
                {chartStyle === 'north' ? (
                  <NorthIndianChart kundali={kundali} vargaId={activeVarga} showDegrees={showDegrees} />
                ) : chartStyle === 'south' ? (
                  <SouthIndianChart kundali={kundali} vargaId={activeVarga} showDegrees={showDegrees} />
                ) : (
                  <EastIndianChart kundali={kundali} vargaId={activeVarga} showDegrees={showDegrees} />
                )}
              </Card>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <Card className="bg-vedic-surface/70 border-vedic-gold-border">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-vedic-gold">
                    Primary Astrological Key
                  </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-vedic-secondary/80 border border-vedic-gold-border/40">
                    <span className="text-[10px] text-vedic-muted font-mono uppercase block">Lagna (Ascendant)</span>
                    <span className="font-serif font-bold text-vedic-text text-sm">{kundali.ascendant.zodiacSign}</span>
                    <span className="font-mono text-vedic-gold-soft block text-[11px]">{kundali.ascendant.dms}</span>
                  </div>
                  <div className="p-2.5 rounded bg-vedic-secondary/80 border border-vedic-gold-border/40">
                    <span className="text-[10px] text-vedic-muted font-mono uppercase block">Janma Rashi (Moon Sign)</span>
                    <span className="font-serif font-bold text-vedic-text text-sm">
                      {moon.zodiacSign}
                    </span>
                    <span className="font-mono text-vedic-gold-soft block text-[11px]">
                      {moon.dms}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-vedic-secondary/80 border border-vedic-gold-border/40">
                    <span className="text-[10px] text-vedic-muted font-mono uppercase block">Janma Nakshatra</span>
                    <span className="font-serif font-bold text-vedic-text text-sm">
                      {kundali.panchang.nakshatra.name}
                    </span>
                    <span className="font-mono text-vedic-gold-soft block text-[11px]">
                      Pada {kundali.panchang.nakshatra.pada} • Lord {kundali.panchang.nakshatra.lord}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-vedic-secondary/80 border border-vedic-gold-border/40">
                    <span className="text-[10px] text-vedic-muted font-mono uppercase block">Surya Rashi (Sun Sign)</span>
                    <span className="font-serif font-bold text-vedic-text text-sm">
                      {sun.zodiacSign}
                    </span>
                    <span className="font-mono text-vedic-gold-soft block text-[11px]">
                      {sun.dms}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Condensed Graha Snapshot */}
              <PlanetaryTable planets={kundali.planets.slice(0, 7)} ascendant={kundali.ascendant} />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planets & Bhavas */}
      {activeTab === 'ephemeris' && (
        <div className="space-y-4">
          <PlanetaryTable planets={kundali.planets} ascendant={kundali.ascendant} />
          <BhavaTable bhavas={kundali.bhavas} />
        </div>
      )}

      {/* Tab 3: Divisional Vargas */}
      {activeTab === 'vargas' && (
        <VargaGrid kundali={kundali} chartStyle={chartStyle === 'east' ? 'north' : chartStyle} />
      )}

      {/* Tab 4: Vimshottari Dashas */}
      {activeTab === 'dashas' && (
        <div className="space-y-3">
          <div className="p-4 rounded bg-vedic-secondary/70 border border-vedic-gold-border">
            <div className="font-serif text-lg font-bold text-vedic-text">
              Vimshottari Dasha Chronology (विंशोत्तरी महादशा)
            </div>
            <p className="text-xs text-vedic-text-secondary font-sans mt-0.5">
              120-year astronomical cycle initiated from natal Moon&apos;s degree in {kundali.panchang.nakshatra.name}
            </p>
          </div>

          <div className="space-y-2">
            {kundali.dashas.map((dasha, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded border transition-colors ${
                  dasha.isCurrent
                    ? 'border-vedic-gold bg-vedic-gold/10'
                    : 'border-vedic-gold-border/50 bg-vedic-secondary/70 hover:border-vedic-gold-border'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-vedic-text text-sm">
                      {dasha.planet} Mahadasha
                    </span>
                    <span className="text-xs font-mono text-vedic-gold">
                      ({dasha.durationYears} Years)
                    </span>
                    {dasha.isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-vedic-gold text-vedic-bg font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-vedic-text-secondary">
                    {dasha.startDate} → {dasha.endDate}
                  </div>
                </div>

                {dasha.subPeriods && (
                  <div className="mt-2.5 pt-2 border-t border-vedic-gold-border/30 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                    {dasha.subPeriods.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className={`p-1.5 rounded text-center text-[10px] font-mono border ${
                          sub.isCurrent
                            ? 'border-vedic-gold bg-vedic-gold/25 text-vedic-gold-soft font-bold'
                            : 'border-vedic-gold-border/30 bg-vedic-surface/60 text-vedic-text-secondary'
                        }`}
                      >
                        <div className="font-semibold text-vedic-text">{sub.planet.slice(0, 3)}</div>
                        <div className="text-[9px] text-vedic-muted truncate">{sub.startDate.slice(0, 7)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Yogas & Doshas */}
      {activeTab === 'yogas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {kundali.yogas.map((yoga, i) => {
            const isChallenging = yoga.beneficence === 'challenging';
            return (
              <div
                key={i}
                className={`p-4 rounded border ${
                  isChallenging
                    ? 'border-amber-700/40 bg-amber-950/20'
                    : 'border-vedic-gold-border bg-vedic-secondary/70'
                } space-y-2`}
              >
                <div className="flex items-center justify-between pb-1 border-b border-vedic-gold-border/30">
                  <span className="font-serif font-bold text-sm text-vedic-text">{yoga.name} ({yoga.sanskritName})</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-vedic-gold/15 text-vedic-gold-soft uppercase">
                    {yoga.category}
                  </span>
                </div>
                <p className="text-xs text-vedic-text-secondary font-sans leading-relaxed">
                  {yoga.description}
                </p>
                <div className="text-[11px] text-vedic-gold-soft font-sans bg-vedic-surface/60 p-2 rounded border border-vedic-gold-border/30">
                  <span className="font-mono text-[9.5px] text-vedic-muted block uppercase">Vedic Influence</span>
                  {yoga.effects}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 6: Archetypes */}
      {activeTab === 'tarot' && (
        <TarotArchetypeShell />
      )}
    </div>
  );
}
