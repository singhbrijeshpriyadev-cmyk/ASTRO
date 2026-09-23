'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Radio, 
  FileText,
  ChevronRight 
} from 'lucide-react';
import { NavSection } from '@/components/navigation/SidebarNav';
import { motionTokens } from '@/lib/motion/animationTokens';

interface QuickActionsCardProps {
  onNavigate: (section: NavSection) => void;
}

export function QuickActionsCard({ onNavigate }: QuickActionsCardProps) {
  const actions: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'divisional-charts', label: 'Varga Charts', icon: Layers },
    { id: 'yogas', label: 'Yogas & Doshas', icon: Sparkles },
    { id: 'dashas', label: 'Dasha Timeline', icon: Clock },
    { id: 'tarot', label: 'Tarot Deck', icon: BookOpen },
    { id: 'transits', label: 'Transits Gochar', icon: Radio },
    { id: 'reports', label: 'Generate Report', icon: FileText },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: motionTokens.ease.standard }}
      whileHover={{ y: -2 }}
      className="liquid-glass-card p-5 space-y-3.5 select-none hover:border-[rgba(212,175,55,0.38)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.50)] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <h2 className="font-serif text-base font-bold text-[#F5F4EC] tracking-wide">
            Quick Actions
          </h2>
          <span className="text-[10px] font-mono text-[#AABDB7] uppercase tracking-wider">
            Observatory Suites
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#D4AF37]">6 Suites</div>
      </div>

      {/* 2-Column Liquid Glass Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="p-2.5 rounded-xl bg-[rgba(11,33,27,0.50)] hover:bg-[rgba(0,107,91,0.22)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.35)] shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.12)] transition-colors text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-[#F2D675] transition-colors flex-shrink-0" />
                <span className="text-[11px] font-sans font-medium text-[#F5F4EC] group-hover:text-[#F2D675] transition-colors truncate">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#AABDB7] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
