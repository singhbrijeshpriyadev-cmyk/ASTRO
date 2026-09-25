'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KundaliData, GrahaName, RashiName } from '@/types/astrology';
import { VargaChartResult } from '@/lib/varga/types';
import { Sparkles } from 'lucide-react';

interface SouthIndianChartProps {
  kundali: KundaliData;
  vargaId?: string;
  vargaResult?: VargaChartResult;
  showDegrees?: boolean;
  className?: string;
}

const GRAHA_LABEL_COLOR: Record<string, string> = {
  Surya: '#F2D675',
  Chandra: '#F5F4EC',
  Mangala: '#E08E6D',
  Budha: '#009B77',
  Guru: '#D4AF37',
  Shukra: '#EAE5D9',
  Shani: '#AABDB7',
  Rahu: '#8FA39E',
  Ketu: '#8FA39E',
};

const RASHI_DATA: Record<number, { sanskrit: string; english: string; lord: string; element: string }> = {
  1: { sanskrit: 'Mesha (मेष)', english: 'Aries', lord: 'Mangala', element: 'Fire' },
  2: { sanskrit: 'Vrishabha (वृषभ)', english: 'Taurus', lord: 'Shukra', element: 'Earth' },
  3: { sanskrit: 'Mithuna (मिथुन)', english: 'Gemini', lord: 'Budha', element: 'Air' },
  4: { sanskrit: 'Karka (कर्क)', english: 'Cancer', lord: 'Chandra', element: 'Water' },
  5: { sanskrit: 'Simha (सिंह)', english: 'Leo', lord: 'Surya', element: 'Fire' },
  6: { sanskrit: 'Kanya (कन्या)', english: 'Virgo', lord: 'Budha', element: 'Earth' },
  7: { sanskrit: 'Tula (तुला)', english: 'Libra', lord: 'Shukra', element: 'Air' },
  8: { sanskrit: 'Vrishchika (वृश्चिक)', english: 'Scorpio', lord: 'Mangala', element: 'Water' },
  9: { sanskrit: 'Dhanu (धनु)', english: 'Sagittarius', lord: 'Guru', element: 'Fire' },
  10: { sanskrit: 'Makara (मकर)', english: 'Capricorn', lord: 'Shani', element: 'Earth' },
  11: { sanskrit: 'Kumbha (कुम्भ)', english: 'Aquarius', lord: 'Shani', element: 'Air' },
  12: { sanskrit: 'Meena (मीन)', english: 'Pisces', lord: 'Guru', element: 'Water' },
};

