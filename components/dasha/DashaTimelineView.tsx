'use client';

import React, { useState } from 'react';
import { ChartData, TraditionalGraha } from '@/types/astrology';
import { calculatePrecisionVimshottari, resolveActiveDasha, VimshottariTimeline } from '@/lib/dasha/precision-vimshottari';
import { connectActiveDasha, ConnectedDashaReport } from '@/lib/dasha/dasha-connector';
import { Clock, Calendar, ChevronRight, ChevronDown, Compass, Award, AlertCircle, Sparkles } from 'lucide-react';

interface DashaTimelineViewProps {
  chart: ChartData;
  birthDate?: string;
}

export function DashaTimelineView({ chart, birthDate = '1995-10-24T08:30:00Z' }: DashaTimelineViewProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [expandedMd, setExpandedMd] = useState<string | null>(null);
  const [expandedAd, setExpandedAd] = useState<string | null>(null);

  const bDate = new Date(birthDate);
  const moonPlanet = chart.planets.find(
    p => p.planet === 'Moon' || p.name === 'Chandra' || p.name === 'Moon' || p.planet === 'Chandra'
  );
  const moonLon = moonPlanet?.siderealLongitude ?? 
    (moonPlanet ? (moonPlanet.rashiNumber - 1) * 30 + moonPlanet.degree + moonPlanet.minutes / 60 : undefined);

  if (moonLon === undefined) {
    throw new Error('Critical error: Moon position not found in chart planets for Vimshottari Dasha calculation.');
  }

  // Calculate full timeline
  const timeline: VimshottariTimeline = React.useMemo(() => {
    return calculatePrecisionVimshottari(new Date(birthDate), moonLon);
  }, [birthDate, moonLon]);

  // Target date resolution
  const activeState = React.useMemo(() => {
    return resolveActiveDasha(timeline, new Date(selectedDateStr + 'T12:00:00Z'));
  }, [timeline, selectedDateStr]);

  const connectedReport: ConnectedDashaReport | null = React.useMemo(() => {
    if (!activeState) return null;
    return connectActiveDasha(activeState, chart);
  }, [activeState, chart]);

  const toggleMd = (planet: string) => {
    setExpandedMd(prev => (prev === planet ? null : planet));
  };

  const toggleAd = (id: string) => {
    setExpandedAd(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-fade-in text-vedic-text">
      {/* Header & Date Controller */}
      <div className="bg-vedic-surface/70 border border-vedic-gold/20 rounded-lg p-5 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-vedic-gold text-xs font-mono tracking-widest uppercase mb-1">
            <Clock className="w-3.5 h-3.5" />
            Vedic Vimshottari Chronometry
          </div>
          <h2 className="font-serif text-2xl font-bold text-vedic-text tracking-wide">
            Dasha Mahadasha Timeline
          </h2>
          <p className="text-xs text-vedic-muted mt-0.5">
            Astronomically calculated 120-year cycle derived from Moon’s natal nakshatra degree with zero artificial approximations.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-vedic-bg/90 border border-vedic-gold/30 rounded px-3 py-2">
          <Calendar className="w-4 h-4 text-vedic-gold" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-vedic-muted uppercase tracking-wider">Inspect Dasha For Date</span>
            <input
              type="date"
              value={selectedDateStr}
              onChange={e => setSelectedDateStr(e.target.value)}
              className="bg-transparent text-xs font-mono text-vedic-gold focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Birth Balance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-vedic-surface/50 border border-vedic-gold/15 rounded p-3.5">
          <span className="text-[10px] font-mono text-vedic-muted uppercase block">Birth Nakshatra</span>
          <span className="font-serif text-sm font-semibold text-vedic-text">{timeline.balanceAtBirth.nakshatraName}</span>
          <span className="text-[11px] font-mono text-vedic-gold block">Lord: {timeline.balanceAtBirth.nakshatraLord}</span>
        </div>
        <div className="bg-vedic-surface/50 border border-vedic-gold/15 rounded p-3.5">
          <span className="text-[10px] font-mono text-vedic-muted uppercase block">Starting Mahadasha</span>
          <span className="font-serif text-sm font-semibold text-vedic-text">{timeline.balanceAtBirth.startingLord}</span>
          <span className="text-[11px] font-mono text-vedic-muted block">1st cycle at birth</span>
        </div>
        <div className="bg-vedic-surface/50 border border-vedic-gold/15 rounded p-3.5">
          <span className="text-[10px] font-mono text-vedic-muted uppercase block">Nakshatra Degree Elapsed</span>
          <span className="font-mono text-sm font-semibold text-vedic-text">
            {timeline.balanceAtBirth.degreeInNakshatra.toFixed(2)}° / 13.33°
          </span>
          <span className="text-[11px] font-mono text-vedic-gold block">
            {(timeline.balanceAtBirth.fractionElapsed * 100).toFixed(1)}% traversed
          </span>
        </div>
        <div className="bg-vedic-surface/50 border border-vedic-gold/15 rounded p-3.5">
          <span className="text-[10px] font-mono text-vedic-muted uppercase block">Exact Balance at Birth</span>
          <span className="font-mono text-sm font-semibold text-vedic-gold">
            {timeline.balanceAtBirth.balanceYears}y {timeline.balanceAtBirth.balanceMonths}m {timeline.balanceAtBirth.balanceDays}d
          </span>
          <span className="text-[11px] font-mono text-vedic-muted block">Remaining span</span>
        </div>
      </div>

      {/* Active Period & Cross-Harmonic Connection (D1, D9, D10) */}
      {connectedReport && (
        <div className="bg-vedic-surface/80 border border-vedic-gold/30 rounded-lg p-5 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-vedic-gold/15 gap-2">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Operational Period as of {selectedDateStr}
              </span>
              <h3 className="font-serif text-xl font-bold text-vedic-gold mt-0.5">
                {connectedReport.periodTheme}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-vedic-muted block text-[10px]">MD PROGRESS</span>
                <span className="text-vedic-gold">{connectedReport.activeState.mdProgressPercent}%</span>
              </div>
              <div className="w-24 bg-vedic-bg rounded-full h-1.5 overflow-hidden border border-vedic-gold/20">
                <div
                  className="bg-vedic-gold h-full rounded-full transition-all"
                  style={{ width: `${connectedReport.activeState.mdProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Three Lords Harmonic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[connectedReport.mdLordConnection, connectedReport.adLordConnection, connectedReport.pdLordConnection].map(conn => (
              <div key={conn.level} className="bg-vedic-bg/80 border border-vedic-gold/20 rounded p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-vedic-gold/10">
                  <div>
                    <span className="text-[10px] font-mono text-vedic-muted uppercase tracking-wider block">{conn.level}</span>
                    <span className="font-serif text-base font-bold text-vedic-gold">{conn.planet}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-vedic-gold/30 bg-vedic-surface text-vedic-text">
                    {conn.d1.dignity}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-vedic-surface/60 rounded p-1.5">
                    <span className="text-[9px] font-mono text-vedic-muted block">D1 RASHI</span>
                    <span className="font-semibold text-vedic-text">{conn.d1.sign}</span>
                    <span className="text-[10px] text-vedic-gold block">H{conn.d1.house}</span>
                  </div>
                  <div className="bg-vedic-surface/60 rounded p-1.5">
                    <span className="text-[9px] font-mono text-vedic-muted block">D9 NAVAMSHA</span>
                    <span className="font-semibold text-vedic-text">{conn.d9.sign}</span>
                    <span className="text-[10px] text-vedic-gold block">
                      {conn.d9.isVargottama ? '★ Vargottama' : `H${conn.d9.house}`}
                    </span>
                  </div>
                  <div className="bg-vedic-surface/60 rounded p-1.5">
                    <span className="text-[9px] font-mono text-vedic-muted block">D10 DASAMSHA</span>
                    <span className="font-semibold text-vedic-text">{conn.d10.sign}</span>
                    <span className="text-[10px] text-vedic-gold block">H{conn.d10.house}</span>
                  </div>
                </div>

                <div className="text-[11px] text-vedic-muted space-y-1">
                  <div className="flex items-center gap-1.5 text-vedic-text">
                    <Award className="w-3 h-3 text-vedic-gold shrink-0" />
                    <span>{conn.functionalRole.summary}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-vedic-muted/90 italic">
                    {conn.synthesisNotes}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dasha Synthesis Focus Points */}
          <div className="bg-vedic-surface/40 border border-vedic-gold/15 rounded p-3.5 space-y-2">
            <span className="text-[10px] font-mono text-vedic-gold uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Epistemic Period Delineation
            </span>
            <ul className="space-y-1.5 text-xs text-vedic-text/90">
              {connectedReport.astrologicalFocus.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-vedic-gold mt-0.5">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Interactive Hierarchical Timeline Tree */}
      <div className="bg-vedic-surface/60 border border-vedic-gold/20 rounded-lg p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-vedic-gold/15">
          <div>
            <h3 className="font-serif text-lg font-bold text-vedic-text">
              120-Year Vimshottari Tree (MD → AD → PD)
            </h3>
            <p className="text-xs text-vedic-muted">
              Click any Mahadasha to inspect all 9 Antardashas, and any Antardasha to inspect Pratyantardashas.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {timeline.mahadashas.map(md => {
            const isMdOpen = expandedMd === md.planet;
            const isMdActiveNow = activeState?.mahadasha.planet === md.planet;

            return (
              <div
                key={md.planet}
                className={`border rounded-lg transition-all ${
                  isMdActiveNow
                    ? 'border-vedic-gold bg-vedic-surface/90 shadow-md'
                    : 'border-vedic-gold/15 bg-vedic-bg/60 hover:border-vedic-gold/30'
                }`}
              >
                {/* Mahadasha Row */}
                <div
                  onClick={() => toggleMd(md.planet)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-vedic-gold">
                      {isMdOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-vedic-text">{md.planet} Mahadasha</span>
                        {isMdActiveNow && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-vedic-muted">
                        {md.startDate} → {md.endDate} ({md.durationYears} Years)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-xs font-mono text-vedic-gold">
                      {md.antardashas.length} Antardashas
                    </span>
                  </div>
                </div>

                {/* Sub-Periods: Antardasha Accordion */}
                {isMdOpen && (
                  <div className="p-3.5 pt-0 border-t border-vedic-gold/10 space-y-2 bg-vedic-bg/40">
                    <div className="text-[10px] font-mono text-vedic-muted uppercase tracking-wider pt-2">
                      Antardashas under {md.planet} Mahadasha
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {md.antardashas.map(ad => {
                        const adKey = `${md.planet}-${ad.planet}`;
                        const isAdOpen = expandedAd === adKey;
                        const isAdActiveNow = activeState?.antardasha.planet === ad.planet && isMdActiveNow;

                        return (
                          <div
                            key={ad.planet}
                            className={`border rounded p-2.5 transition-all text-xs ${
                              isAdActiveNow
                                ? 'border-vedic-gold bg-vedic-surface text-vedic-text'
                                : 'border-vedic-gold/15 bg-vedic-bg/80 hover:border-vedic-gold/30'
                            }`}
                          >
                            <div
                              onClick={() => toggleAd(adKey)}
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="font-medium">
                                <span className="font-serif text-vedic-gold">{ad.planet}</span>
                                {isAdActiveNow && <span className="ml-1 text-[9px] text-emerald-400">●</span>}
                              </div>
                              <span className="text-[10px] font-mono text-vedic-muted">
                                {ad.durationDays} days
                              </span>
                            </div>

                            <div className="text-[10px] font-mono text-vedic-muted/80 mt-1">
                              {ad.startDate} → {ad.endDate}
                            </div>

                            {/* Pratyantardasha dropdown */}
                            {isAdOpen && (
                              <div className="mt-2 pt-2 border-t border-vedic-gold/10 space-y-1">
                                <span className="text-[9px] font-mono text-vedic-gold block">
                                  Pratyantardashas (PD)
                                </span>
                                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                                  {ad.pratyantardashas.map(pd => (
                                    <div
                                      key={pd.planet}
                                      className="flex items-center justify-between text-[10px] font-mono py-0.5 text-vedic-text/80 border-b border-vedic-gold/5"
                                    >
                                      <span>{pd.planet}</span>
                                      <span className="text-vedic-muted">{pd.startDate}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
