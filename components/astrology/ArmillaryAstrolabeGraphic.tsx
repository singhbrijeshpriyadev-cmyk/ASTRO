'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';

export function ArmillaryAstrolabeGraphic() {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-100, 100], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div 
      className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center select-none cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* 3D Tilted Astrolabe Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Ambient Backlight Core Halo */}
        <motion.div 
          animate={{
            scale: isHovered ? [1, 1.15, 1.05] : [1, 1.08, 1],
            opacity: isHovered ? [0.4, 0.7, 0.5] : [0.25, 0.45, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-4 rounded-full bg-radial from-[rgba(212,175,55,0.22)] via-[rgba(0,107,91,0.14)] to-transparent blur-2xl pointer-events-none"
        />

        {/* Master Astrolabe SVG */}
        <svg 
          viewBox="0 0 320 320" 
          className="w-full h-full overflow-visible drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Glow Filters */}
            <filter id="goldGlowAstrolabe" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="coreGlowAstrolabe" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradients */}
            <linearGradient id="astrolabeBrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F4EC" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#F2D675" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8A6E1E" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="meridianGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00A896" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00A896" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 1. OUTER HORIZON CIRCLE with Degree Calibrations */}
          <circle 
            cx="160" 
            cy="160" 
            r="150" 
            fill="none" 
            stroke="rgba(212, 175, 55, 0.22)" 
            strokeWidth="1.2" 
          />
          <circle 
            cx="160" 
            cy="160" 
            r="144" 
            fill="none" 
            stroke="rgba(212, 175, 55, 0.12)" 
            strokeWidth="0.8" 
            strokeDasharray="2 4" 
          />

          {/* 4 Cardinal Markers (Vedic Coordinates) */}
          <text x="160" y="24" fill="#F2D675" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">0° UTTARA</text>
          <text x="298" y="163" fill="#D4AF37" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">90° PURVA</text>
          <text x="160" y="304" fill="#F2D675" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">180° DAKSHINA</text>
          <text x="22" y="163" fill="#D4AF37" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">270° PASHCHIMA</text>

          {/* 2. ROTATING ZODIAC RING (Clockwise, 60s loop) */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '160px 160px' }}
          >
            <circle 
              cx="160" 
              cy="160" 
              r="132" 
              fill="none" 
              stroke="url(#astrolabeBrass)" 
              strokeWidth="1.5" 
              filter="url(#goldGlowAstrolabe)"
            />

            {/* 12 Rashi Division Tick Lines */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 160 + Math.cos(angle) * 126;
              const y1 = 160 + Math.sin(angle) * 126;
              const x2 = 160 + Math.cos(angle) * 138;
              const y2 = 160 + Math.sin(angle) * 138;
              return (
                <line 
                  key={`rashi-tick-${i}`} 
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="#F2D675" 
                  strokeWidth="1.2" 
                />
              );
            })}

            {/* Orbiting Solar Marker on Zodiac Ring */}
            <g transform="translate(160, 28)">
              <circle cx="0" cy="0" r="5.5" fill="#F2D675" filter="url(#goldGlowAstrolabe)" />
              <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
              {/* Sun Ray Beams */}
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i * 45 * Math.PI) / 180;
                return (
                  <line 
                    key={`sun-ray-${i}`}
                    x1={Math.cos(a) * 7}
                    y1={Math.sin(a) * 7}
                    x2={Math.cos(a) * 10}
                    y2={Math.sin(a) * 10}
                    stroke="#F2D675"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          </motion.g>

          {/* 3. TILTED ECLIPTIC / NAKSHATRA RING (Counter-clockwise, 45s loop) */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '160px 160px' }}
          >
            {/* Elliptical tilted ecliptic plane */}
            <ellipse 
              cx="160" 
              cy="160" 
              rx="115" 
              ry="75" 
              fill="none" 
              stroke="url(#meridianGrad)" 
              strokeWidth="1.6" 
              strokeDasharray="4 2"
              transform="rotate(-23.4 160 160)" 
            />

            {/* Orbiting Lunar Pearl on Nakshatra Ring */}
            <g transform="translate(265, 125)">
              <circle cx="0" cy="0" r="4.5" fill="#F5F4EC" filter="url(#goldGlowAstrolabe)" />
              <circle cx="1.5" cy="-0.5" r="3.2" fill="#061411" opacity="0.6" />
            </g>
          </motion.g>

          {/* 4. SECONDARY OPPOSING ORBITAL MERIDIAN RING */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '160px 160px' }}
          >
            <ellipse 
              cx="160" 
              cy="160" 
              rx="75" 
              ry="115" 
              fill="none" 
              stroke="rgba(0, 155, 119, 0.45)" 
              strokeWidth="1.2" 
              transform="rotate(35 160 160)" 
            />

            {/* Orbiting Lagna Diamond Node */}
            <g transform="translate(195, 55)">
              <polygon points="0,-4.5 4.5,0 0,4.5 -4.5,0" fill="#009B77" filter="url(#goldGlowAstrolabe)" />
              <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            </g>
          </motion.g>

          {/* 5. INNER CALIBRATED ASTROLABE DISK */}
          <circle 
            cx="160" 
            cy="160" 
            r="82" 
            fill="rgba(11, 33, 27, 0.55)" 
            stroke="rgba(212, 175, 55, 0.35)" 
            strokeWidth="1" 
          />

          {/* 27 Nakshatra Rays emanating from center */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '160px 160px' }}
          >
            {Array.from({ length: 27 }).map((_, i) => {
              const angle = (i * (360 / 27) * Math.PI) / 180;
              const x1 = 160 + Math.cos(angle) * 35;
              const y1 = 160 + Math.sin(angle) * 35;
              const x2 = 160 + Math.cos(angle) * 80;
              const y2 = 160 + Math.sin(angle) * 80;
              return (
                <line 
                  key={`nakshatra-${i}`} 
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke={i % 3 === 0 ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0.12)'} 
                  strokeWidth={i % 3 === 0 ? '0.8' : '0.4'} 
                />
              );
            })}
          </motion.g>

          {/* 6. CENTRAL SACRED BINDU / OBSERVER CORE */}
          <circle 
            cx="160" 
            cy="160" 
            r="32" 
            fill="url(#astrolabeBrass)" 
            opacity="0.15" 
          />
          <circle 
            cx="160" 
            cy="160" 
            r="24" 
            fill="#061411" 
            stroke="#D4AF37" 
            strokeWidth="1.8" 
            filter="url(#goldGlowAstrolabe)"
          />

          {/* Breathing Core Energy Pulse */}
          <motion.circle 
            cx="160" 
            cy="160" 
            r="16" 
            fill="none" 
            stroke="#F2D675" 
            strokeWidth="1.5"
            animate={{
              r: [14, 22, 14],
              opacity: [0.8, 0.1, 0.8],
              strokeWidth: [1.5, 0.5, 1.5],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Center Sacred Glyph */}
          <text 
            x="160" 
            y="166" 
            fill="#F2D675" 
            fontFamily="serif" 
            fontSize="18" 
            fontWeight="bold" 
            textAnchor="middle"
            filter="url(#goldGlowAstrolabe)"
          >
            काल
          </text>
        </svg>

        {/* Floating Ring Particle Sparkles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 pointer-events-none"
        >
          <span className="absolute top-6 left-1/2 w-1.5 h-1.5 rounded-full bg-[#F2D675] shadow-[0_0_8px_#F2D675]" />
          <span className="absolute bottom-10 right-1/4 w-1 h-1 rounded-full bg-[#F5F4EC] shadow-[0_0_6px_#F5F4EC]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