export function SouthIndianChart({
  kundali,
  vargaId = 'D1',
  vargaResult,
  showDegrees = true,
  className = '',
}: SouthIndianChartProps) {
  const [hoveredRashi, setHoveredRashi] = useState<number | null>(null);

  const varga = kundali.vargas ? (kundali.vargas[vargaId] || kundali.vargas['D1']) : undefined;
  const ascRashiNumber = vargaResult
    ? vargaResult.ascendant.rashiNumber
    : varga
    ? varga.ascendant.rashiNumber
    : kundali.ascendant.rashiNumber;

  const SIGN_GRID: Record<number, { row: number; col: number; name: RashiName; short: string }> = {
    12: { row: 0, col: 0, name: 'Meena', short: 'Mee' },
    1:  { row: 0, col: 1, name: 'Mesha', short: 'Mes' },
    2:  { row: 0, col: 2, name: 'Vrishabha', short: 'Vri' },
    3:  { row: 0, col: 3, name: 'Mithuna', short: 'Mit' },
    4:  { row: 1, col: 3, name: 'Karka', short: 'Kar' },
    5:  { row: 2, col: 3, name: 'Simha', short: 'Sim' },
    6:  { row: 3, col: 3, name: 'Kanya', short: 'Kan' },
    7:  { row: 3, col: 2, name: 'Tula', short: 'Tul' },
    8:  { row: 3, col: 1, name: 'Vrishchika', short: 'Vrk' },
    9:  { row: 3, col: 0, name: 'Dhanu', short: 'Dha' },
    10: { row: 2, col: 0, name: 'Makara', short: 'Mak' },
    11: { row: 1, col: 0, name: 'Kumbha', short: 'Kum' },
  };

  const rashiPlanets: Record<number, Array<{
    name: GrahaName;
    shortLabel: string;
    dms: string;
    isRetrograde: boolean;
  }>> = {};

  for (let i = 1; i <= 12; i++) {
    rashiPlanets[i] = [];
  }

  const planetSource = kundali.chartData?.planets || kundali.planets;
  planetSource.forEach(p => {
    let rNum = p.rashiNumber;
    let dmsStr = vargaId === 'D1'
      ? `${p.degree}°${String(p.minutes).padStart(2, '0')}'`
      : `${Math.floor(varga?.positions?.[p.name]?.degreeInRashi || 0)}°`;

    if (vargaResult) {
      const vPos = vargaResult.positions[p.name] || vargaResult.positions[p.planet as GrahaName];
      if (vPos) {
        rNum = vPos.vargaRashiNumber;
        dmsStr = `${Math.floor(vPos.vargaDegree !== undefined ? vPos.vargaDegree : vPos.sourceDegreeInRashi || 0)}°`;
      }
    } else if (vargaId !== 'D1' && varga?.positions?.[p.name]) {
      rNum = varga.positions[p.name].rashiNumber;
      dmsStr = `${Math.floor(varga.positions[p.name]?.degreeInRashi || 0)}°`;
    }

    if (rNum >= 1 && rNum <= 12) {
      rashiPlanets[rNum].push({
        name: p.name,
        shortLabel: p.name.slice(0, 2),
        dms: dmsStr,
        isRetrograde: p.isRetrograde,
      });
    }
  });

  const cellSize = 95;
  const offset = 10;

  const activeRashiData = hoveredRashi ? RASHI_DATA[hoveredRashi] : null;
  const activeOccupants = hoveredRashi ? rashiPlanets[hoveredRashi] : [];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="w-full max-w-[430px] aspect-square relative select-none group">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="southGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="southNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="lagnaCellGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#009B77" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#006B5B" stopOpacity="0.06" />
            </radialGradient>
            <radialGradient id="hoverCellGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Deep Base */}
          <rect width="400" height="400" fill="#061411" rx="8" />
          <rect x="5" y="5" width="390" height="390" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.35" />

          {/* Central 2x2 Sacred Observatory Chamber */}
          <rect
            x={offset + cellSize}
            y={offset + cellSize}
            width={cellSize * 2}
            height={cellSize * 2}
            fill="#0B211B"
            stroke="#D4AF37"
            strokeWidth="1.2"
            opacity="0.6"
            filter="url(#southGoldGlow)"
          />

          {/* Rotating Sacred Astrolabe Mandala in Center Chamber */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '200px 200px' }}
            opacity={0.16}
          >
            <circle cx="200" cy="200" r="68" fill="none" stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="3 4" />
            <circle cx="200" cy="200" r="42" fill="none" stroke="#009B77" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="200" cy="200" r="22" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
          </motion.g>

          {/* Central Sacred Ripples */}
          <circle
            cx="200"
            cy="200"
            r="4"
            fill="none"
            stroke="#F2D675"
            className="bindu-ripple-ring pointer-events-none"
          />
          <circle
            cx="200"
            cy="200"
            r="4"
            fill="none"
            stroke="#D4AF37"
            className="bindu-ripple-ring-delayed pointer-events-none"
          />

          {/* Central Chamber Typography */}
          <text
            x="200"
            y="185"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#F2D675"
            fontFamily="Cinzel, Georgia, serif"
            fontSize="15"
            fontWeight="bold"
            letterSpacing="2"
            filter="url(#southGoldGlow)"
          >
            {vargaResult?.definition.name || varga?.name || vargaId}
          </text>
          <text
            x="200"
            y="210"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#009B77"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            fontWeight="bold"
          >
            {vargaResult?.definition.sanskritName || varga?.sanskritName || ''}
          </text>
          <text
            x="200"
            y="228"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#AABDB7"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
          >
            FIXED PERIMETER
          </text>

          {/* 12 Outer Rashi Cells */}
          {Object.entries(SIGN_GRID).map(([rashiStr, pos]) => {
            const rNum = parseInt(rashiStr, 10);
            const x = offset + pos.col * cellSize;
            const y = offset + pos.row * cellSize;
            const isLagna = rNum === ascRashiNumber;
            const isHovered = hoveredRashi === rNum;
            const planets = rashiPlanets[rNum] || [];

            let cellFill = 'rgba(7, 25, 20, 0.40)';
            if (isHovered) {
              cellFill = 'url(#hoverCellGlow)';
            } else if (isLagna) {
              cellFill = 'url(#lagnaCellGlow)';
            }

            return (
              <g 
                key={`south-rashi-${rNum}`}
                onMouseEnter={() => setHoveredRashi(rNum)}
                onMouseLeave={() => setHoveredRashi(null)}
                className="cursor-pointer transition-all duration-300"
              >
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={cellFill}
                  stroke={isHovered ? '#F2D675' : isLagna ? '#009B77' : 'rgba(212,175,55,0.25)'}
                  strokeWidth={isHovered ? 1.6 : isLagna ? 1.2 : 0.7}
                  filter={isHovered ? 'url(#southGoldGlow)' : undefined}
                  className="transition-all duration-300"
                />

                {isLagna && (
                  <>
                    <line
                      x1={x}
                      y1={y}
                      x2={x + cellSize}
                      y2={y + cellSize}
                      stroke="#009B77"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.65"
                    />
                    <text
                      x={x + 6}
                      y={y + 13}
                      fill="#009B77"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      ASC
                    </text>
                  </>
                )}

                <text
                  x={x + cellSize - 6}
                  y={y + 13}
                  textAnchor="end"
                  fill={isHovered ? '#F2D675' : isLagna ? '#009B77' : '#AABDB7'}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize={isHovered ? '9.5' : '8.5'}
                  fontWeight="bold"
                  filter={isHovered ? 'url(#southGoldGlow)' : undefined}
                >
                  {pos.short}
                </text>

                {/* Planets inside cell with living orbit nodes */}
                <g 
                  transform={`translate(${x + cellSize / 2}, ${y + 26})`}
                  className="transition-all duration-300"
                >
                  {planets.map((p, idx) => {
                    const yOffset = idx * 13;
                    const planetColor = GRAHA_LABEL_COLOR[p.name] || '#F5F4EC';

                    return (
                      <g key={p.name} transform={`translate(0, ${yOffset})`}>
                        <circle
                          cx="-16"
                          cy="0"
                          r={isHovered ? '2.6' : '2'}
                          fill={planetColor}
                          filter="url(#southNodeGlow)"
                          className="transition-all duration-200"
                        />
                        {isHovered && (
                          <circle
                            cx="-16"
                            cy="0"
                            r="4.5"
                            fill="none"
                            stroke={planetColor}
                            strokeWidth="0.5"
                            opacity="0.5"
                          />
                        )}
                        <text
                          x="-10"
                          y="0"
                          dominantBaseline="central"
                          fontFamily="Inter, system-ui, sans-serif"
                          fontSize={isHovered ? '9.5' : '9'}
                        >
                          <tspan fill={planetColor} fontWeight="bold">{p.shortLabel}</tspan>
                          {p.isRetrograde && <tspan fill="#E08E6D" fontSize="7.5" fontWeight="bold"> [R]</tspan>}
                          {showDegrees && (
                            <tspan fill={isHovered ? '#F5F4EC' : '#AABDB7'} fontSize="7.5" fontFamily="JetBrains Mono, monospace">
                              {' '}{p.dms}
                            </tspan>
                          )}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Telemetry Inspector Banner */}
      <div className="w-full max-w-[430px] mt-2.5 min-h-[48px] flex items-center justify-between px-3.5 py-2 rounded-xl bg-[rgba(11,33,27,0.65)] border border-[rgba(212,175,55,0.22)] shadow-sm text-xs font-mono">
        <AnimatePresence mode="wait">
          {hoveredRashi && activeRashiData ? (
            <motion.div
              key={`south-inspect-${hoveredRashi}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] font-bold text-[11px] flex-shrink-0">
                  Sign #{hoveredRashi}
                </span>
                <div className="min-w-0">
                  <div className="text-[#F5F4EC] font-semibold text-[11px] truncate">
                    {activeRashiData.sanskrit}
                  </div>
                  <div className="text-[10px] text-[#AABDB7] truncate">
                    Lord: <span className="text-[#F2D675]">{activeRashiData.lord}</span> • Element: {activeRashiData.element}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="text-[10px] text-[#009B77] font-semibold">
                  {activeOccupants.length > 0 
                    ? `${activeOccupants.map(o => o.name).join(', ')}` 
                    : 'Empty Sign'}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="south-default-inspector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full text-[11px] text-[#AABDB7] gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[#AABDB7] truncate">Hover any sign cell to inspect Rashi & planetary positions</span>
              </div>
              <span className="text-[#D4AF37] font-semibold text-[10px] flex-shrink-0 pl-2">
                {vargaResult?.definition.name || varga?.name || vargaId}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 mt-1.5 text-[10.5px] text-[#AABDB7] font-mono">
        <span className="flex items-center gap-1">
          <span className="text-[#009B77] font-bold">ASC</span> Ascendant Sign
        </span>
        <span>•</span>
        <span>South Indian (Fixed Perimeter Clockwise)</span>
      </div>
    </div>
  );
}
