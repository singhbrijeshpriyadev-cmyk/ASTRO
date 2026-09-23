'use client';

import React from 'react';
import { 
  Home, 
  Compass, 
  Layers, 
  Clock, 
  Radio, 
  Sparkles, 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  User,
  ArrowRightLeft,
  Cpu
} from 'lucide-react';
import { NavSection } from '@/components/navigation/SidebarNav';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  className?: string;
}

const SIDEBAR_ITEMS: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'birth-chart', label: 'Chart', icon: Compass },
  { id: 'divisional-charts', label: 'Vargas', icon: Layers },
  { id: 'dashas', label: 'Dashas', icon: Clock },
  { id: 'transits', label: 'Transits', icon: Radio },
  { id: 'yogas', label: 'Yogas', icon: Sparkles },
  { id: 'doshas', label: 'Doshas', icon: ShieldAlert },
  { id: 'tarot', label: 'Tarot', icon: BookOpen },
  { id: 'synthesis', label: 'Astro + Tarot', icon: ArrowRightLeft },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'audit', label: 'Audit', icon: Cpu },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Sidebar({ activeSection, onSelectSection, className = '' }: SidebarProps) {
  return (
    <aside 
      className={`w-[195px] fixed left-0 top-0 bottom-0 z-30 bg-[#061411]/85 backdrop-blur-xl border-r border-[rgba(255,255,255,0.08)] flex flex-col select-none ${className}`}
    >
      {/* Top Brand Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2.5">
          {/* Kaalika Lotus / Sacred Sanskrit Glyph */}
          <div className="w-8 h-8 rounded-lg border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[#0B211B] to-[#061411] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.12)]">
            काल
          </div>
          <div>
            <div className="font-serif text-sm font-bold text-[#F5F4EC] tracking-wider leading-none">
              KAALIKA
            </div>
            <div className="text-[8.5px] font-mono uppercase text-[#AABDB7] tracking-widest mt-1">
              Vedic Observatory
            </div>
          </div>
        </div>

        {/* Short Philosophy */}
        <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.04)] text-[9px] font-serif italic text-[#AABDB7]/80 tracking-wide text-center">
          Ancient Wisdom • Modern Clarity
        </div>
      </div>

      {/* Secondary Observatory Rail Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto no-scrollbar">
        <div className="px-2.5 pb-1.5 text-[8.5px] font-mono uppercase text-[#AABDB7] tracking-widest">
          Instruments
        </div>
        {SIDEBAR_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11.5px] transition-all group ${
                isActive
                  ? 'bg-[rgba(0,107,91,0.22)] text-[#F2D675] font-medium border border-[rgba(212,175,55,0.25)] shadow-[0_0_12px_rgba(212,175,55,0.08)]'
                  : 'text-[#AABDB7] hover:text-[#F5F4EC] hover:bg-[#0B211B]/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isActive ? 'text-[#D4AF37]' : 'text-[#AABDB7] group-hover:text-[#F5F4EC]'
                }`}
              />
              <span className="truncate tracking-normal font-sans">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Minimal Rail Footer Metadata */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] bg-[#061411]/90 text-[9px] font-mono text-[#AABDB7] space-y-1">
        <div className="flex justify-between items-center">
          <span>PRECISION</span>
          <span className="text-[#F2D675]">0.0001°</span>
        </div>
        <div className="flex justify-between items-center">
          <span>EPHEMERIS</span>
          <span className="text-[#AABDB7]">VSOP87</span>
        </div>
      </div>
    </aside>
  );
}
