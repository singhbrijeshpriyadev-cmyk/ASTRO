import React from 'react';
import { KundaliData } from '@/types/astrology';
import { FileText, Printer } from 'lucide-react';
import { NorthIndianChart } from '../charts/NorthIndianChart';

interface ReportsViewProps {
  kundali: KundaliData;
}

export function ReportsView({ kundali }: ReportsViewProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const sun = kundali.planets.find(p => p.name === 'Surya')!;
  const moon = kundali.planets.find(p => p.name === 'Chandra')!;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between p-4 rounded bg-vedic-secondary/60 border border-vedic-gold-border">
        <div>
          <h2 className="font-serif text-lg font-bold text-vedic-text flex items-center gap-2">
            <FileText className="w-5 h-5 text-vedic-gold" />
            Executive Astrological Dossier
          </h2>
          <p className="text-xs text-vedic-text-secondary font-sans">
            Formal printed Vedic Kundali report generated under Indian Astronomical Ephemeris standards.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-vedic-surface border border-vedic-gold-border text-xs font-mono text-vedic-gold-soft hover:bg-vedic-gold/15 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="p-6 rounded bg-vedic-bg border border-vedic-gold-border space-y-6 print:border-none print:p-0">
        {/* Document Title Strip */}
        <div className="text-center pb-4 border-b border-vedic-gold-border space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-vedic-gold">
            कालिका • HOROSCOPE INSCRIPTION
          </div>
          <h1 className="font-serif text-2xl font-bold text-vedic-text tracking-wide uppercase">
            {kundali.rawInput.name}
          </h1>
          <p className="text-xs font-mono text-vedic-text-secondary">
            Born: {kundali.rawInput.birthLocalDate} at {kundali.rawInput.birthLocalTime} (LMT/IST) • {kundali.rawInput.birthPlace}
          </p>
          <p className="text-[10px] font-mono text-vedic-muted">
            Coordinates: {kundali.normalizedData.latitude.toFixed(4)}°N, {kundali.normalizedData.longitude.toFixed(4)}°E • UTC {kundali.normalizedData.utcOffset >= 0 ? '+' : ''}{kundali.normalizedData.utcOffset}h • JD {kundali.julianDay.toFixed(4)}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded bg-vedic-secondary/80 border border-vedic-gold-border/60">
            <span className="text-[9.5px] font-mono uppercase text-vedic-muted block">LAGNA (ASCENDANT)</span>
            <div className="font-serif text-sm font-bold text-vedic-gold-soft mt-1">{kundali.ascendant.zodiacSign}</div>
            <span className="text-[11px] font-mono text-vedic-text">{kundali.ascendant.dms}</span>
          </div>

          <div className="p-3 rounded bg-vedic-secondary/80 border border-vedic-gold-border/60">
            <span className="text-[9.5px] font-mono uppercase text-vedic-muted block">JANMA RASHI (MOON)</span>
            <div className="font-serif text-sm font-bold text-vedic-gold-soft mt-1">{moon.zodiacSign}</div>
            <span className="text-[11px] font-mono text-vedic-text">{moon.dms}</span>
          </div>

          <div className="p-3 rounded bg-vedic-secondary/80 border border-vedic-gold-border/60">
            <span className="text-[9.5px] font-mono uppercase text-vedic-muted block">NAKSHATRA & PADA</span>
            <div className="font-serif text-sm font-bold text-vedic-gold-soft mt-1">{kundali.panchang.nakshatra.name}</div>
            <span className="text-[11px] font-mono text-vedic-text">Pada {kundali.panchang.nakshatra.pada} (Lord {kundali.panchang.nakshatra.lord})</span>
          </div>

          <div className="p-3 rounded bg-vedic-secondary/80 border border-vedic-gold-border/60">
            <span className="text-[9.5px] font-mono uppercase text-vedic-muted block">SURYA RASHI (SUN)</span>
            <div className="font-serif text-sm font-bold text-vedic-gold-soft mt-1">{sun.zodiacSign}</div>
            <span className="text-[11px] font-mono text-vedic-text">{sun.dms}</span>
          </div>
        </div>

        {/* Center: D1 Rashi Chart Visual */}
        <div className="flex justify-center py-2">
          <NorthIndianChart kundali={kundali} vargaId="D1" showDegrees={true} />
        </div>

        {/* Astrological Planetary Inventory */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs uppercase text-vedic-gold tracking-wider">
            Planetary Longitudes & Dignities (D1 Rashi)
          </h3>
          <div className="border border-vedic-gold-border rounded overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-vedic-surface font-mono text-[10px] text-vedic-text-secondary uppercase">
                <tr>
                  <th className="py-2 px-3">Graha</th>
                  <th className="py-2 px-3">Sidereal Longitude</th>
                  <th className="py-2 px-3">Nakshatra (Pada)</th>
                  <th className="py-2 px-3">House</th>
                  <th className="py-2 px-3">Dignity</th>
                  <th className="py-2 px-3">Motion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vedic-gold-border/20">
                {kundali.planets.map(p => (
                  <tr key={p.name} className="hover:bg-vedic-surface/30">
                    <td className="py-1.5 px-3 font-semibold text-vedic-text">
                      {p.name} ({p.sanskrit})
                    </td>
                    <td className="py-1.5 px-3 font-mono text-vedic-gold-soft">
                      {p.zodiacSign} {p.dms}
                    </td>
                    <td className="py-1.5 px-3 text-vedic-text-secondary">
                      {p.nakshatra} (Pada {p.pada})
                    </td>
                    <td className="py-1.5 px-3 font-mono text-vedic-text">
                      H{p.house}
                    </td>
                    <td className="py-1.5 px-3 text-vedic-text-secondary">
                      {p.dignity}
                    </td>
                    <td className="py-1.5 px-3 font-mono text-[11px] text-vedic-muted">
                      {p.isRetrograde ? 'Retrograde [R]' : 'Direct'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yogas Inscription */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs uppercase text-vedic-gold tracking-wider">
            Detected Classical Vedic Yogas & Combinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {kundali.yogas.map((yoga, i) => (
              <div key={i} className="p-2.5 rounded bg-vedic-secondary/50 border border-vedic-gold-border/40 space-y-1">
                <div className="font-serif font-bold text-vedic-text flex items-center justify-between">
                  <span>{yoga.name} ({yoga.sanskritName})</span>
                  <span className="text-[10px] font-mono text-vedic-gold">{yoga.category}</span>
                </div>
                <p className="text-[11px] text-vedic-text-secondary font-sans leading-relaxed">
                  {yoga.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Astronomical Seal */}
        <div className="pt-4 border-t border-vedic-gold-border text-center text-[10px] font-mono text-vedic-muted space-y-0.5">
          <p>COMPUTED UNDER OFFICIAL INDIAN ASTRONOMICAL EPHEMERIS STANDARDS</p>
          <p>N.C. LAHIRI CHITRA-PAKSHA AYANAMSHA • VSOP87/ELP2000 PLANETARY THEORY</p>
        </div>
      </div>
    </div>
  );
}
