import React from 'react';

export interface ChartControlsProps {
  chartStyle: 'north' | 'south' | 'east';
  onStyleChange: (style: 'north' | 'south' | 'east') => void;
  showDegrees: boolean;
  onToggleDegrees: () => void;
  activeVarga: string;
  onVargaChange: (varga: string) => void;
  onOpenDetails?: () => void;
}

export function ChartControls({
  chartStyle,
  onStyleChange,
  showDegrees,
  onToggleDegrees,
  activeVarga,
  onVargaChange,
  onOpenDetails,
}: ChartControlsProps) {
  const vargas = [
    { id: 'D1', label: 'D1 Rashi' },
    { id: 'D9', label: 'D9 Navamsha' },
    { id: 'D10', label: 'D10 Dashamsha' },
    { id: 'D3', label: 'D3 Drekkana' },
    { id: 'D7', label: 'D7 Saptamsha' },
    { id: 'D12', label: 'D12 Dwadashamsha' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-vedic-secondary border border-vedic-gold-border rounded mb-4">
      {/* Varga Selector Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {vargas.map(v => (
          <button
            key={v.id}
            onClick={() => onVargaChange(v.id)}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
              activeVarga === v.id
                ? 'bg-vedic-gold text-vedic-bg font-bold shadow-sm'
                : 'text-vedic-text-secondary hover:text-vedic-text hover:bg-vedic-surface'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Style & Display Options */}
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded border border-vedic-gold-border p-0.5 bg-vedic-surface">
          {(['north', 'south', 'east'] as const).map(style => (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                chartStyle === style
                  ? 'bg-vedic-gold/20 text-vedic-gold-soft font-semibold'
                  : 'text-vedic-text-secondary hover:text-vedic-text'
              }`}
            >
              {style} Indian
            </button>
          ))}
        </div>

        <button
          onClick={onToggleDegrees}
          className="px-2 py-1 text-xs font-mono rounded border border-vedic-gold-border text-vedic-gold-soft hover:bg-vedic-surface transition-colors"
        >
          {showDegrees ? 'Hide Deg' : 'Show Deg'}
        </button>

        {onOpenDetails && (
          <button
            onClick={onOpenDetails}
            className="px-2 py-1 text-xs font-mono rounded border border-vedic-gold-border bg-vedic-surface text-vedic-gold hover:bg-vedic-gold/10 transition-colors"
          >
            Calculation Details
          </button>
        )}
      </div>
    </div>
  );
}
