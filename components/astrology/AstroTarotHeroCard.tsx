'use client';

import React from 'react';
import { ArrowRightLeft, Sparkles, Layers } from 'lucide-react';

interface AstroTarotHeroCardProps {
  onExplore: () => void;
}

export function AstroTarotHeroCard({ onExplore }: AstroTarotHeroCardProps) {
  return (
    <div className="relative overflow-hidden liquid-glass-purple p-5 space-y-3.5 select-none">
      {/* Subtle Arcana / Star Ornament Background */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-gradient-to-br from-[#8B6BBE]/20 to-transparent blur-xl pointer-events-none" />
      <div className="absolute right-3 bottom-2 opacity-15 pointer-events-none text-[#A78BFA]">
        <Layers className="w-16 h-16" strokeWidth={1} />
      </div>

      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-1.5 text-[9.5px] font-mono uppercase tracking-widest text-[#A78BFA]">
          <Sparkles className="w-3 h-3 text-[#A78BFA]" />
          <span>Synthesis Engine</span>
        </div>

        <h3 className="font-serif text-base font-bold text-[#F5F4EC] tracking-wide">
          Explore Deeper
        </h3>

        <p className="text-[11px] text-[#AABDB7] font-sans leading-relaxed">
          Combine Vedic Astrology with Tarot for a broader perspective. Connect Graha transits with archetypal symbolism.
        </p>

        <button
          onClick={onExplore}
          className="w-full mt-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#8B6BBE]/30 to-[#006B5B]/30 hover:from-[#8B6BBE]/45 hover:to-[#006B5B]/45 border border-[#A78BFA]/40 hover:border-[#A78BFA]/70 text-[#F5F4EC] text-xs font-serif font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,107,190,0.2)] hover:shadow-[0_0_22px_rgba(139,107,190,0.35)] transition-all duration-200"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#F2D675]" />
          <span>Try Astro + Tarot</span>
        </button>
      </div>
    </div>
  );
}
