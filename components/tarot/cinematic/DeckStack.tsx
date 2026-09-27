'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TarotCardBack } from './TarotCardBack';

interface DeckStackProps {
  cardCount?: number;
  onClick?: () => void;
  isHoverable?: boolean;
  className?: string;
}

export function DeckStack({
  cardCount = 20,
  onClick,
  isHoverable = true,
  className = '',
}: DeckStackProps) {
  // Precompute pseudo-random slight rotations for realistic physical stack feel
  const stackOffsets = React.useMemo(() => {
    return Array.from({ length: cardCount }, (_, i) => ({
      y: -i * 1.4,
      rotZ: ((i * 7) % 11 - 5) * 0.28, // between -1.4° and +1.4°
      x: ((i * 13) % 7 - 3) * 0.35,   // between -1.0px and +1.0px
    }));
  }, [cardCount]);

  return (
    <motion.div
      onClick={onClick}
      whileHover={isHoverable ? { y: -6, scale: 1.02 } : {}}
      whileTap={isHoverable ? { scale: 0.98 } : {}}
      className={`relative w-[190px] sm:w-[210px] aspect-[7/12] cursor-pointer select-none ${className}`}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {/* Ground drop shadow under the physical deck */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-8 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(123,3,35,0.20) 40%, transparent 75%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Layered stack cards */}
      {stackOffsets.map((offset, idx) => {
        const isTop = idx === cardCount - 1;
        return (
          <div
            key={idx}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, ${idx * 0.5}px) rotateZ(${offset.rotZ}deg)`,
              zIndex: idx,
              boxShadow: isTop
                ? '0 16px 36px rgba(0,0,0,0.7), 0 0 20px rgba(0,155,119,0.22)'
                : '0 2px 4px rgba(0,0,0,0.45)',
            }}
          >
            {isTop ? (
              <TarotCardBack isHovered={false} />
            ) : (
              <div
                className="w-full h-full rounded-2xl border border-[rgba(212,175,55,0.3)]"
                style={{
                  background: idx % 2 === 0 ? '#0B211B' : '#081A15',
                }}
              />
            )}
          </div>
        );
      })}

      {/* Subtle outer gold table glow */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />
    </motion.div>
  );
}
