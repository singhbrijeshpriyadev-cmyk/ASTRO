import React from 'react';
import { Compass, Clock, Globe } from 'lucide-react';
import { formatDMS } from '@/lib/astrology/coordinates';

interface ObservatoryHeaderProps {
  julianDay?: number;
  lstHours?: number;
  ayanamshaValue?: number;
  ayanamshaName?: string;
}

export function ObservatoryHeader({
  julianDay = 2460210.5,
  lstHours = 14.52,
  ayanamshaValue = 24.175,
  ayanamshaName = 'Lahiri',
}: ObservatoryHeaderProps) {
  const formatHours = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.floor((h - hh) * 60);
    const ss = Math.round(((h - hh) * 60 - mm) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-brass-500/20 bg-obsidian-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-brass-500/40 bg-obsidian-900 flex items-center justify-center text-brass-400 font-serif font-bold text-lg shadow-inner">
            काल
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg tracking-widest text-parchment-100 font-bold uppercase">
                Kaalika
              </h1>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-brass-500/10 text-brass-400 border border-brass-500/30">
                Observatory v1.0
              </span>
            </div>
            <p className="text-[10px] text-parchment-400 font-sans tracking-wide">
              Deterministic High-Precision Vedic Ephemeris
            </p>
          </div>
        </div>

        {/* Observatory Metrics Ticker */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] font-mono text-parchment-300">
          <div className="flex items-center gap-1.5" title="Julian Ephemeris Day Number">
            <Globe className="w-3.5 h-3.5 text-brass-400" />
            <span className="text-parchment-400 text-[10px]">JD:</span>
            <span className="text-brass-300">{julianDay.toFixed(4)}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Local Mean Sidereal Time">
            <Clock className="w-3.5 h-3.5 text-brass-400" />
            <span className="text-parchment-400 text-[10px]">LMST:</span>
            <span className="text-brass-300">{formatHours(lstHours)}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Sidereal Ayanamsha Value">
            <Compass className="w-3.5 h-3.5 text-brass-400" />
            <span className="text-parchment-400 text-[10px]">{ayanamshaName}:</span>
            <span className="text-brass-300">{formatDMS(ayanamshaValue)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
