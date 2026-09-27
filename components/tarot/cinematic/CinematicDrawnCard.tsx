'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { getTarotCardImageUrl } from '@/lib/tarot/cards';
import { TarotCardBack } from './TarotCardBack';
import { tarotAudio } from '@/lib/tarot/sound-effects';
import { Eye, Compass, Flame, Droplets, Wind, Mountain, Sparkles } from 'lucide-react';

interface CinematicDrawnCardProps {
  card: TarotCard;
  orientation: TarotOrientation;
  slotTitle: string;
  slotSubtitle: string;
  isFlipped: boolean;
  onFlipTrigger?: () => void;
  onCardClick?: () => void;
  autoFlipDelayMs?: number;
  onRevealComplete?: () => void;
}

export function CinematicDrawnCard({
  card,
  orientation,
  slotTitle,
  slotSubtitle,
  isFlipped,
  onFlipTrigger,
  onCardClick,
  autoFlipDelayMs = 250,
  onRevealComplete,
}: CinematicDrawnCardProps) {
  // Draw stages: 'entering' -> 'flipping' -> 'revealed' -> 'settled'
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showGleam, setShowGleam] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  // 3D Parallax tilt & cursor glow coordinates
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glintPos, setGlintPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Orchestrated sequential animation trigger
  useEffect(() => {
    if (isFlipped && !internalFlipped) {
      // 1. Play draw flight sound
      tarotAudio.playDraw();

      // 2. Start 3D Flip after flight arrival
      const tFlip = setTimeout(() => {
        setIsFlipping(true);
        tarotAudio.playFlip();
        setInternalFlipped(true);

        // 3. At 350ms: Card reaches beyond 90° -> Celestial light burst & sacred Solfeggio chime
        const tBurst = setTimeout(() => {
          setShowBurst(true);
          setShowGleam(true);
          tarotAudio.playReveal();
        }, 350);

        // 4. At 650ms: Card settles back down into table slot
        const tSettle = setTimeout(() => {
          setIsFlipping(false);
          setIsSettled(true);
        }, 650);

        // 5. At 800ms: Slide up the interpretation & keywords panel
        const tMeaning = setTimeout(() => {
          setShowMeaning(true);
          if (onRevealComplete) {
            onRevealComplete();
          }
        }, 820);

        return () => {
          clearTimeout(tBurst);
          clearTimeout(tSettle);
          clearTimeout(tMeaning);
        };
      }, autoFlipDelayMs);

      return () => clearTimeout(tFlip);
    }
  }, [isFlipped, internalFlipped, autoFlipDelayMs, onRevealComplete]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain tilt to ±3.2° max for restrained luxury feel
    const tiltY = ((x - 50) / 50) * 3.2;
    const tiltX = -((y - 50) / 50) * 3.2;

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
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85, rotateZ: -4 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 22,
        mass: 0.9,
      }}
      className="flex flex-col items-center select-none w-full max-w-[240px]"
    >
      {/* Slot Label (e.g. CARD 1: PAST) */}
      <div className="text-center mb-3">
        <span className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          {slotTitle}
        </span>
        <span className="text-[10px] font-sans text-[#8BB5A8] tracking-wide block">
          {slotSubtitle}
        </span>
      </div>

      {/* 3D Card Stage with Dynamic Shadow */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={internalFlipped ? onCardClick : onFlipTrigger}
        className="relative w-[180px] sm:w-[200px] aspect-[7/12] cursor-pointer group"
        style={{ perspective: 1400 }}
      >
        {/* Dynamic Ground Shadow underneath the card */}
        <motion.div
          className="absolute -bottom-4 left-4 right-4 h-6 rounded-full pointer-events-none"
          animate={{
            scale: isFlipping ? 1.25 : 1,
            opacity: isFlipping ? 0.35 : 0.65,
            filter: isFlipping ? 'blur(20px)' : 'blur(10px)',
          }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 0%, transparent 75%)',
          }}
        />

        {/* Golden Summoning Halo / Arrival Pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.2, 1.4] }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-[-10%] rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(0,155,119,0.2) 45%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />

        {/* 350ms Celestial Light Burst upon card reaching 90° */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 2.0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="absolute inset-[-30%] rounded-full pointer-events-none z-50 flex items-center justify-center"
            >
              {/* Concentric radial aura */}
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(242,214,117,0.75) 0%, rgba(0,155,119,0.45) 40%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />

              {/* 8 Starburst Light Rays */}
              {Array.from({ length: 8 }).map((_, rIdx) => (
                <motion.div
                  key={rIdx}
                  className="absolute w-28 h-0.5 pointer-events-none"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 0.9, 0], scaleX: [0, 1.5, 2.2] }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  style={{
                    transform: `rotate(${rIdx * 45}deg)`,
                    background: 'linear-gradient(90deg, transparent 0%, #F2D675 50%, transparent 100%)',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The 3D Rigid Card Body — 120 FPS GPU Accelerated */}
        <motion.div
          className="relative w-full h-full rounded-2xl gpu-120fps"
          animate={{
            rotateY: internalFlipped ? 180 : 0,
            y: isFlipping ? -18 : 0, // Apex lift during 3D flip
            scale: isFlipping ? 1.05 : 1.0,
            rotateX: tilt.x,
            rotateZ: tilt.y * 0.35,
          }}
          transition={{
            rotateY: { duration: 0.75, ease: [0.34, 1.25, 0.64, 1] },
            y: { duration: 0.75, ease: 'easeInOut' },
            scale: { duration: 0.75, ease: 'easeInOut' },
            rotateX: { type: 'spring', stiffness: 360, damping: 26, restDelta: 0.0005 },
            rotateZ: { type: 'spring', stiffness: 360, damping: 26, restDelta: 0.0005 },
          }}
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* ======================================================== */}
          {/* CARD BACK (Visible before & during first half of flip)    */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <TarotCardBack isHovered={true} />

            {/* Prompt pill if waiting for manual flip */}
            {!internalFlipped && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-[rgba(6,20,17,0.85)] border border-[rgba(212,175,55,0.4)] text-[10px] font-mono text-[#F2D675] shadow-lg animate-pulse">
                  Revealing…
                </span>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* CARD FRONT (Visible after 90° flip)                      */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.4)]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(145deg, #0B211B 0%, #102A23 50%, #061411 100%)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.65), 0 0 24px rgba(0,155,119,0.25)',
            }}
          >
            {/* Authentic Rider-Waite Card Artwork */}
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={card.name}
                fill
                sizes="(max-width: 768px) 180px, 200px"
                className={`object-cover transition-transform duration-700 ease-out ${
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

              {/* Diagonally Sweeping Gloss Sheen at reveal */}
              {showGleam && (
                <motion.div
                  initial={{ x: '-120%' }}
                  animate={{ x: '220%' }}
                  transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%)',
                  }}
                />
              )}

              {/* Cursor-tracking Specular Glint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 120px at ${glintPos.x}% ${glintPos.y}%, rgba(255,255,255,0.14) 0%, transparent 60%)`,
                }}
              />

              {/* Top Orientation Badge & Elemental Icon */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                  className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider font-semibold shadow-md ${
                    isReversed
                      ? 'bg-amber-950/85 border border-amber-500/60 text-amber-300'
                      : 'bg-emerald-950/85 border border-emerald-500/60 text-emerald-300'
                  }`}
                >
                  {isReversed ? '↺ REVERSED' : '✦ UPRIGHT'}
                </motion.span>

                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[rgba(6,20,17,0.85)] border border-[rgba(255,255,255,0.12)] shadow-md">
                  {renderElementIcon()}
                </div>
              </div>

              {/* Bottom Card Title & Arcana / Rank */}
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

      {/* ======================================================== */}
      {/* CARD MEANING PANEL (Smooth slide-in after 800ms)         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showMeaning && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full mt-3 p-3 rounded-xl bg-[rgba(16,42,35,0.75)] border border-[rgba(0,155,119,0.35)] backdrop-blur-md shadow-lg text-center"
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
    </motion.div>
  );
}
