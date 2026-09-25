'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { TarotCard, TarotOrientation } from '@/lib/tarot/types';
import { getTarotCardImageUrl } from '@/lib/tarot/cards';
import { motionTokens } from '@/lib/motion/animationTokens';
import { Sparkles, RotateCw } from 'lucide-react';

export interface LuxuryTarotCardProps {
  card?: TarotCard | {
    id?: string;
    card_id?: string;
    cardId?: string;
    name: string;
    arcana?: any;
    number?: number;
    suit?: string | null;
    imageUrl?: string;
    image_path?: string;
    element?: string;
    [key: string]: any;
  };
  orientation?: TarotOrientation | 'Upright' | 'Reversed' | string;
  isFlipped?: boolean;
  onFlip?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  enable3DTilt?: boolean;
  showMetadata?: boolean;
  className?: string;
  slotLabel?: string;
  showBackHint?: boolean;
  priority?: boolean;
}

export function LuxuryTarotCard({
  card,
  orientation = 'upright',
  isFlipped = true,
  onFlip,
  onClick,
  size = 'md',
  enable3DTilt = true,
  className = '',
  slotLabel,
  showBackHint = true,
  priority = false,
}: LuxuryTarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Tilt Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 200, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Tilt transforms (-10deg to 10deg)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  // Dynamic Specular Light Glint Angle & Opacity
  const glintX = useTransform(smoothMouseX, [-0.5, 0.5], ['0%', '100%']);
  const glintY = useTransform(smoothMouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3DTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const isReversed = String(orientation).toLowerCase() === 'reversed';

  // Size configurations with exact Rider-Waite 7:12 ratio (350x600 px)
  const sizeStyles = {
    sm: 'w-[130px] aspect-[7/12]',
    md: 'w-[190px] sm:w-[210px] aspect-[7/12]',
    lg: 'w-[230px] sm:w-[250px] aspect-[7/12]',
    hero: 'w-[270px] sm:w-[300px] aspect-[7/12]',
  };

  // Image source resolution
  const imageUrl = card 
    ? (('imageUrl' in card && card.imageUrl) || ('image_path' in card && card.image_path) || getTarotCardImageUrl(card as any))
    : '/tarot/m00.jpg';

  const isInteractive = Boolean(onFlip || onClick);

  return (
    <div
      ref={cardRef}
      onClick={() => {
        if (onClick) onClick();
        else if (onFlip) onFlip();
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${sizeStyles[size]} ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Outer 3D Card Shell */}
      <motion.div
        style={{
          rotateX: enable3DTilt ? rotateX : 0,
          rotateY: enable3DTilt ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -6 : 0,
        }}
        transition={{ duration: 0.25, ease: motionTokens.ease.standard }}
        className="w-full h-full relative rounded-[14px] shadow-[0_16px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_22px_50px_rgba(212,175,55,0.3),0_0_35px_rgba(0,155,119,0.2)] transition-shadow duration-300"
      >
        {/* Real Gilded Card Edge Bevel (Gold Leaf Rim) */}
        <div 
          className="absolute -inset-[1.5px] rounded-[15.5px] bg-gradient-to-br from-[#F5F4EC] via-[#D4AF37] to-[#8A6E1E] opacity-95 pointer-events-none z-0 shadow-sm" 
          style={{ transform: 'translateZ(-1px)' }}
        />

        {/* 3D Flip Rotating Container */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full h-full relative rounded-[14px] overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ================================================================= */}
          {/* 1. CARD BACK (Traditional Sacred Obsidian & Gold Foil Yantra)      */}
          {/* ================================================================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-[14px] bg-gradient-to-br from-[#061814] via-[#0B251F] to-[#04120E] border-2 border-[rgba(212,175,55,0.7)] p-2.5 flex flex-col justify-between overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            {/* Ambient Nebula Underglow */}
            <div className="absolute inset-0 bg-radial from-[rgba(0,155,119,0.18)] via-transparent to-[rgba(212,175,55,0.06)] pointer-events-none" />

            {/* Inner Double Hairline Gold Border with Corner Ornaments */}
            <div className="relative w-full h-full rounded-[10px] border border-[rgba(212,175,55,0.5)] p-2 flex flex-col items-center justify-between">
              <div className="absolute inset-1 rounded-[7px] border border-[rgba(212,175,55,0.25)] pointer-events-none" />

              {/* Corner Star Filigrees */}
              <span className="absolute top-1 left-1.5 text-[9px] text-[#D4AF37]/80 font-mono">✦</span>
              <span className="absolute top-1 right-1.5 text-[9px] text-[#D4AF37]/80 font-mono">✦</span>
              <span className="absolute bottom-1 left-1.5 text-[9px] text-[#D4AF37]/80 font-mono">✦</span>
              <span className="absolute bottom-1 right-1.5 text-[9px] text-[#D4AF37]/80 font-mono">✦</span>

              {/* Top Banner */}
              <div className="text-[8.5px] font-mono tracking-[0.25em] text-[#D4AF37]/90 uppercase pt-1">
                {slotLabel || 'KAALIKA'}
              </div>

              {/* Central Sacred Sri Yantra & Astrolabe Medallion */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center">
                {/* Rotating Outer Sacred Sun Ring */}
                <svg className="absolute inset-0 w-full h-full text-[#D4AF37]/50 animate-spin" style={{ animationDuration: '45s' }} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#009B77" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
                  {Array.from({ length: 16 }).map((_, i) => {
                    const a = (i * 22.5 * Math.PI) / 180;
                    return (
                      <line
                        key={`back-ray-${i}`}
                        x1={60 + Math.cos(a) * 48}
                        y1={60 + Math.sin(a) * 48}
                        x2={60 + Math.cos(a) * 53}
                        y2={60 + Math.sin(a) * 53}
                        stroke="#F2D675"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                </svg>

                {/* Inner Double Triangles (Hexagram Sacred Bindu) */}
                <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] text-[#D4AF37]/70" viewBox="0 0 100 100">
                  <polygon points="50,14 82,70 18,70" fill="none" stroke="currentColor" strokeWidth="0.9" />
                  <polygon points="50,86 82,30 18,30" fill="none" stroke="currentColor" strokeWidth="0.9" />
                  <circle cx="50" cy="50" r="16" fill="rgba(6,20,17,0.9)" stroke="#F2D675" strokeWidth="1" />
                </svg>

                {/* Center Sanskrit Glyph */}
                <div className="relative z-10 font-serif text-lg sm:text-xl font-bold text-[#F2D675] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                  काल
                </div>
              </div>

              {/* Bottom Guidance or Tap Hint */}
              <div className="text-center pb-1">
                {showBackHint && (
                  <div className="inline-flex items-center gap-1 text-[9px] font-mono text-[#F2D675] tracking-widest uppercase animate-pulse">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>TAP TO REVEAL</span>
                  </div>
                )}
                <div className="text-[8.5px] font-mono tracking-[0.25em] text-[#D4AF37]/90 uppercase mt-0.5">
                  ASTRA
                </div>
              </div>
            </div>

            {/* Dynamic Holographic Foil Glint on Hover */}
            <motion.div
              style={{
                background: `radial-gradient(circle at ${glintX} ${glintY}, rgba(255, 255, 255, 0.22) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 70%)`,
              }}
              className="absolute inset-0 pointer-events-none"
            />
          </div>

          {/* ================================================================= */}
          {/* 2. CARD FRONT (Authentic Real Tarot Card Face - High Fidelity)      */}
          {/* ================================================================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-[14px] bg-[#F7F5EE] border-2 border-[rgba(212,175,55,0.85)] p-[3px] flex flex-col overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Inner Parchment & Real Artwork Altar */}
            <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[#FAF8F5] border border-[rgba(212,175,55,0.35)] shadow-inner flex items-center justify-center">
              {/* Authentic Uncropped Rider-Waite Face */}
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={card?.name || 'Tarot Card'}
                  fill
                  quality={95}
                  priority={priority}
                  className={`object-fill transition-transform duration-700 ${
                    isReversed ? 'rotate-180' : ''
                  }`}
                  sizes="(max-width: 640px) 190px, (max-width: 1024px) 250px, 350px"
                  style={{
                    filter: 'contrast(1.06) brightness(1.02) saturate(1.06)',
                    imageRendering: '-webkit-optimize-contrast',
                  }}
                />
              </div>

              {/* Reversed State Glass Pill Indicator */}
              {isReversed && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/80 text-amber-300 text-[9px] font-mono font-semibold uppercase tracking-wider shadow-lg flex items-center gap-1 z-20 pointer-events-none">
                  <RotateCw className="w-2.5 h-2.5 text-amber-300" />
                  <span>Reversed</span>
                </div>
              )}

              {/* Dynamic Holographic Foil Glint Across Real Card Face */}
              <motion.div
                style={{
                  background: `radial-gradient(circle at ${glintX} ${glintY}, rgba(255, 255, 255, 0.38) 0%, rgba(212, 175, 55, 0.18) 32%, transparent 68%)`,
                }}
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
