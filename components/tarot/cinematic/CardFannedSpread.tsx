'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCardBack } from './TarotCardBack';
import { tarotAudio } from '@/lib/tarot/sound-effects';
import { ChevronLeft, ChevronRight, Sparkles, Layers } from 'lucide-react';

interface CardFannedSpreadProps {
  totalCards?: number;
  selectedIndices: number[];
  onSelectCard: (index: number) => void;
  onHoverCard?: (index: number | null) => void;
  disabled?: boolean;
  promptText?: string;
}

export function CardFannedSpread({
  totalCards = 78,
  selectedIndices,
  onSelectCard,
  onHoverCard,
  disabled = false,
  promptText = 'Select your card from the fanned deck',
}: CardFannedSpreadProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [lastClickedIdx, setLastClickedIdx] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Staggered entry flag for cascade fanning
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHasMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseCoord({ x, y });
  };

  const handleCardClick = (idx: number) => {
    if (disabled || selectedIndices.includes(idx)) return;
    setLastClickedIdx(idx);
    tarotAudio.playDraw();
    onSelectCard(idx);
  };

  const handleCardHover = (idx: number | null) => {
    if (disabled) return;
    setHoveredIdx(idx);
    if (onHoverCard) {
      onHoverCard(idx);
    }
    if (idx !== null && !selectedIndices.includes(idx)) {
      tarotAudio.playSelect();
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const remainingCount = totalCards - selectedIndices.length;

  return (
    <div className="w-full flex flex-col items-center select-none py-3">
      {/* Header Prompt & Deck HUD */}
      <div className="flex items-center justify-between w-full max-w-5xl px-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] flex items-center justify-center text-[#F2D675] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#F2D675] font-semibold block">
              {promptText}
            </span>
            <span className="text-[10px] font-mono text-[#8BB5A8] tracking-wider">
              {remainingCount} cards remaining in consecrated ribbon • Hover to resonate
            </span>
          </div>
        </div>

        {/* Scroll Navigation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={scrollLeft}
            type="button"
            className="p-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Scroll ribbon left"
            title="Pan left across ribbon"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            type="button"
            className="p-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Scroll ribbon right"
            title="Pan right across ribbon"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Fanned Cards Viewport */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-12 px-6 sm:px-16 flex items-center justify-start sm:justify-center relative"
        style={{
          perspective: 1400,
          scrollBehavior: 'smooth',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div
          className="flex items-center pl-12 pr-28 py-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {Array.from({ length: totalCards }).map((_, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const isHovered = hoveredIdx === idx && !isSelected;
            const isAscending = lastClickedIdx === idx;

            // Natural Parabolic Arc calculation across all 78 cards
            const normalizedPos = (idx - totalCards / 2) / (totalCards / 2);
            const naturalFanAngle = normalizedPos * 5.5; // Natural subtle fan curvature
            const naturalElevation = Math.cos(normalizedPos * (Math.PI / 2)) * -6;

            // Neighbor wave dispersion calculation
            let neighborOffset = 0;
            if (hoveredIdx !== null && !isSelected) {
              const diff = idx - hoveredIdx;
              if (Math.abs(diff) === 1) {
                neighborOffset = diff * 22; // smooth neighbor spreading
              } else if (Math.abs(diff) === 2) {
                neighborOffset = diff * 10;
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
                onClick={() => handleCardClick(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(idx);
                  }
                }}
                className={`relative flex-shrink-0 w-[114px] sm:w-[134px] aspect-[7/12] cursor-pointer pointer-events-auto transition-opacity duration-300 ${
                  isSelected ? 'opacity-20 pointer-events-none' : 'opacity-100'
                }`}
                style={{
                  marginLeft: idx === 0 ? 0 : '-72px', // Overlapping deck ribbon
                  zIndex: isAscending ? 200 : isHovered ? 150 : isSelected ? 1 : idx + 2,
                }}
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.85,
                  rotateZ: naturalFanAngle * 1.5,
                }}
                animate={{
                  opacity: isAscending ? [1, 1, 0] : isSelected ? 0.2 : 1,
                  y: isAscending
                    ? -140
                    : isHovered
                    ? -36
                    : hasMounted
                    ? naturalElevation
                    : 0,
                  scale: isAscending
                    ? 1.25
                    : isHovered
                    ? 1.12
                    : 1,
                  rotateZ: isAscending
                    ? (idx % 2 === 0 ? 8 : -8)
                    : isHovered
                    ? 0 // Hovered card straightens up proudly
                    : naturalFanAngle,
                  rotateX: isHovered ? 6 : 0,
                  x: neighborOffset,
                }}
                transition={{
                  y: isAscending
                    ? { duration: 0.65, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 380, damping: 24 },
                  scale: isAscending
                    ? { duration: 0.65, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 380, damping: 24 },
                  rotateZ: { type: 'spring', stiffness: 340, damping: 24 },
                  rotateX: { type: 'spring', stiffness: 340, damping: 24 },
                  opacity: isAscending ? { duration: 0.65, times: [0, 0.7, 1] } : { duration: 0.3 },
                  delay: !hasMounted ? idx * 0.006 : 0, // Staggered cascade entrance on first appearance!
                }}
              >
                {/* Golden & Emerald Hover Aura Bloom */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-[-14%] rounded-3xl pointer-events-none -z-10"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(0,155,119,0.3) 50%, transparent 75%)',
                      filter: 'blur(14px)',
                    }}
                  />
                )}

                {/* Card Back Artwork */}
                <TarotCardBack isHovered={isHovered} />

                {/* Localized Cursor Specular Glow inside hovered card */}
                {isHovered && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle 95px at ${mouseCoord.x}% ${mouseCoord.y}%, rgba(212,175,55,0.25) 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Stardust Emission when Card Ascends */}
                <AnimatePresence>
                  {isAscending && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 1.8] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-[-20%] rounded-full pointer-events-none z-50"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(242,214,117,0.7) 0%, rgba(0,155,119,0.4) 40%, transparent 75%)',
                        filter: 'blur(12px)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
