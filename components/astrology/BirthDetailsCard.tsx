'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Edit3, MapPin, Calendar, Clock, User, Compass } from 'lucide-react';
import { RawBirthInput } from '@/types/astrology';
import { cardHoverTransition } from '@/lib/motion/transitions';
import { motionTokens } from '@/lib/motion/animationTokens';

interface BirthDetailsCardProps {
  input: RawBirthInput;
  onModify: () => void;
}

export function BirthDetailsCard({ input, onModify }: BirthDetailsCardProps) {
  const fields = [
    { label: 'NAME', value: input.name, icon: User },
    { label: 'DATE OF BIRTH', value: input.birthLocalDate, icon: Calendar },
    { label: 'EXACT TIME', value: input.birthLocalTime, icon: Clock },
    { label: 'BIRTH PLACE', value: input.birthPlace, icon: MapPin },
    { 
      label: 'LATITUDE', 
      value: `${Math.abs(input.latitude).toFixed(4)}° ${input.latitude >= 0 ? 'N' : 'S'}`, 
      icon: Compass 
    },
    { 
      label: 'LONGITUDE', 
      value: `${Math.abs(input.longitude).toFixed(4)}° ${input.longitude >= 0 ? 'E' : 'W'}`, 
      icon: Compass 
    },
    { label: 'TIMEZONE', value: input.timezone, icon: Clock },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: motionTokens.ease.standard }}
      whileHover={{ y: -2 }}
      className="liquid-glass-card p-5 space-y-4 select-none hover:border-[rgba(212,175,55,0.38)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.50)] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <h2 className="font-serif text-base font-bold text-[#F5F4EC] tracking-wide">
            Birth Details
          </h2>
          <span className="text-[10px] font-mono text-[#AABDB7] uppercase tracking-wider">
            Natal Coordinates
          </span>
        </div>
        <motion.button
          onClick={onModify}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.15)] text-[10.5px] font-mono text-[#D4AF37] hover:text-[#F2D675] transition-all shadow-sm cursor-pointer"
        >
          <Edit3 className="w-3 h-3" />
          <span>Modify</span>
        </motion.button>
      </div>

      {/* Rows with Modern Icon Badges */}
      <div className="space-y-2">
        {fields.map((f) => {
          const Icon = f.icon;
          return (
            <div 
              key={f.label} 
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[rgba(11,33,27,0.40)] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(212,175,55,0.25)] transition-all group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.20)] flex items-center justify-center text-[#D4AF37] flex-shrink-0 group-hover:border-[rgba(212,175,55,0.45)] transition-colors">
                  <Icon className="w-2.5 h-2.5" />
                </div>
                <span className="text-[9px] uppercase text-[#AABDB7] group-hover:text-[#F5F4EC] tracking-wider font-semibold font-mono truncate">
                  {f.label}
                </span>
              </div>
              <span className="text-[#F5F4EC] group-hover:text-[#F2D675] font-mono font-medium text-xs text-right truncate max-w-[170px] transition-colors" title={String(f.value)}>
                {f.value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
