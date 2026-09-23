import React from 'react';
import { CalculationSettings, NormalizedBirthData } from '@/types/astrology';
import { X, Compass, Clock, Globe, ShieldCheck, Cpu } from 'lucide-react';
import { formatDMS } from '@/lib/astrology/coordinates';

interface CalculationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalculationSettings;
  normalized: NormalizedBirthData;
  ayanamshaValue?: number;
  julianDay?: number;
  lmstHours?: number;
}

export function CalculationDetailsModal({
  isOpen,
  onClose,
  settings,
  normalized,
  ayanamshaValue = 24.175,
  julianDay = 2451545.0,
  lmstHours = 14.5,
}: CalculationDetailsModalProps) {
  if (!isOpen) return null;

  const formatHours = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.floor((h - hh) * 60);
    const ss = Math.round(((h - hh) * 60 - mm) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  const detailsList = [
    {
      label: 'Ephemeris Engine',
      value: settings.ephemeris,
      sub: 'Zero-LLM deterministic VSOP87/ELP2000 astronomical integration',
      icon: <Cpu className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'Ayanamsha System',
      value: `${settings.ayanamsha} (${formatDMS(ayanamshaValue)})`,
      sub: 'Official Indian Astronomical Ephemeris Standard (Chitra-Paksha)',
      icon: <Compass className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'Lunar Node Calculation (Rahu/Ketu)',
      value: `${settings.nodeType.toUpperCase()} Node`,
      sub: settings.nodeType === 'true' ? 'Oscillating perturbed astronomical lunar node' : 'Mean smoothed ascending node',
      icon: <Globe className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'House / Bhava System',
      value: settings.houseSystem.replace('-', ' ').toUpperCase(),
      sub: 'Parashari traditional Whole Sign / Equal house division',
      icon: <ShieldCheck className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'Geographic Coordinates',
      value: `${normalized.latitude.toFixed(4)}° N, ${normalized.longitude.toFixed(4)}° E`,
      sub: normalized.resolvedPlace.name,
      icon: <Globe className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'Astronomical Timezone & Offset',
      value: `${normalized.timezone} (UTC ${normalized.utcOffset >= 0 ? '+' : ''}${normalized.utcOffset}h)`,
      sub: normalized.isHistoricalOffsetApplied 
        ? normalized.historicalOffsetNote || 'Historical offset applied'
        : 'Standard Indian Standard Time (82.5° E meridian)',
      icon: <Clock className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'Epoch & Sidereal Times',
      value: `JD ${julianDay.toFixed(5)} • LMST ${formatHours(lmstHours)}`,
      sub: `UTC Timestamp: ${normalized.birthUTC}`,
      icon: <Clock className="w-4 h-4 text-vedic-gold" />,
    },
    {
      label: 'Engine Architecture Version',
      value: `Kaalika v${settings.calculationVersion}`,
      sub: 'Strict reproducibility: Same input + same settings = identical output',
      icon: <ShieldCheck className="w-4 h-4 text-vedic-gold" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-vedic-bg border border-vedic-gold-border rounded-md shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-vedic-gold-border">
          <div>
            <h3 className="font-serif text-lg font-bold text-vedic-text tracking-wide flex items-center gap-2">
              <Compass className="w-5 h-5 text-vedic-gold" />
              Astronomical Calculation Details
            </h3>
            <p className="text-xs text-vedic-text-secondary font-sans mt-0.5">
              Transparent celestial assumptions, coordinate ephemeris, and validation audit.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-vedic-text-secondary hover:text-vedic-text hover:bg-vedic-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {detailsList.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded bg-vedic-secondary/80 border border-vedic-gold-border/60 hover:border-vedic-gold-border transition-colors space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-vedic-text-secondary">
                <span>{item.label}</span>
                {item.icon}
              </div>
              <div className="text-sm font-semibold text-vedic-gold-soft font-mono">
                {item.value}
              </div>
              <p className="text-[10.5px] text-vedic-text-secondary font-sans leading-tight">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Audit Guarantee Note */}
        <div className="p-3 rounded bg-vedic-surface/70 border border-vedic-gold-border text-xs text-vedic-text-secondary font-sans space-y-1">
          <span className="font-mono text-[10px] text-vedic-gold uppercase font-bold tracking-wider block">
            Mathematical Reproducibility Guarantee
          </span>
          <p className="leading-relaxed text-[11px]">
            All planetary coordinates, house cusps, and harmonic divisions in Kaalika are computed using continuous orbital dynamics. No AI model or statistical approximation is ever permitted to alter or interpolate astronomical figures.
          </p>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-semibold rounded bg-vedic-gold text-vedic-bg hover:bg-vedic-gold-soft transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
