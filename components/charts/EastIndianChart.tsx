'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KundaliData, GrahaName } from '@/types/astrology';
import { VargaChartResult } from '@/lib/varga/types';
import { Sparkles } from 'lucide-react';

interface EastIndianChartProps {
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

const SIGN_POLYGONS: Record<number, string> = {
  1: '200,8 296,104 200,200 104,104',
  2: '8,8 200,8 104,104',
  3: '8,8 104,104 8,200',
  4: '104,104 200,200 104,296 8,200',
  5: '8,200 104,296 8,392',
  6: '8,392 104,296 200,392',
  7: '200,200 296,296 200,392 104,296',
  8: '200,392 296,296 392,392',
  9: '392,392 296,296 392,200',
  10: '200,200 296,104 392,200 296,296',
  11: '392,200 296,104 392,8',
  12: '392,8 296,104 200,8',
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

export function EastIndianChart({
  kundali,
  vargaId = 'D1',
  vargaResult,
  showDegrees = true,
  className = '',
}: EastIndianChartProps) {
  const [hoveredSign, setHoveredSign] = useState<number | null>(null);

  const varga = kundali.vargas ? (kundali.vargas[vargaId] || kundali.vargas['D1']) : undefined;
  const ascRashi = vargaResult
    ? vargaResult.ascendant.rashiNumber
    : varga
    ? varga.ascendant.rashiNumber
    : kundali.ascendant.rashiNumber;

  const signPlanets: Record<number, Array<{
    name: GrahaName;
    shortLabel: string;
    dms: string;
    isRetrograde: boolean;
  }>> = {};

  for (let i = 1; i <= 12; i++) {
    signPlanets[i] = [];
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
      signPlanets[rNum].push({
        name: p.name,
        shortLabel: p.name.slice(0, 2),
        dms: dmsStr,
        isRetrograde: p.isRetrograde,
      });
    }
  });

  const SIGN_GEOMETRY: Record<number, { cx: number; cy: number; label: string }> = {
    1:  { cx: 200, cy: 125, label: 'Mes' },
    2:  { cx: 110, cy: 65,  label: 'Vri' },
    3:  { cx: 65,  cy: 110, label: 'Mit' },
    4:  { cx: 125, cy: 200, label: 'Kar' },
    5:  { cx: 65,  cy: 290, label: 'Sim' },
    6:  { cx: 110, cy: 335, label: 'Kan' },
    7:  { cx: 200, cy: 275, label: 'Tul' },
    8:  { cx: 290, cy: 335, label: 'Vrk' },
    9:  { cx: 335, cy: 290, label: 'Dha' },
    10: { cx: 275, cy: 200, label: 'Mak' },
    11: { cx: 335, cy: 110, label: 'Kum' },
    12: { cx: 290, cy: 65,  label: 'Mee' },
  };

  const activeSignData = hoveredSign ? RASHI_DATA[hoveredSign] : null;
  const activeOccupants = hoveredSign ? signPlanets[hoveredSign] : [];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="w-full max-w-[430px] aspect-square relative select-none group">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="eastGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="eastNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="eastHoverGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.04" />
            </radialGradient>
            <radialGradient id="eastLagnaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#009B77" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#006B5B" stopOpacity="0.04" />
            </radialGradient>
          </defs>

          {/* Deep Base */}
          <rect width="400" height="400" fill="#061411" rx="8" />

