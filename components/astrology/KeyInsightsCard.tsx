'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Compass, Moon, Sun, Star, Clock, ChevronRight } from 'lucide-react';
import { KundaliData } from '@/types/astrology';
import { motionTokens } from '@/lib/motion/animationTokens';

interface KeyInsightsCardProps {
  kundali: KundaliData;
  onExploreDasha?: () => void;
}

export function KeyInsightsCard({ kundali, onExploreDasha }: KeyInsightsCardProps) {
  const sun = kundali.planets.find(p => p.name === 'Surya' || p.planet === 'Sun')!;
  const moon = kundali.planets.find(p => p.name === 'Chandra' || p.planet === 'Moon')!;
  const activeMahadasha = kundali.dashas.find(d => d.isCurrent) || kundali.dashas[0];
  const activeAntardasha = activeMahadasha?.subPeriods?.find(s => s.isCurrent) || activeMahadasha?.subPeriods?.[0];

  const insights = [
    {
      icon: Compass,
      label: 'ASCENDANT (LAGNA)',
      value: `${kundali.ascendant.zodiacSign} ${kundali.ascendant.dms}`,
      highlight: kundali.ascendant.zodiacSign,
    },
    {
      icon: Moon,
      label: 'MOON SIGN (RASHI)',
      value: `${moon.zodiacSign} ${moon.dms}`,
      highlight: moon.zodiacSign,
    },
    {
      icon: Sun,
      label: 'SUN SIGN (SURYA)',
      value: `${sun.zodiacSign} ${sun.dms}`,
      highlight: sun.zodiacSign,
    },
    {
      icon: Star,
      label: 'NAKSHATRA & PADA',
      value: `${kundali.panchang.nakshatra.name} (Pada ${kundali.panchang.nakshatra.pada})`,
      highlight: kundali.panchang.nakshatra.name,
    },
    {
      icon: Clock,
      label: 'CURRENT DASHA',
      value: `${activeMahadasha?.planet} - ${activeAntardasha?.planet}`,
      highlight: `${activeMahadasha?.planet} Mahadasha`,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55, ease: motionTokens.ease.standard }}
      whileHover={{ y: -2 }}
      className="liquid-glass-card p-5 space-y-4 select-none hover:border-[rgba(212,175,55,0.38)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.50)] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <h2 className="font-serif text-base font-bold text-[#F5F4EC] tracking-wide">
            Key Insights
          </h2>
          <span className="text-[10px] font-mono text-[#AABDB7] uppercase tracking-wider">
            Primary Pillars
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#009B77] shadow-[0_0_8px_#009B77]" />
      </div>

      {/* Rows */}
      <div className="space-y-2.5">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
              className="p-2.5 rounded-xl bg-[rgba(11,33,27,0.45)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.22)] transition-all flex items-start gap-3 group cursor-default"
            >
              <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5 group-hover:border-[rgba(212,175,55,0.4)] transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9.5px] font-mono uppercase text-[#AABDB7] tracking-wider">
                  {item.label}
                </div>
                <div className="font-serif text-xs sm:text-[13px] font-bold text-[#F2D675] group-hover:text-[#F5F4EC] transition-colors truncate">
                  {item.highlight}
                </div>
                <div className="text-[10.5px] font-mono text-[#AABDB7] truncate">
                  {item.value}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dasha Timeline shortcut link */}
      {onExploreDasha && (
        <motion.button
          onClick={onExploreDasha}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className="w-full pt-2 flex items-center justify-between text-[11px] font-mono text-[#D4AF37] hover:text-[#F2D675] transition-colors border-t border-[rgba(255,255,255,0.05)] cursor-pointer"
        >
          <span>Explore 120-Year Timeline</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </motion.div>
  );
}
