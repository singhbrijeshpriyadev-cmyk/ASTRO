'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { CalculationSettings } from '@/types/astrology';
import { motionTokens } from '@/lib/motion/animationTokens';

interface ChartSettingsCardProps {
  settings: CalculationSettings;
  chartStyle: 'north' | 'south' | 'east';
}

export function ChartSettingsCard({ settings, chartStyle }: ChartSettingsCardProps) {
  const rows = [
    { label: 'CHART STYLE', value: `${chartStyle.toUpperCase()} INDIAN` },
    { label: 'HOUSE SYSTEM', value: settings.houseSystem.toUpperCase() },
    { label: 'AYANAMSHA', value: settings.ayanamsha },
    { label: 'NODE TYPE', value: settings.nodeType === 'true' ? 'True (Oscillating)' : 'Mean' },
    { label: 'ZODIAC', value: settings.zodiac.toUpperCase() },
    { label: 'EPHEMERIS', value: 'VSOP87 / ELP2000' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.46, ease: motionTokens.ease.standard }}
      whileHover={{ y: -2 }}
      className="liquid-glass-card p-5 space-y-4 select-none hover:border-[rgba(212,175,55,0.38)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.50)] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <h2 className="font-serif text-base font-bold text-[#F5F4EC] tracking-wide">
            Chart Settings
          </h2>
          <span className="text-[10px] font-mono text-[#AABDB7] uppercase tracking-wider">
            Active Parameters
          </span>
        </div>
        <div className="w-6 h-6 rounded-md bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#AABDB7]">
          <Settings className="w-3.5 h-3.5 text-[#AABDB7]" />
        </div>
      </div>

      {/* Rows with Thin Separators */}
      <div className="space-y-2.5 text-xs font-mono divide-y divide-[rgba(255,255,255,0.04)]">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex items-center justify-between gap-3 ${i > 0 ? 'pt-2.5' : ''}`}>
            <span className="text-[9.5px] uppercase text-[#AABDB7] tracking-wider font-semibold">
              {r.label}
            </span>
            <span className="text-[#F5F4EC] font-medium text-right truncate max-w-[170px]">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
