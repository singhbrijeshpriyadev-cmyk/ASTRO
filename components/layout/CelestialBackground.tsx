'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import { CelestialInteractiveCanvas } from './CelestialInteractiveCanvas';

export function CelestialBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* LAYER 1: Deep Peacock Green & Obsidian Canvas Base */}
      <div className="absolute inset-0 bg-[#061411]" />

      {/* LAYER 1.5: Interactive GPU Stardust, Twinkling Constellations & Shooting Stars */}
      <CelestialInteractiveCanvas />

      {/* LAYER 2: Slow Teal Atmospheric Glow */}
      <motion.div
        className="absolute -top-[20%] left-[10%] w-[900px] h-[700px] rounded-full bg-radial from-[rgba(0,107,91,0.16)] via-[rgba(0,107,91,0.05)] to-transparent blur-[80px]"
        animate={reduceMotion ? undefined : {
          x: [0, 6, -4, 0],
          y: [0, -5, 4, 0],
          opacity: [0.85, 1, 0.9, 0.85],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* LAYER 3: Very Subtle Nebula Movement (Secondary cosmic teal swirl) */}
      <motion.div
        className="absolute top-[40%] -right-[15%] w-[800px] h-[800px] rounded-full bg-radial from-[rgba(0,155,119,0.07)] via-[rgba(0,107,91,0.04)] to-transparent blur-[100px]"
        animate={reduceMotion ? undefined : {
          x: [0, -6, 5, 0],
          y: [0, 6, -4, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* LAYER 4: Constellation Stars & Astronomical Coordinate Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="astronomical-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#astronomical-grid-pattern)" />
        
        {/* Subtle Constellation Points */}
        <circle cx="12%" cy="18%" r="1" fill="#F2D675" />
        <circle cx="18%" cy="14%" r="1.5" fill="#F5F4EC" />
        <circle cx="28%" cy="22%" r="1" fill="#D4AF37" />
        <circle cx="72%" cy="12%" r="1.5" fill="#F5F4EC" />
        <circle cx="85%" cy="26%" r="1" fill="#D4AF37" />
        <circle cx="92%" cy="18%" r="1.2" fill="#F2D675" />
        <circle cx="48%" cy="85%" r="1" fill="#F5F4EC" />
        <circle cx="62%" cy="78%" r="1.2" fill="#D4AF37" />
      </svg>

      {/* LAYER 5: Moon / Celestial Horizon Ring (Upper right) */}
      <motion.div
        className="absolute -top-24 -right-16 w-80 h-80 rounded-full border border-[rgba(212,175,55,0.08)] bg-radial from-[rgba(212,175,55,0.04)] via-transparent to-transparent"
        animate={reduceMotion ? undefined : {
          x: [0, 3, -2, 0],
          y: [0, -3, 2, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-4 rounded-full border border-[rgba(212,175,55,0.04)]" />
      </motion.div>

      {/* LAYER 6: Very Faint Sacred Sanskrit Watermark (Bottom right) */}
      <div 
        className="absolute -bottom-12 right-4 font-serif text-[180px] sm:text-[240px] text-[#D4AF37]/[0.018] leading-none select-none pointer-events-none"
      >
        काल
      </div>
    </div>
  );
}
