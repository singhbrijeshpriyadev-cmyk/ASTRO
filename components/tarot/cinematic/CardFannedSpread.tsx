'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { TarotCardBack } from './TarotCardBack';
import { tarotAudio } from '@/lib/tarot/sound-effects';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CardFannedSpreadProps {
  totalCards?: number;
  selectedIndices: number[];
  onSelectCard: (index: number) => void;
  disabled?: boolean;
  promptText?: string;
}

export function CardFannedSpread({
  totalCards = 78,
  selectedIndices,
  onSelectCard,
  disabled = false,
  promptText = 'Select your card from the fanned deck',
}: CardFannedSpreadProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Localized cursor coordinate tracking inside hovered card
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseCoord({ x, y });
  };

  const handleCardHover = (idx: number | null) => {
    if (disabled) return;
    setHoveredIdx(idx);
    if (idx !== null && !selectedIndices.includes(idx)) {
      tarotAudio.playSelect();
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2">
      {/* Header Prompt */}
      <div className="flex items-center justify-between w-full max-w-4xl px-4 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2D675]">
            {promptText}
          </span>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={scrollLeft}
            type="button"
            className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            type="button"
            className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Fanned Cards Viewport */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-8 px-6 sm:px-12 flex items-center justify-start sm:justify-center"
        style={{
          perspective: 1400,
          scrollBehavior: 'smooth',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex items-center pl-10 pr-20" style={{ transformStyle: 'preserve-3d' }}>
          {Array.from({ length: totalCards }).map((_, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const isHovered = hoveredIdx === idx && !isSelected;

            // Neighbor dispersion calculation
            let neighborOffset = 0;
            if (hoveredIdx !== null && !isSelected) {
              const diff = idx - hoveredIdx;
              if (Math.abs(diff) === 1) {
                neighborOffset = diff * 12; // push immediate neighbors away
              } else if (Math.abs(diff) === 2) {
                neighborOffset = diff * 6;
              }
            }

            return (
              <motion.div
                key={idx}
                id={`fanned-card-${idx}`}
                role="button"
                tabIndex={0}
                aria-label={`Select Tarot card ${idx + 1}`}
                onMouseEnter={() => handleCardHover(idx)}
                onMouseLeave={() => handleCardHover(null)}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onClick={() => {
                  if (!disabled && !isSelected) {
                    onSelectCard(idx);
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isSelected) {
                    onSelectCard(idx);
                  }
                }}
                className={`relative flex-shrink-0 w-[110px] sm:w-[130px] aspect-[7/12] cursor-pointer transition-opacity duration-300 pointer-events-auto ${
                  isSelected ? 'opacity-20 pointer-events-none' : 'opacity-100'
                }`}
                style={{
                  marginLeft: idx === 0 ? 0 : '-68px', // Overlapping fanned deck
                  zIndex: isHovered ? 120 : isSelected ? 1 : idx + 2,
                }}
                animate={{
                  y: isHovered ? -26 : 0,
                  scale: isHovered ? 1.08 : 1,
                  rotateX: isHovered ? 4 : 0,
                  x: neighborOffset,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 26,
                }}
              >
                <TarotCardBack isHovered={isHovered} />

                {/* Localized Cursor Glow inside hovered card */}
                {isHovered && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle 90px at ${mouseCoord.x}% ${mouseCoord.y}%, rgba(212,175,55,0.22) 0%, transparent 70%)`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
