'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Compass, Clock, Globe, Cpu } from 'lucide-react';
import { CalculationSettings, KundaliData } from '@/types/astrology';
import { motionTokens } from '@/lib/motion/animationTokens';

interface CalculationStatusProps {
  kundali: KundaliData;
  settings: CalculationSettings;
  timezone: string;
  onOpenAudit: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // 60ms stagger within 50-70ms spec
      delayChildren: 0.35,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.22, ease: motionTokens.ease.standard }
  },
};

export function CalculationStatus({
  kundali,
  settings,
  timezone,
  onOpenAudit,
}: CalculationStatusProps) {
  const statusItems = [
    {
      id: 'precision',
      label: 'PRECISION:',
      value: '0.0001° DMS',
      icon: Compass,
      iconColor: 'text-[#D4AF37]',
      highlight: true,
    },
    {
      id: 'ephemeris',
      label: 'EPHEMERIS:',
      value: 'VSOP87',
      highlight: false,
    },
    {
      id: 'ayanamsha',
      label: 'AYANAMSHA:',
      value: `${settings.ayanamsha || 'Lahiri'} (${kundali.panchang.ayanamsa.formatted})`,
      highlight: false,
    },
    {
      id: 'zodiac',
      label: 'ZODIAC:',
      value: settings.zodiac || 'Sidereal',
      icon: Globe,
      iconColor: 'text-[#009B77]',
      highlight: false,
      hideOnSmall: true,
    },
    {
      id: 'timezone',
      label: 'TIMEZONE:',
      value: timezone || 'Asia/Kolkata (UTC +5:30)',
      icon: Clock,
      iconColor: 'text-[#AABDB7]',
      highlight: false,
      hideOnMedium: true,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.32, ease: motionTokens.ease.standard }}
      className="relative liquid-glass-panel px-4 py-2.5 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none border border-[rgba(212,175,55,0.22)] shadow-[0_10px_35px_rgba(0,0,0,0.35)] rounded-2xl"
    >
      {/* Metric Indicators with Thin Vertical Separators */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 sm:gap-5 flex-wrap divide-x divide-[rgba(255,255,255,0.08)]"
      >
        {/* Live System Indicator */}
        <div className="flex items-center gap-2 pr-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#009B77] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#009B77]"></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#009B77]">
            SIDEREAL ENGINE
          </span>
        </div>

        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center gap-2 group cursor-default transition-colors rounded-lg px-2 py-1 hover:bg-[rgba(212,175,55,0.06)] ${
                index > 0 ? 'pl-3 sm:pl-5' : 'pl-3 sm:pl-5'
              } ${item.hideOnMedium ? 'hidden lg:flex' : item.hideOnSmall ? 'hidden md:flex' : 'flex'}`}
            >
              {Icon && (
                <Icon className={`w-3.5 h-3.5 transition-all duration-150 group-hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.5)] ${item.iconColor}`} />
              )}
              <span className="text-[9.5px] uppercase text-[#AABDB7] tracking-wider group-hover:text-[#F5F4EC] transition-colors font-medium">
                {item.label}
              </span>
              <span className={item.highlight ? 'text-[#F2D675] font-semibold drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#F5F4EC] font-medium'}>
                {item.value}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Audit Button */}
      <motion.button
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        onClick={onOpenAudit}
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="px-3.5 py-1.5 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] hover:bg-[rgba(212,175,55,0.18)] hover:border-[rgba(212,175,55,0.6)] text-[#F2D675] hover:text-[#F5F4EC] transition-all flex items-center gap-1.5 text-[11px] font-mono shadow-[0_0_12px_rgba(212,175,55,0.12)] cursor-pointer"
      >
        <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Calculation Audit</span>
      </motion.button>
    </motion.div>
  );
}
