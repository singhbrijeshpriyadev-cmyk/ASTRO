'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { motionTokens } from '@/lib/motion/animationTokens';

import { ArmillaryAstrolabeGraphic } from './ArmillaryAstrolabeGraphic';

import { Compass, Moon, Sun, Star, ArrowUpRight, BookOpen } from 'lucide-react';
import { KundaliData } from '@/types/astrology';
import { NavSection } from '@/components/navigation/SidebarNav';

interface CosmicHeroProps {
  kundali?: KundaliData;
  onNavigate?: (section: NavSection) => void;
}

export function CosmicHero({ kundali, onNavigate }: CosmicHeroProps) {
  const sun = kundali?.planets?.find(p => p.name === 'Surya' || p.planet === 'Sun');
  const moon = kundali?.planets?.find(p => p.name === 'Chandra' || p.planet === 'Moon');
  const asc = kundali?.ascendant;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: motionTokens.ease.elegant }}
      className="relative overflow-hidden rounded-[28px] p-6 sm:p-10 border border-[rgba(212,175,55,0.30)] bg-gradient-to-br from-[#061B16]/95 via-[#03120F]/98 to-[#092822]/90 shadow-[0_24px_60px_rgba(0,0,0,0.6)] select-none"
    >
      {/* Background Celestial Geometry & Atmospheric Artwork */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        {/* Subtle Moon / Celestial Sphere Crescent with gentle parallax/sway */}
        <motion.div 
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-12 -right-8 w-64 h-64 rounded-full border border-[rgba(212,175,55,0.12)] bg-radial from-[rgba(212,175,55,0.06)] to-transparent blur-[1px]" 
        />
        
        {/* Faint Sacred Sanskrit Watermark */}
        <div className="absolute right-6 -bottom-10 font-serif text-[130px] sm:text-[170px] text-[#D4AF37]/[0.035] leading-none">
          काल
        </div>

        {/* Faint Constellation Lines SVG */}
        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute inset-0 w-full h-full" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="15%" cy="30%" r="1.5" fill="#D4AF37" />
          <circle cx="28%" cy="20%" r="1" fill="#F5F4EC" />
          <circle cx="45%" cy="35%" r="2" fill="#D4AF37" />
          <circle cx="75%" cy="25%" r="1.5" fill="#F5F4EC" />
          <line x1="15%" y1="30%" x2="28%" y2="20%" stroke="rgba(212,175,55,0.2)" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="28%" y1="20%" x2="45%" y2="35%" stroke="rgba(212,175,55,0.2)" strokeWidth="0.75" />
          <line x1="45%" y1="35%" x2="75%" y2="25%" stroke="rgba(212,175,55,0.15)" strokeWidth="0.75" strokeDasharray="2 2" />
        </motion.svg>
      </motion.div>

      {/* Content & Interactive Armillary Graphic */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <div className="flex-1 max-w-2xl space-y-4 text-left w-full">
          {/* Small Eyebrow: Opacity + Letter Spacing */}
          <motion.div 
            initial={{ opacity: 0, letterSpacing: '0.15em' }}
            animate={{ opacity: 1, letterSpacing: '0.22em' }}
            transition={{ duration: 0.5, delay: 0.1, ease: motionTokens.ease.standard }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.30)] text-[#D4AF37] text-[10px] sm:text-[10.5px] font-mono uppercase font-semibold shadow-[0_0_12px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-3 h-3 text-[#F2D675]" />
            <span>WELCOME TO KAALIKA</span>
            <span className="text-[#AABDB7]">•</span>
            <span className="text-[#AABDB7]">SIDEREAL OBSERVATORY</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: motionTokens.ease.elegant }}
            className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-bold text-[#F5F4EC] tracking-tight leading-[1.12]"
          >
            Your <span className="shimmer-gold-text">Cosmic Blueprint</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: motionTokens.ease.standard }}
            className="text-xs sm:text-sm text-[#AABDB7] font-sans leading-relaxed"
          >
            A deterministic astronomical representation of the heavens at your precise moment of birth. Computed using VSOP87 planetary theory and official N.C. Lahiri Chitra-Paksha Ayanamsha.
          </motion.p>

          {/* Live Quick Pillars Readout Pills with Hover Physics */}
          {kundali && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: motionTokens.ease.standard }}
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              {asc && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(11,33,27,0.65)] border border-[rgba(0,155,119,0.30)] text-xs font-mono shadow-sm cursor-default"
                >
                  <Compass className="w-3.5 h-3.5 text-[#009B77] animate-spin-slow" />
                  <span className="text-[#AABDB7] text-[10px]">LAGNA:</span>
                  <span className="text-[#F5F4EC] font-semibold">{asc.zodiacSign}</span>
                  <span className="text-[#009B77] text-[11px]">{asc.dms}</span>
                </motion.div>
              )}
              {moon && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(11,33,27,0.65)] border border-[rgba(245,244,236,0.25)] text-xs font-mono shadow-sm cursor-default"
                >
                  <Moon className="w-3.5 h-3.5 text-[#F5F4EC]" />
                  <span className="text-[#AABDB7] text-[10px]">CHANDRA:</span>
                  <span className="text-[#F5F4EC] font-semibold">{moon.zodiacSign}</span>
                </motion.div>
              )}
              {sun && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(11,33,27,0.65)] border border-[rgba(242,214,117,0.25)] text-xs font-mono shadow-sm cursor-default"
                >
                  <Sun className="w-3.5 h-3.5 text-[#F2D675]" />
                  <span className="text-[#AABDB7] text-[10px]">SURYA:</span>
                  <span className="text-[#F5F4EC] font-semibold">{sun.zodiacSign}</span>
                </motion.div>
              )}
              {kundali.panchang?.nakshatra && (
                <motion.div 
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(11,33,27,0.65)] border border-[rgba(212,175,55,0.30)] text-xs font-mono shadow-sm cursor-default"
                >
                  <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#AABDB7] text-[10px]">NAKSHATRA:</span>
                  <span className="text-[#F2D675] font-semibold">{kundali.panchang.nakshatra.name} (Pada {kundali.panchang.nakshatra.pada})</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Quick Action CTA Buttons */}
          {onNavigate && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: motionTokens.ease.standard }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.button
                onClick={() => onNavigate('birth-chart')}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F2D675] text-[#061411] font-serif font-bold text-xs tracking-wide flex items-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] transition-all cursor-pointer"
              >
                <span>Interactive Chart Engine</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>

              <motion.button
                onClick={() => onNavigate('tarot')}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl bg-[rgba(139,107,190,0.18)] hover:bg-[rgba(139,107,190,0.28)] border border-[rgba(167,139,250,0.45)] text-[#E9D5FF] font-serif font-bold text-xs tracking-wide flex items-center gap-2 shadow-[0_4px_16px_rgba(139,107,190,0.2)] transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#F2D675]" />
                <span>Tarot Sanctuary</span>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Dynamic Interactive Armillary Astrolabe Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.25, ease: motionTokens.ease.elegant }}
          className="flex-shrink-0 flex items-center justify-center -my-3 sm:-my-4"
        >
          <ArmillaryAstrolabeGraphic />
        </motion.div>
      </div>
    </motion.section>
  );
}
