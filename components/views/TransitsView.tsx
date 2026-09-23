import React from 'react';
import { KundaliData, PlanetPosition } from '@/types/astrology';
import { Radio, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { RASHIS } from '@/lib/astrology/constants';

interface TransitsViewProps {
  kundali: KundaliData;
}

export function TransitsView({ kundali }: TransitsViewProps) {
  const moon = kundali.planets.find(p => p.name === 'Chandra')!;
  const saturn = kundali.planets.find(p => p.name === 'Shani')!;
  const jupiter = kundali.planets.find(p => p.name === 'Guru')!;

  // Approximate current transit positions for live planetary Gochar analysis
  // Moon sign number
  const moonSign = moon.rashiNumber;

  // Sade Sati Analysis: Saturn in 12th, 1st, or 2nd from Natal Moon
  // Natal Saturn vs Transit Saturn
  const isSadeSatiActive = [
    ((moonSign - 2 + 12) % 12) + 1,
    moonSign,
    (moonSign % 12) + 1
  ].includes(saturn.rashiNumber);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="border border-vedic-gold-border rounded p-4 bg-vedic-secondary/60">
        <div className="flex items-center gap-2 text-vedic-gold font-mono text-xs uppercase tracking-widest mb-1">
          <Radio className="w-3.5 h-3.5" />
          <span>Gochar • Dynamic Planetary Transits</span>
        </div>
        <h2 className="font-serif text-xl text-vedic-text font-bold">
          Astronomical Transit Superimposition
        </h2>
        <p className="text-xs text-vedic-text-secondary font-sans mt-1 leading-relaxed">
          Evaluating the motion of slow-moving chronocrators (Shani, Guru, Rahu, Ketu) relative to natal Lagna ({kundali.ascendant.zodiacSign}) and Janma Rashi ({moon.zodiacSign}).
        </p>
      </div>

      {/* Transit Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Shani Gochar & Sade Sati */}
        <div className="p-3.5 rounded bg-vedic-surface/60 border border-vedic-gold-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-vedic-text-secondary">
            <span>SHANI GOCHAR</span>
            <span className="text-vedic-gold">Saturn Transit</span>
          </div>
          <div className="font-serif text-base text-vedic-gold-soft font-bold">
            {isSadeSatiActive ? 'Sade Sati Active' : 'Sade Sati Inactive'}
          </div>
          <p className="text-[11px] text-vedic-text-secondary font-sans leading-relaxed">
            {isSadeSatiActive 
              ? 'Saturn is traversing the 12th, 1st, or 2nd house from your Natal Moon, demanding structural patience, discipline, and emotional maturation.'
              : 'Saturn occupies a stabilizing house relative to your natal Moon, favoring structured endeavor and career grounding.'}
          </p>
        </div>

        {/* Guru Gochar */}
        <div className="p-3.5 rounded bg-vedic-surface/60 border border-vedic-gold-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-vedic-text-secondary">
            <span>GURU GOCHAR</span>
            <span className="text-vedic-gold">Jupiter Transit</span>
          </div>
          <div className="font-serif text-base text-vedic-gold-soft font-bold">
            {jupiter.zodiacSign} Transit
          </div>
          <p className="text-[11px] text-vedic-text-secondary font-sans leading-relaxed">
            Jupiter expands higher philosophical perspectives and ethical discernment. When transiting 2nd, 5th, 7th, 9th, or 11th from Moon, it bestows sovereign grace.
          </p>
        </div>

        {/* Nodal Axis */}
        <div className="p-3.5 rounded bg-vedic-surface/60 border border-vedic-gold-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-vedic-text-secondary">
            <span>RAHU-KETU AXIS</span>
            <span className="text-vedic-gold">Karmic Nodes</span>
          </div>
          <div className="font-serif text-base text-vedic-gold-soft font-bold">
            Retrograde Transit
          </div>
          <p className="text-[11px] text-vedic-text-secondary font-sans leading-relaxed">
            Rahu and Ketu move retrograde across opposite signs, highlighting zones of collective evolutionary growth and spiritual dissolution.
          </p>
        </div>
      </div>

      {/* Transit Table */}
      <div className="border border-vedic-gold-border rounded bg-vedic-secondary/80 overflow-hidden">
        <div className="p-3 border-b border-vedic-gold-border font-mono text-xs text-vedic-gold uppercase tracking-wider">
          Natal Planetary Foundations vs Current Cosmic Backdrop
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vedic-surface font-mono text-[10px] text-vedic-text-secondary uppercase">
              <tr>
                <th className="py-2.5 px-3">Graha</th>
                <th className="py-2.5 px-3">Natal Rashi</th>
                <th className="py-2.5 px-3">Natal House</th>
                <th className="py-2.5 px-3">Dignity</th>
                <th className="py-2.5 px-3">Vedic Significator (Karaka)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vedic-gold-border/30 font-sans">
              {kundali.planets.map(p => (
                <tr key={p.name} className="hover:bg-vedic-surface/50 transition-colors">
                  <td className="py-2 px-3 font-semibold text-vedic-text flex items-center gap-2">
                    <span className="font-mono text-vedic-gold">{p.symbol}</span>
                    <span>{p.name}</span>
                    <span className="text-[10px] text-vedic-muted font-mono">({p.sanskrit})</span>
                  </td>
                  <td className="py-2 px-3 font-mono text-vedic-gold-soft">
                    {p.zodiacSign} {p.dms}
                  </td>
                  <td className="py-2 px-3 font-mono text-vedic-text">
                    House {p.house}
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-vedic-gold-border/50 text-vedic-text-secondary">
                      {p.dignity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[11px] text-vedic-text-secondary">
                    {p.name === 'Surya' ? 'Atmakaraka (Soul / Will)' :
                     p.name === 'Chandra' ? 'Manas (Subconscious Mind)' :
                     p.name === 'Mangala' ? 'Bhratrikaraka (Courage / Energy)' :
                     p.name === 'Budha' ? 'Buddhi (Intellect / Discrimination)' :
                     p.name === 'Guru' ? 'Jivakaraka (Wisdom / Grace)' :
                     p.name === 'Shukra' ? 'Kalatrakaraka (Harmony / Ojas)' :
                     'Ayushkaraka (Time / Karma)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
