import React from 'react';
import { PlanetPosition } from '@/types/astrology';

interface PlanetaryTableProps {
  planets: PlanetPosition[];
  ascendant: PlanetPosition;
  className?: string;
}

export function PlanetaryTable({ planets, ascendant, className = '' }: PlanetaryTableProps) {
  const allPositions = [ascendant, ...planets];

  const getDignityBadge = (dignity: string, isAsc: boolean) => {
    if (isAsc) {
      return (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-vedic-gold/15 text-vedic-gold-soft border border-vedic-gold-border">
          Lagna Cusp
        </span>
      );
    }
    switch (dignity) {
      case 'Exalted':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
            Exalted (उच्‍च)
          </span>
        );
      case 'Own Sign':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-vedic-gold/15 text-vedic-gold-soft border border-vedic-gold-border">
            Own Sign (स्वक्षेत्र)
          </span>
        );
      case 'Moolatrikona':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-vedic-gold/15 text-vedic-gold-soft border border-vedic-gold-border">
            Moolatrikona
          </span>
        );
      case 'Friend':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-vedic-text-secondary border border-vedic-gold-border/40">
            Friend
          </span>
        );
      case 'Debilitated':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/40">
            Debilitated (नीच)
          </span>
        );
      case 'Enemy':
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-vedic-text-secondary border border-vedic-gold-border/40">
            Enemy
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-vedic-muted border border-vedic-gold-border/20">
            Neutral
          </span>
        );
    }
  };

  return (
    <div className={`overflow-x-auto rounded border border-vedic-gold-border bg-vedic-secondary/80 ${className}`}>
      <table className="w-full text-left text-xs">
        <thead className="bg-vedic-surface border-b border-vedic-gold-border font-mono text-[10px] text-vedic-text-secondary uppercase tracking-wider">
          <tr>
            <th className="py-2.5 px-3">Graha (ग्रह)</th>
            <th className="py-2.5 px-3">Rashi (Sign)</th>
            <th className="py-2.5 px-3">Sidereal DMS</th>
            <th className="py-2.5 px-3">Nakshatra & Pada</th>
            <th className="py-2.5 px-3">House</th>
            <th className="py-2.5 px-3">Daily Motion</th>
            <th className="py-2.5 px-3">Dignity</th>
            <th className="py-2.5 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-vedic-gold-border/20 font-sans">
          {allPositions.map(p => {
            const isAsc = p.name === 'Surya' && p.englishName.includes('Ascendant');
            return (
              <tr
                key={isAsc ? 'Lagna' : p.name}
                className={`hover:bg-vedic-surface/60 transition-colors ${
                  isAsc ? 'bg-vedic-gold/5 font-medium' : ''
                }`}
              >
                {/* Planet Name */}
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="font-mono text-sm text-vedic-gold w-4 text-center">{p.symbol}</span>
                  <div>
                    <div className="font-serif text-vedic-text font-semibold tracking-wide">
                      {isAsc ? 'Lagna (Ascendant)' : p.name}
                    </div>
                    <div className="text-[10px] text-vedic-text-secondary font-mono">
                      {p.sanskrit} • {isAsc ? 'Ascendant' : p.englishName}
                    </div>
                  </div>
                </td>

                {/* Rashi */}
                <td className="py-2 px-3">
                  <div className="text-vedic-text font-medium">{p.zodiacSign || (p as any).rashi}</div>
                  <div className="text-[10px] text-vedic-muted font-mono">
                    {p.zodiacSignEnglish || (p as any).rashiEnglish} (#{p.rashiNumber})
                  </div>
                </td>

                {/* Degrees DMS */}
                <td className="py-2 px-3 font-mono text-vedic-gold-soft">
                  {p.dms}
                </td>

                {/* Nakshatra */}
                <td className="py-2 px-3">
                  <div className="text-vedic-text">{p.nakshatra}</div>
                  <div className="text-[10px] text-vedic-muted font-mono">
                    Pada {p.pada} • Lord {p.nakshatraLord}
                  </div>
                </td>

                {/* House */}
                <td className="py-2 px-3 font-mono">
                  <span className="text-vedic-gold font-bold">H{p.house}</span>
                </td>

                {/* Speed */}
                <td className="py-2 px-3 font-mono text-[11px] text-vedic-text-secondary">
                  {isAsc ? '—' : `${(p.speed ?? 0) > 0 ? '+' : ''}${(p.speed ?? 0).toFixed(2)}°/day`}
                </td>

                {/* Dignity */}
                <td className="py-2 px-3">
                  {getDignityBadge(p.dignity, isAsc)}
                </td>

                {/* Status Badges */}
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {p.isRetrograde && (
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-[#C86D46]/20 text-[#E08E6D] border border-[#C86D46]/30">
                        Rx
                      </span>
                    )}
                    {p.isCombust && (
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-amber-600/20 text-amber-300 border border-amber-500/30">
                        Combust
                      </span>
                    )}
                    {!p.isRetrograde && !p.isCombust && (
                      <span className="text-vedic-muted text-[10px] font-mono">Direct</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
