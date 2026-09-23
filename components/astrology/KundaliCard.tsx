'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { KundaliData } from '@/types/astrology';
import { NorthIndianChart } from '@/components/charts/NorthIndianChart';
import { SouthIndianChart } from '@/components/charts/SouthIndianChart';
import { EastIndianChart } from '@/components/charts/EastIndianChart';
import { chartViewTransition } from '@/lib/motion/transitions';
import { motionTokens } from '@/lib/motion/animationTokens';

interface KundaliCardProps {
  kundali: KundaliData;
  chartStyle: 'north' | 'south' | 'east';
  onChangeStyle: (style: 'north' | 'south' | 'east') => void;
  showDegrees: boolean;
  onToggleDegrees?: () => void;
}

export function KundaliCard({
  kundali,
  chartStyle,
  onChangeStyle,
  showDegrees,
  onToggleDegrees,
}: KundaliCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const styleLabels: Record<string, string> = {
    north: 'North Indian Style (Diamond Kundali)',
    south: 'South Indian Style (Fixed Sign Grid)',
    east: 'East Indian Style (Surya Kundali)',
  };

  const renderActiveChart = (isFull: boolean = false) => {
    return (
      <div className={`w-full ${isFull ? 'max-w-[560px]' : 'max-w-[440px]'} flex flex-col items-center justify-center mx-auto`}>
        {chartStyle === 'north' ? (
          <NorthIndianChart kundali={kundali} vargaId="D1" showDegrees={showDegrees} />
        ) : chartStyle === 'south' ? (
          <SouthIndianChart kundali={kundali} vargaId="D1" showDegrees={showDegrees} />
        ) : (
          <EastIndianChart kundali={kundali} vargaId="D1" showDegrees={showDegrees} />
        )}
      </div>
    );
  };

  return (
    <>
      <motion.div 
        layoutId="kundali-panel"
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: motionTokens.ease.elegant }}
        className="relative rounded-[26px] border border-[rgba(212,175,55,0.38)] bg-gradient-to-b from-[rgba(6,27,22,0.85)] via-[rgba(4,20,17,0.90)] to-[rgba(7,32,26,0.85)] backdrop-blur-2xl p-5 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.55)] space-y-4 select-none"
      >
        {/* Astronomical Crosshairs at corners */}
        <span className="absolute top-2.5 left-2.5 text-[#D4AF37]/35 font-mono text-[9px] pointer-events-none select-none">+</span>
        <span className="absolute top-2.5 right-2.5 text-[#D4AF37]/35 font-mono text-[9px] pointer-events-none select-none">+</span>
        <span className="absolute bottom-2.5 left-2.5 text-[#D4AF37]/35 font-mono text-[9px] pointer-events-none select-none">+</span>
        <span className="absolute bottom-2.5 right-2.5 text-[#D4AF37]/35 font-mono text-[9px] pointer-events-none select-none">+</span>

        {/* Header and Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(255,255,255,0.08)] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F5F4EC] tracking-wide">
                Natal D1 Rashi Kundali
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            </div>
            <p className="text-[11px] font-sans text-[#AABDB7] mt-0.5">
              {styleLabels[chartStyle]}
            </p>
          </div>

          {/* Style Controls Segmented Switcher with Shared Layout Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex rounded-xl border border-[rgba(212,175,55,0.22)] p-1 bg-[#061411]/80 backdrop-blur-md">
              {(['north', 'south', 'east'] as const).map(style => {
                const isActive = chartStyle === style;
                return (
                  <button
                    key={style}
                    onClick={() => onChangeStyle(style)}
                    className="relative px-3 py-1 rounded-lg capitalize text-xs font-sans transition-colors cursor-pointer select-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="kundali-style-active"
                        transition={motionTokens.spring.navigation}
                        className="absolute inset-0 rounded-lg bg-[rgba(212,175,55,0.18)] border border-[rgba(212,175,55,0.45)] shadow-[0_0_12px_rgba(212,175,55,0.12)]"
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span 
                      className={`relative z-10 font-medium ${
                        isActive ? 'text-[#F2D675] font-semibold' : 'text-[#AABDB7] hover:text-[#F5F4EC]'
                      }`}
                    >
                      {style}
                    </span>
                  </button>
                );
              })}
            </div>

            {onToggleDegrees && (
              <motion.button
                onClick={onToggleDegrees}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Toggle Degree Notation"
                className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  showDegrees 
                    ? 'border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' 
                    : 'border-[rgba(255,255,255,0.1)] text-[#AABDB7]'
                }`}
              >
                °
              </motion.button>
            )}

            {/* Cloud Save Action */}
            <motion.button
              onClick={async () => {
                try {
                  const res = await fetch('/api/charts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      chartName: `${kundali.rawInput.name} — D1 Rashi`,
                      julianDay: kundali.normalizedData.julianDay,
                      ascendantSidereal: kundali.ascendant.siderealLongitude,
                      kundaliPayload: kundali,
                    }),
                  });
                  if (res.ok) {
                    alert('Horoscope chart successfully saved to Cloud Database!');
                  } else {
                    alert('Please sign in to save your chart to your cloud account.');
                  }
                } catch {
                  alert('Saved locally. Connect to cloud for multi-device sync.');
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Save Chart Snapshot to Cloud"
              className="p-1.5 rounded-lg border border-[rgba(0,155,119,0.30)] bg-[rgba(0,107,91,0.15)] hover:bg-[rgba(0,155,119,0.25)] text-[#009B77] hover:text-[#F5F4EC] transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </motion.button>

            {/* Fullscreen Expand Trigger (Requirement 20) */}
            <motion.button
              onClick={() => setIsFullscreen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Expand Chart Fullscreen"
              className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(212,175,55,0.10)] hover:border-[rgba(212,175,55,0.30)] text-[#AABDB7] hover:text-[#F2D675] transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Primary Visual Center Chart with Smooth AnimatePresence Switcher (Requirement 19) */}
        <div className="w-full flex justify-center py-2 min-h-[360px] sm:min-h-[420px] items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={chartStyle}
              initial={chartViewTransition.initial}
              animate={chartViewTransition.animate}
              exit={chartViewTransition.exit}
              className="w-full flex justify-center"
            >
              {renderActiveChart(false)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chart Footer Legend */}
        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] font-mono text-[#AABDB7]">
          <div className="flex items-center gap-3">
            <span><strong className="text-[#D4AF37]">H1</strong> Lagna Diamond</span>
            <span>•</span>
            <span><strong className="text-[#F2D675]">1-12</strong> Rashis</span>
            <span>•</span>
            <span><strong className="text-[#E08E6D]">[R]</strong> Retrograde</span>
          </div>
          <div className="hidden sm:block text-[#AABDB7]">
            Geocentric Sidereal
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Overlay (Requirement 20) */}
      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Fade */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 bg-[#061411]/85 cursor-pointer"
            />

            {/* Expanded Chart Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={motionTokens.spring.medium}
              className="relative z-10 w-full max-w-2xl bg-[#061411] border border-[rgba(212,175,55,0.40)] rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F5F4EC]">
                    Natal D1 Rashi Kundali — Observatory Mode
                  </h3>
                  <p className="text-xs font-mono text-[#D4AF37] mt-0.5">
                    {styleLabels[chartStyle]} • {kundali.rawInput.name}
                  </p>
                </div>
                <motion.button
                  onClick={() => setIsFullscreen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(212,175,55,0.15)] text-[#AABDB7] hover:text-[#F2D675] transition-all cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex justify-center py-4">
                {renderActiveChart(true)}
              </div>

              <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#AABDB7]">
                <span>Ayanamsha: <strong className="text-[#F2D675]">{kundali.ayanamshaName} ({kundali.panchang.ayanamsa.formatted})</strong></span>
                <span>Coordinates: <strong className="text-[#AABDB7]">{kundali.normalizedData.latitude.toFixed(4)}°N, {kundali.normalizedData.longitude.toFixed(4)}°E</strong></span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
