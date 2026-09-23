'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Layers, 
  Clock, 
  Radio, 
  Sparkles, 
  BookOpen, 
  FileText, 
  User
} from 'lucide-react';
import { NavSection } from '@/components/navigation/SidebarNav';
import { motionTokens } from '@/lib/motion/animationTokens';

interface BottomGlassNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

interface DockItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Exactly 4 items on the left and 4 items on the right of the center button
const LEFT_ITEMS: DockItem[] = [
  { id: 'birth-chart', label: 'Chart', icon: Compass },
  { id: 'divisional-charts', label: 'Vargas', icon: Layers },
  { id: 'dashas', label: 'Dashas', icon: Clock },
  { id: 'transits', label: 'Transits', icon: Radio },
];

const RIGHT_ITEMS: DockItem[] = [
  { id: 'yogas', label: 'Yogas', icon: Sparkles },
  { id: 'tarot', label: 'Tarot', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomGlassNav({ activeSection, onSelectSection }: BottomGlassNavProps) {
  const isHomeActive = activeSection === 'home';

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
      <motion.nav 
        aria-label="Primary Navigation"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.65,
          ease: motionTokens.ease.elegant,
        }}
        className="pointer-events-auto w-full max-w-[1050px] select-none"
      >
        <div className="relative liquid-glass-dock px-2 sm:px-5 py-1.5 flex items-center justify-between h-[68px] sm:h-[74px]">
          {/* Left Nav Group: Exactly 4 Items (Flex-1 for true horizontal centering) */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 flex-1 justify-around">
          {LEFT_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl group transition-colors cursor-pointer select-none"
              >
                {/* Traveling Shared Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    transition={motionTokens.spring.navigation}
                    className="absolute inset-0 rounded-2xl bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.45)] shadow-[0_0_20px_rgba(212,175,55,0.18)]"
                    style={{ zIndex: 0 }}
                  />
                )}

                <motion.div
                  className="relative z-10 flex flex-col items-center justify-center"
                  animate={{ y: isActive ? -1 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-all duration-200 group-hover:-translate-y-0.5 ${
                      isActive
                        ? 'text-[#F2D675] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]'
                        : 'text-[#AABDB7] group-hover:text-[#F5F4EC]'
                    }`}
                  />
                  <span 
                    className={`text-[9.5px] sm:text-[11px] font-sans tracking-tight mt-0.5 transition-colors ${
                      isActive
                        ? 'text-[#F5F4EC] font-semibold'
                        : 'text-[#AABDB7] group-hover:text-[#F5F4EC]'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>

                {/* Subtle gold indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] z-10" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Center Observatory Button: Perfectly Aligned Centered Inside Dock */}
        <div className="relative mx-1.5 sm:mx-3 flex-shrink-0 z-20 flex items-center justify-center">
          {/* Celestial Orbital Halo Rings */}
          <div className="absolute inset-[-6px] sm:inset-[-8px] pointer-events-none flex items-center justify-center">
            {/* Outer Slow Orbiting Ring with Gold Node */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-[rgba(212,175,55,0.22)]"
            >
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2D675] shadow-[0_0_8px_#F2D675]" />
            </motion.div>

            {/* Inner Counter-Orbiting Dashed Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[3px] rounded-full border border-dashed border-[rgba(0,155,119,0.25)]"
            >
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#009B77] shadow-[0_0_6px_#009B77]" />
            </motion.div>
          </div>

          <motion.button
            onClick={() => onSelectSection('home')}
            aria-label="Kaalika Observatory Home"
            aria-current={isHomeActive ? 'page' : undefined}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={motionTokens.spring.gentleOrb}
            className={`w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-b from-[#006B5B] via-[#0B211B] to-[#061411] border-2 transition-all flex flex-col items-center justify-center group cursor-pointer relative z-10 ${
              isHomeActive
                ? 'border-[#F2D675] shadow-[0_0_24px_rgba(212,175,55,0.55),0_4px_16px_rgba(0,0,0,0.7)] ring-2 ring-[#D4AF37]/50'
                : 'border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.22),0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_28px_rgba(212,175,55,0.40)]'
            }`}
          >
            {/* Center Sacred Glyph with subtle rotation on hover */}
            <motion.span 
              className={`font-serif font-bold text-sm sm:text-base transition-colors leading-none tracking-tight ${
                isHomeActive ? 'text-[#F5F4EC]' : 'text-[#F2D675] group-hover:text-[#F5F4EC]'
              }`}
              whileHover={{ rotate: 12 }}
              transition={{ duration: 0.22, ease: motionTokens.ease.standard }}
            >
              काल
            </motion.span>
            <span className="text-[7px] sm:text-[7.5px] font-mono uppercase text-[#D4AF37] tracking-widest mt-0.5 font-semibold">
              ASTRA
            </span>
          </motion.button>
        </div>

        {/* Right Nav Group: Exactly 4 Items (Flex-1 for true horizontal centering) */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 flex-1 justify-around">
          {RIGHT_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 sm:px-3 rounded-2xl group transition-colors cursor-pointer select-none"
              >
                {/* Traveling Shared Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    transition={motionTokens.spring.navigation}
                    className="absolute inset-0 rounded-2xl bg-[rgba(212,175,55,0.14)] border border-[rgba(212,175,55,0.45)] shadow-[0_0_20px_rgba(212,175,55,0.18)]"
                    style={{ zIndex: 0 }}
                  />
                )}

                <motion.div
                  className="relative z-10 flex flex-col items-center justify-center"
                  animate={{ y: isActive ? -1 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-all duration-200 group-hover:-translate-y-0.5 ${
                      isActive
                        ? 'text-[#F2D675] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]'
                        : 'text-[#AABDB7] group-hover:text-[#F5F4EC]'
                    }`}
                  />
                  <span 
                    className={`text-[9.5px] sm:text-[11px] font-sans tracking-tight mt-0.5 transition-colors ${
                      isActive
                        ? 'text-[#F5F4EC] font-semibold'
                        : 'text-[#AABDB7] group-hover:text-[#F5F4EC]'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>

                {/* Subtle gold indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] z-10" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  </div>
);
}
