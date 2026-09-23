'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PanchangData } from '@/types/astrology';
import { Moon, Sun, Compass, Clock, Activity, Calendar, Sparkles } from 'lucide-react';
import { motionTokens } from '@/lib/motion/animationTokens';

interface PanchangCardProps {
  panchang: PanchangData;
}

export function PanchangCard({ panchang }: PanchangCardProps) {
  const items = [
    {
      label: 'Tithi',
      sanskrit: 'तिथि',
      value: panchang.tithi.name,
      sub: `${panchang.tithi.paksha} (${panchang.tithi.completionPercentage}%)`,
      icon: Moon,
      color: '#F5F4EC',
    },
    {
      label: 'Nakshatra',
      sanskrit: 'नक्षत्र',
      value: panchang.nakshatra.name,
      sub: `Pada ${panchang.nakshatra.pada} • Lord ${panchang.nakshatra.lord}`,
      icon: Sparkles,
      color: '#F2D675',
    },
    {
      label: 'Yoga',
      sanskrit: 'योग',
      value: panchang.yoga.name,
      sub: `Auspicious Yoga #${panchang.yoga.number}`,
      icon: Activity,
      color: '#D4AF37',
    },
    {
      label: 'Karana',
      sanskrit: 'करण',
      value: panchang.karana.name,
      sub: `Half-Tithi #${panchang.karana.number}`,
      icon: Clock,
      color: '#009B77',
    },
    {
      label: 'Vaara',
      sanskrit: 'वार',
      value: panchang.vaara.name,
      sub: `Solar Ruler: ${panchang.vaara.lord}`,
      icon: Sun,
      color: '#F2D675',
    },
    {
      label: 'Ayanamsha',
      sanskrit: 'अयनांश',
      value: panchang.ayanamsa.formatted,
      sub: `${panchang.ayanamsa.name}`,
      icon: Compass,
      color: '#D4AF37',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65, ease: motionTokens.ease.standard }}
      className="liquid-glass-card p-5 sm:p-6 space-y-4 select-none hover:border-[rgba(212,175,55,0.38)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.50)] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[#F2D675]">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-[#F5F4EC] tracking-wide">
              Panchanga
            </h2>
            <span className="text-[10px] font-mono text-[#AABDB7] uppercase tracking-wider">
              Observational Almanac • Five Limbs of Time
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] px-2.5 py-1 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.25)]">
          <span>VEDIC TIME METRICS</span>
        </div>
      </div>

      {/* 6-Pillar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="p-3 rounded-xl bg-[rgba(11,33,27,0.45)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.35)] shadow-sm hover:shadow-[0_4px_18px_rgba(0,0,0,0.4)] transition-all space-y-1.5 group cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-[11px] font-bold text-[#D4AF37] group-hover:text-[#F2D675] transition-colors">
                  {item.sanskrit}
                </span>
                <Icon className="w-3.5 h-3.5 text-[#AABDB7] group-hover:text-[#F2D675] transition-colors" style={{ color: item.color }} />
              </div>

              <div className="text-[9.5px] font-mono uppercase text-[#AABDB7] tracking-wider font-semibold">
                {item.label}
              </div>

              <div className="text-xs font-serif font-bold text-[#F5F4EC] group-hover:text-[#F2D675] transition-colors truncate" title={item.value}>
                {item.value}
              </div>

              <div className="text-[9px] font-mono text-[#AABDB7] truncate" title={item.sub}>
                {item.sub}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