          {/* Background Rotating Astrolabe */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '200px 200px' }}
            opacity={0.16}
          >
            <circle cx="200" cy="200" r="110" fill="none" stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="3 4" />
            <circle cx="200" cy="200" r="70" fill="none" stroke="#009B77" strokeWidth="0.5" strokeDasharray="2 3" />
            <circle cx="200" cy="200" r="40" fill="none" stroke="#D4AF37" strokeWidth="0.75" />
          </motion.g>

          {/* Interactive Sign Polygons */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map(signNum => {
            const isHovered = hoveredSign === signNum;
            const isLagna = signNum === ascRashi;

            let fill = 'rgba(6, 24, 20, 0.40)';
            if (isHovered) {
              fill = 'url(#eastHoverGlow)';
            } else if (isLagna) {
              fill = 'url(#eastLagnaGlow)';
            }

            return (
              <polygon
                key={`east-poly-${signNum}`}
                points={SIGN_POLYGONS[signNum]}
                fill={fill}
                stroke={isHovered ? '#F2D675' : isLagna ? '#009B77' : 'rgba(212,175,55,0.20)'}
                strokeWidth={isHovered ? 1.4 : isLagna ? 1.2 : 0.6}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredSign(signNum)}
                onMouseLeave={() => setHoveredSign(null)}
              />
            );
          })}

          {/* Outer hairline frames */}
          <rect x="5" y="5" width="390" height="390" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.35" />
          <rect x="9" y="9" width="382" height="382" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.2" />

          {/* Diagonals & Diamond */}
          <line x1="9" y1="9" x2="391" y2="391" stroke="#D4AF37" strokeWidth="0.85" opacity="0.45" />
          <line x1="391" y1="9" x2="9" y2="391" stroke="#D4AF37" strokeWidth="0.85" opacity="0.45" />
          <polygon points="200,9 391,200 200,391 9,200" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.85" filter="url(#eastGoldGlow)" />

          {/* Center Crosshair Core */}
          <circle cx="200" cy="200" r="16" fill="rgba(212,175,55,0.15)" />
          <circle cx="200" cy="200" r="2.2" fill="#F2D675" filter="url(#eastGoldGlow)" />
          <line x1="192" y1="200" x2="208" y2="200" stroke="#D4AF37" strokeWidth="0.9" opacity="0.75" />
          <line x1="200" y1="192" x2="200" y2="208" stroke="#D4AF37" strokeWidth="0.9" opacity="0.75" />

          {/* Render 12 Signs Content */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map(signNum => {
            const geo = SIGN_GEOMETRY[signNum];
            const isLagna = signNum === ascRashi;
            const isHovered = hoveredSign === signNum;
            const planets = signPlanets[signNum] || [];

            return (
              <g key={`east-sign-${signNum}`} className="pointer-events-none">
                <text
                  x={geo.cx}
                  y={geo.cy - 16}
                  textAnchor="middle"
                  fill={isHovered ? '#F2D675' : isLagna ? '#009B77' : '#D4AF37'}
                  opacity={isHovered ? 1 : 0.85}
                  fontSize="11"
                  fontFamily="Cinzel, Georgia, serif"
                  fontWeight="bold"
                >
                  {geo.label}
                  {isLagna && (
                    <tspan fill="#009B77" fontSize="8.5" fontFamily="JetBrains Mono, monospace"> (ASC)</tspan>
                  )}
                </text>

                {/* Planets inside sign with orbit nodes */}
                <g transform={`translate(${geo.cx}, ${geo.cy + 4})`}>
                  {planets.map((p, idx) => {
                    const yOffset = idx * 13;
                    const planetColor = GRAHA_LABEL_COLOR[p.name] || '#F5F4EC';

                    return (
                      <g key={p.name} transform={`translate(0, ${yOffset})`}>
                        <circle
                          cx="-16"
                          cy="0"
                          r="2.2"
                          fill={planetColor}
                          filter="url(#eastNodeGlow)"
                        />
                        <text
                          x="-10"
                          y="0"
                          dominantBaseline="central"
                          fontFamily="Inter, system-ui, sans-serif"
                          fontSize="9.5"
                        >
                          <tspan fill={planetColor} fontWeight="bold">{p.shortLabel}</tspan>
                          {p.isRetrograde && <tspan fill="#E08E6D" fontSize="7.5" fontWeight="bold"> [R]</tspan>}
                          {showDegrees && (
                            <tspan fill="#AABDB7" fontSize="7.5" fontFamily="JetBrains Mono, monospace">
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

      {/* Interactive Telemetry Readout Banner */}
      <div className="w-full max-w-[430px] mt-2.5 min-h-[48px] flex items-center justify-between px-3.5 py-2 rounded-xl bg-[rgba(11,33,27,0.65)] border border-[rgba(212,175,55,0.22)] shadow-sm text-xs font-mono">
        <AnimatePresence mode="wait">
          {hoveredSign && activeSignData ? (
            <motion.div
              key={`east-inspect-${hoveredSign}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-[#F2D675] font-bold text-[11px] flex-shrink-0">
                  Sign #{hoveredSign}
                </span>
                <div className="min-w-0">
                  <div className="text-[#F5F4EC] font-semibold text-[11px] truncate">
                    {activeSignData.sanskrit}
                  </div>
                  <div className="text-[10px] text-[#AABDB7] truncate">
                    Lord: <span className="text-[#F2D675]">{activeSignData.lord}</span> • Element: {activeSignData.element}
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
              key="east-default-inspector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full text-[11px] text-[#AABDB7] gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[#AABDB7] truncate">Hover any sign to inspect Rashi & planetary positions</span>
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
        <span>East Indian (Fixed Signs Counter-Clockwise)</span>
      </div>
    </div>
  );
}
