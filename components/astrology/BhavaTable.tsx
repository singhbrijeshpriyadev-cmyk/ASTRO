import React from 'react';
import { HousePosition } from '@/types/astrology';

interface BhavaTableProps {
  bhavas: HousePosition[];
  className?: string;
}

export function BhavaTable({ bhavas, className = '' }: BhavaTableProps) {
  return (
    <div className={`overflow-x-auto rounded border border-vedic-gold-border bg-vedic-secondary/80 ${className}`}>
      <table className="w-full text-left text-xs">
        <thead className="bg-vedic-surface border-b border-vedic-gold-border font-mono text-[10px] text-vedic-text-secondary uppercase tracking-wider">
          <tr>
            <th className="py-2.5 px-3">House (भाव)</th>
            <th className="py-2.5 px-3">Rashi (Sign)</th>
            <th className="py-2.5 px-3">Cusp Degree</th>
            <th className="py-2.5 px-3">House Lord (भावेश)</th>
            <th className="py-2.5 px-3">Occupants</th>
            <th className="py-2.5 px-3">Core Vedic Significances (कारकत्व)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-vedic-gold-border/20 font-sans">
          {bhavas.map(b => (
            <tr key={b.houseNumber} className="hover:bg-vedic-surface/50 transition-colors">
              <td className="py-2 px-3 font-mono font-bold text-vedic-gold">
                House {b.houseNumber}
              </td>
              <td className="py-2 px-3">
                <span className="font-medium text-vedic-text">{b.zodiacSign}</span>
                <span className="text-[10px] text-vedic-muted font-mono ml-1.5">(#{b.rashiNumber})</span>
              </td>
              <td className="py-2 px-3 font-mono text-vedic-gold-soft">
                {b.dms}
              </td>
              <td className="py-2 px-3 font-serif text-vedic-text">
                {b.lord}
              </td>
              <td className="py-2 px-3">
                {b.occupants.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {b.occupants.map(p => (
                      <span
                        key={p}
                        className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-vedic-surface text-vedic-gold-soft border border-vedic-gold-border/40"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-vedic-muted font-mono text-[11px]">—</span>
                )}
              </td>
              <td className="py-2 px-3 text-[11px] text-vedic-text-secondary">
                {b.significances.slice(0, 4).join(' • ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
