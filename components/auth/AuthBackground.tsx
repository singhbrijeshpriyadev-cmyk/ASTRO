'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MousePos { x: number; y: number }

// ─── Gradient Orbs ───────────────────────────────────────────────────────────
const ORB_CONFIG = [
  { size: 700, color: 'rgba(0,107,91,0.18)', x: '10%',  y: '20%', dur: 28, dx: 120, dy: 80  },
  { size: 500, color: 'rgba(0,155,119,0.12)', x: '70%', y: '60%', dur: 22, dx: -90, dy: 120 },
  { size: 600, color: 'rgba(6,20,17,0.0)',    x: '50%', y: '-5%', dur: 34, dx: 60,  dy: 100 },
  { size: 400, color: 'rgba(16,42,35,0.20)',  x: '85%', y: '75%', dur: 26, dx: -80, dy: -60 },
  { size: 350, color: 'rgba(0,107,91,0.10)',  x: '5%',  y: '80%', dur: 30, dx: 100, dy: -90 },
];

export function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ORB_CONFIG.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, o.dx, o.dx * 0.4, 0],
            y: [0, o.dy * 0.5, o.dy, 0],
          }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        />
      ))}
    </div>
  );
}

// ─── Particle Field ───────────────────────────────────────────────────────────
interface Particle {
  id: number; x: number; y: number;
  size: number; opacity: number; dur: number; delay: number;
}

export function ParticleField({ mousePos }: { mousePos: MousePos }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.3 ? 2 : 1,
      opacity: 0.12 + Math.random() * 0.22,
      dur: 8 + Math.random() * 14,
      delay: Math.random() * -12,
    })), []);

  if (!mounted) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => {
        // Subtle magnetic pull toward cursor
        const px = (p.x / 100) * vw;
        const py = (p.y / 100) * vh;
        const dx = (mousePos.x - px) * 0.015;
        const dy = (mousePos.y - py) * 0.015;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size,
              left: `${p.x}%`, top: `${p.y}%`,
              background: p.size > 1
                ? 'radial-gradient(circle, rgba(0,155,119,0.9) 0%, rgba(212,175,55,0.4) 100%)'
                : 'rgba(245,244,236,0.7)',
              boxShadow: p.size > 1 ? '0 0 4px rgba(0,155,119,0.6)' : 'none',
            }}
            animate={{
              opacity: [p.opacity, p.opacity * 0.3, p.opacity],
              y: [0, -18, 0],
              x: [dx, dx * 0.5, dx],
            }}
            transition={{
              duration: p.dur, delay: p.delay,
              repeat: Infinity, ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Cursor Light ─────────────────────────────────────────────────────────────
export function CursorLight({ mousePos }: { mousePos: MousePos }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none hidden md:block"
      style={{
        background: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px,
          rgba(0,155,119,0.09) 0%,
          rgba(0,107,91,0.04) 40%,
          transparent 70%)`,
      }}
      transition={{ type: 'tween', duration: 0.12, ease: 'linear' }}
    />
  );
}

// ─── Full background assembly ─────────────────────────────────────────────────
export function AnimatedBackground({ mousePos }: { mousePos: MousePos }) {
  return (
    <div
      className="fixed inset-0"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(0,107,91,0.20) 0%, transparent 70%),' +
          'radial-gradient(ellipse 60% 55% at 85% 50%, rgba(0,155,119,0.08) 0%, transparent 60%),' +
          'radial-gradient(ellipse 70% 60% at 10% 85%, rgba(0,107,91,0.12) 0%, transparent 65%),' +
          '#061411',
      }}
    >
      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />
      <GradientOrbs />
      <CursorLight mousePos={mousePos} />
      <ParticleField mousePos={mousePos} />
    </div>
  );
}
