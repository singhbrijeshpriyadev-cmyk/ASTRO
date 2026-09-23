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

export type NavSection = 
  | 'home'
  | 'birth-chart'
  | 'divisional-charts'
  | 'dashas'
  | 'transits'
  | 'yogas'
  | 'doshas'
  | 'tarot'
  | 'synthesis'
  | 'reports'
  | 'audit'
  | 'profile';

interface SidebarNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  className?: string;
}

export const NAV_ITEMS: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'birth-chart', label: 'Birth Chart', icon: Compass },
  { id: 'divisional-charts', label: 'Divisional Charts', icon: Layers },
  { id: 'dashas', label: 'Dashas', icon: Clock },
  { id: 'transits', label: 'Transits', icon: Radio },
  { id: 'yogas', label: 'Yogas', icon: Sparkles },
  { id: 'doshas', label: 'Doshas', icon: ShieldAlert },
  { id: 'tarot', label: 'Tarot', icon: BookOpen },
  { id: 'synthesis', label: 'Astro + Tarot', icon: ArrowRightLeft },
  { id: 'reports', label: 'Reports (13-Layer)', icon: FileText },
  { id: 'audit', label: 'Calculation Audit', icon: Cpu },
  { id: 'profile', label: 'Profile', icon: User },
];

export function SidebarNav({ activeSection, onSelectSection, className = '' }: SidebarNavProps) {
  return (
    <aside className={`w-64 bg-vedic-bg border-r border-vedic-gold-border flex flex-col h-screen sticky top-0 select-none ${className}`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-vedic-gold-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg border border-vedic-gold/40 bg-vedic-surface flex items-center justify-center text-vedic-gold font-serif font-bold text-lg shadow-sm">
          काल
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vedic-gold uppercase font-semibold">ASTRA</span>
            <span className="text-[10px] text-vedic-muted">•</span>
            <span className="text-[10px] font-mono tracking-widest text-vedic-text-secondary uppercase">PRECISION</span>
          </div>
          <h1 className="font-serif text-lg font-bold text-vedic-text tracking-wide">
            Kaalika
          </h1>
          <p className="text-[9.5px] font-mono text-vedic-muted tracking-wider uppercase">
            Vedic Observatory
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase text-vedic-muted tracking-widest">
          Chronology & Geometry
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-sans transition-all group ${
                isActive
                  ? 'bg-vedic-peacock/25 text-vedic-gold-soft font-medium border border-vedic-gold/30 shadow-sm'
                  : 'text-vedic-text-secondary hover:text-vedic-text hover:bg-vedic-secondary/70 border border-transparent'
              }`}
            >
              {/* Subtle gold indicator dot / needle */}
              {isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-vedic-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-vedic-gold/30 transition-colors" />
              )}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-vedic-gold' : 'text-vedic-muted group-hover:text-vedic-text-secondary'
                }`}
              />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Observatory Status Ticker in Sidebar Footer */}
      <div className="p-4 border-t border-vedic-gold-border text-[10.5px] font-mono text-vedic-text-secondary space-y-1.5 bg-vedic-secondary/30">
        <div className="flex items-center justify-between text-vedic-muted">
          <span>PRECISION</span>
          <span className="text-vedic-gold-soft font-semibold">0.0001° DMS</span>
        </div>
        <div className="flex items-center justify-between text-vedic-muted">
          <span>EPHEMERIS</span>
          <span className="text-vedic-text">VSOP87</span>
        </div>
        <div className="flex items-center justify-between text-vedic-muted">
          <span>AYANAMSHA</span>
          <span className="text-vedic-text">Lahiri</span>
        </div>
      </div>
    </aside>
  );
}
