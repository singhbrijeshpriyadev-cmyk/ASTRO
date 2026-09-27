'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { getTarotCardImageUrl } from '@/lib/tarot/cards';
import { TarotCardBack } from './TarotCardBack';
import { tarotAudio } from '@/lib/tarot/sound-effects';
import { Sparkles, Eye, Compass, Flame, Droplets, Wind, Mountain } from 'lucide-react';

interface CinematicDrawnCardProps {
  card: TarotCard;
  orientation: TarotOrientation;
  slotTitle: string;
  slotSubtitle: string;
  isFlipped: boolean;
  onFlipTrigger?: () => void;
  onCardClick?: () => void;
  autoFlipDelayMs?: number;
}

export function CinematicDrawnCard({
  card,
  orientation,
  slotTitle,
  slotSubtitle,
  isFlipped,
  onFlipTrigger,
  onCardClick,
  autoFlipDelayMs,
}: CinematicDrawnCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(isFlipped);
  const [showBurst, setShowBurst] = useState(false);
  const [showMeaning, setShowMeaning] = useState(isFlipped);

  // 3D Parallax tilt
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glintPos, setGlintPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger flip sequence
  useEffect(() => {
    if (isFlipped && !internalFlipped) {
      const delay = autoFlipDelayMs ?? 200;
      const tStart = setTimeout(() => {
        tarotAudio.playFlip();
        setInternalFlipped(true);

        // 350ms: light burst & sound
        setTimeout(() => {
          setShowBurst(true);
          tarotAudio.playReveal();
        }, 350);

        // 750ms: show meaning panel
        setTimeout(() => {
          setShowMeaning(true);
        }, 750);
      }, delay);

      return () => clearTimeout(tStart);
    }
  }, [isFlipped, internalFlipped, autoFlipDelayMs]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to ±3° max
    const tiltY = ((x - 50) / 50) * 3;
    const tiltX = -((y - 50) / 50) * 3;

    setTilt({ x: tiltX, y: tiltY });
    setGlintPos({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isReversed = orientation === 'reversed';
  const imageUrl = card.image_path || getTarotCardImageUrl(card);

  // Element Icon
  const renderElementIcon = () => {
    switch (card.element) {
      case 'Fire': return <Flame className="w-3 h-3 text-red-400" />;
      case 'Water': return <Droplets className="w-3 h-3 text-blue-400" />;
      case 'Air': return <Wind className="w-3 h-3 text-cyan-300" />;
      case 'Earth': return <Mountain className="w-3 h-3 text-emerald-400" />;
      default: return <Compass className="w-3 h-3 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[240px]">
      {/* Slot Label (e.g. CARD 1: PAST) */}
      <div className="text-center mb-3">
        <span className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">
          {slotTitle}
        </span>
        <span className="text-[10px] font-sans text-[#8BB5A8] tracking-wide block">
          {slotSubtitle}
        </span>
      </div>

      {/* 3D Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={internalFlipped ? onCardClick : onFlipTrigger}
        className="relative w-[180px] sm:w-[200px] aspect-[7/12] cursor-pointer group"
        style={{ perspective: 1400 }}
      >
        {/* Celestial Light Burst Effect upon 90° flip */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 1.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-[-20%] rounded-full pointer-events-none z-50"
              style={{
                background: 'radial-gradient(circle, rgba(242,214,117,0.7) 0%, rgba(0,155,119,0.4) 40%, transparent 70%)',
                filter: 'blur(14px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Card Flipping Rigid Body */}
        <motion.div
          className="relative w-full h-full rounded-2xl"
          animate={{
            rotateY: internalFlipped ? 180 : 0,
            rotateX: tilt.x,
            rotateZ: tilt.y * 0.4,
          }}
          transition={{
            rotateY: { duration: 0.75, ease: [0.34, 1.15, 0.64, 1] },
            rotateX: { type: 'spring', stiffness: 240, damping: 24 },
            rotateZ: { type: 'spring', stiffness: 240, damping: 24 },
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ================= CARD BACK ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <TarotCardBack isHovered={true} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-2.5 py-1 rounded-full bg-[rgba(6,20,17,0.85)] border border-[rgba(212,175,55,0.4)] text-[10px] font-mono text-[#F2D675] shadow-lg">
                Click to Reveal
              </span>
            </div>
          </div>

          {/* ================= CARD FRONT ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.4)]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(145deg, #0B211B 0%, #102A23 50%, #061411 100%)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.65), 0 0 20px rgba(0,155,119,0.25)',
            }}
          >
            {/* Card Artwork Image */}
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={card.name}
                fill
                sizes="(max-width: 768px) 180px, 200px"
                className={`object-cover transition-transform duration-500 ${
                  isReversed ? 'rotate-180 scale-95' : 'scale-100'
                }`}
                priority
              />

              {/* Liquid Glass Overlay vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(6,20,17,0.88) 0%, rgba(6,20,17,0.1) 45%, rgba(6,20,17,0.4) 100%)',
                }}
              />

              {/* Cursor-tracking Specular Glint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 120px at ${glintPos.x}% ${glintPos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                }}
              />

              {/* Top Orientation Badge */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider font-semibold shadow-md ${
                    isReversed
                      ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                      : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  {isReversed ? '↺ REVERSED' : '✦ UPRIGHT'}
                </span>

                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[rgba(6,20,17,0.8)] border border-[rgba(255,255,255,0.1)]">
                  {renderElementIcon()}
                </div>
              </div>

              {/* Bottom Card Title & Arcana */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-center">
                <h4 className="font-serif text-sm font-bold text-[#F5F4EC] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {card.name}
                </h4>
                <span className="text-[10px] font-mono text-[#D4AF37] block mt-0.5">
                  {card.arcana === 'major' ? `Major Arcana • ${card.number}` : `${card.rank || card.number} of ${card.suit}`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card Meaning Panel below card */}
      <AnimatePresence>
        {showMeaning && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full mt-3 p-3 rounded-xl bg-[rgba(16,42,35,0.7)] border border-[rgba(0,155,119,0.3)] backdrop-blur-md shadow-lg text-center"
          >
            {/* Keywords */}
            <p className="text-[11px] font-mono text-[#D4AF37] leading-relaxed mb-1 font-semibold">
              {(isReversed ? card.keywords_reversed : card.keywords_upright)?.slice(0, 3).join(' • ') ||
                card.keywords_upright?.slice(0, 3).join(' • ')}
            </p>

            {/* Core Message snippet */}
            <p className="text-[11px] font-sans text-[#F5F4EC]/90 line-clamp-3 leading-snug">
              {isReversed ? card.meaning_reversed : card.meaning_upright}
            </p>

            {/* Inspect Link */}
            <button
              onClick={onCardClick}
              type="button"
              className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-[#009B77] hover:text-[#2DDBA0] transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Inspect All Dimensions</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
