import React from 'react';
import { NavSection, NAV_ITEMS } from './SidebarNav';

interface MobileBottomNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export function MobileBottomNav({ activeSection, onSelectSection }: MobileBottomNavProps) {
  // Select top 5 primary items for the compact floating mobile dock
  const mobileItems = NAV_ITEMS.slice(0, 5);

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
      <nav className="bg-vedic-secondary/95 backdrop-blur-md border border-vedic-gold-border rounded-lg px-2 py-1.5 shadow-2xl flex items-center justify-around">
        {mobileItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded transition-colors ${
                isActive
                  ? 'text-vedic-gold-soft font-semibold'
                  : 'text-vedic-text-secondary hover:text-vedic-text'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-vedic-gold' : 'text-vedic-muted'}`} />
              <span className="text-[9.5px] font-sans tracking-tight">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
