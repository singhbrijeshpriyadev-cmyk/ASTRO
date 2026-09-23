import React, { useState } from 'react';
import Image from 'next/image';
import { GRAHA_ARCHETYPES } from '@/lib/tarot/archetypes';
import { TraditionalGraha } from '@/types/astrology';
import { 
  Sparkles, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  Eye,
  BookOpen
} from 'lucide-react';

const GRAHA_CARD_IMAGES: Partial<Record<TraditionalGraha, string>> = {
  Surya: '/tarot/m19.jpg',     // The Sun (XIX)
  Chandra: '/tarot/m02.jpg',   // The High Priestess (II)
  Mangala: '/tarot/m16.jpg',   // The Tower (XVI)
  Budha: '/tarot/m01.jpg',     // The Magician (I)
  Guru: '/tarot/m05.jpg',      // The Hierophant (V)
  Shukra: '/tarot/m03.jpg',    // The Empress (III)
  Shani: '/tarot/m09.jpg',     // The Hermit (IX)
  Rahu: '/tarot/m15.jpg',      // The Devil (XV)
  Ketu: '/tarot/m12.jpg',      // The Hanged Man (XII)
};

const GRAHA_COLOR_MAP: Record<string, string> = {
  Surya: 'text-[#F2D675] border-[#D4AF37]/50 bg-[#D4AF37]/10',
  Chandra: 'text-[#F5F4EC] border-[#F5F4EC]/40 bg-[#F5F4EC]/10',
  Mangala: 'text-[#E08E6D] border-[#E08E6D]/50 bg-[#E08E6D]/10',
  Budha: 'text-[#009B77] border-[#009B77]/50 bg-[#009B77]/10',
  Guru: 'text-[#D4AF37] border-[#D4AF37]/60 bg-[#D4AF37]/15',
  Shukra: 'text-[#EAE5D9] border-[#EAE5D9]/40 bg-[#EAE5D9]/10',
  Shani: 'text-[#AABDB7] border-[#AABDB7]/50 bg-[#AABDB7]/10',
  Rahu: 'text-[#8FA39E] border-[#8FA39E]/40 bg-[#8FA39E]/10',
  Ketu: 'text-[#8FA39E] border-[#8FA39E]/40 bg-[#8FA39E]/10',
};

export function TarotArchetypeShell() {
  const [selectedGraha, setSelectedGraha] = useState<TraditionalGraha | null>(null);
  const grahas: TraditionalGraha[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'];

  const getElementIcon = (elem: string) => {
    if (elem.includes('Fire')) return <Flame className="w-3 h-3 text-amber-400" />;
    if (elem.includes('Water')) return <Droplets className="w-3 h-3 text-blue-400" />;
    if (elem.includes('Air')) return <Wind className="w-3 h-3 text-cyan-300" />;
    if (elem.includes('Earth')) return <Mountain className="w-3 h-3 text-emerald-400" />;
    return <Sparkles className="w-3 h-3 text-[#F2D675]" />;
  };

  return (
    <div className="space-y-6">
      <div className="liquid-glass-panel p-6 rounded-2xl border border-[rgba(212,175,55,0.30)] shadow-xl relative overflow-hidden">
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[#F2D675]" />
            <span>NAVAGRAHA • ESOTERIC CORRESPONDENCES</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F5F4EC]">
            Vedic Planetary Archetypes & Esoteric Tarot Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[#AABDB7] max-w-3xl leading-relaxed">
            A precise mapping between the 9 Vedic Navagrahas, classical psychological dimensions, and Major Arcana archetypes rooted in Rider-Waite-Smith iconography and Jyotish symbolism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grahas.map(gName => {
            const arch = GRAHA_ARCHETYPES[gName];
            const cardImg = GRAHA_CARD_IMAGES[gName] || '/tarot/m19.jpg';
            const colorClass = GRAHA_COLOR_MAP[gName] || 'text-[#D4AF37] border-[#D4AF37]/40 bg-[#D4AF37]/10';

            return (
              <div
                key={gName}
                className="liquid-glass-card p-4 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.40)] transition-all duration-300 space-y-3 flex flex-col justify-between group hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] bg-[rgba(5,20,16,0.65)]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(255,255,255,0.08)] mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${colorClass}`}>
                        {arch.graha}
                      </span>
                      <span className="text-[11px] font-mono text-[#D4AF37]">({arch.sanskrit})</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#AABDB7] uppercase">
                      {getElementIcon(arch.element)}
                      <span>{arch.element}</span>
                    </span>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-16 sm:w-20 shrink-0 aspect-[2/3] rounded-lg border border-[rgba(212,175,55,0.35)] overflow-hidden shadow-md bg-black/60 relative group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={cardImg}
                        alt={arch.tarotCard}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5 text-xs">
                      <div className="font-serif font-bold text-sm text-[#F5F4EC]">
                        {arch.tarotCard}
                      </div>
                      <div className="text-[11px] text-[#AABDB7]">
                        <span className="text-[#D4AF37] font-mono text-[9.5px] uppercase tracking-wider block font-semibold">
                          Deity & Archetype
                        </span>
                        {arch.archetype} • {arch.deity}
                      </div>
                      <div className="text-[10px] text-[#8FA39E] line-clamp-2 leading-relaxed font-sans">
                        {arch.psychologicalDimension}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#F2D675] italic pt-2.5 border-t border-[rgba(255,255,255,0.06)] font-serif leading-relaxed">
                  &ldquo;{arch.spiritualLesson}&rdquo;
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
