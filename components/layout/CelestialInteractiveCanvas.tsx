'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Stardust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
  color: string;
}

const CELESTIAL_COLORS = [
  '#F2D675', // Sun gold
  '#F5F4EC', // Moon pearl
  '#D4AF37', // Imperial gold
  '#009B77', // Celadon emerald
  '#AABDB7', // Celestial celadon
];

export function CelestialInteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize 130 stars
    const starCount = Math.floor((width * height) / 12000);
    const stars: Star[] = Array.from({ length: Math.min(starCount, 160) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.4,
      baseAlpha: Math.random() * 0.5 + 0.25,
      twinkleSpeed: Math.random() * 0.03 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: CELESTIAL_COLORS[Math.floor(Math.random() * CELESTIAL_COLORS.length)],
    }));

    // Initialize 30 stardust particles
    const dustParticles: Stardust[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.15 - 0.05,
      radius: Math.random() * 1.5 + 0.6,
      alpha: Math.random() * 0.4 + 0.15,
      color: Math.random() > 0.4 ? '#D4AF37' : '#71B29F',
    }));

    // Shooting star state
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
      color: '#F2D675',
    };

    let lastShootingStarTime = Date.now();
    let nextShootingStarDelay = Math.random() * 6000 + 4000; // 4-10 seconds

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.4,
        length: Math.random() * 70 + 60,
        speed: Math.random() * 8 + 10,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.3, // roughly 45 degrees downward
        alpha: 1,
        active: true,
        color: Math.random() > 0.3 ? '#F2D675' : '#F5F4EC',
      };
      lastShootingStarTime = Date.now();
      nextShootingStarDelay = Math.random() * 9000 + 6000;
    };

    let tick = 0;

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      tick += 1;

      const mouse = mouseRef.current;

      // 1. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        let currentAlpha = prefersReducedMotion 
          ? s.baseAlpha 
          : s.baseAlpha + Math.sin(tick * s.twinkleSpeed + s.twinklePhase) * 0.25;

        currentAlpha = Math.max(0.1, Math.min(0.9, currentAlpha));

        // Subtle mouse proximity glow
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            currentAlpha = Math.min(1, currentAlpha + (1 - dist / 140) * 0.4);
          }
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Delicate star aura on brighter stars
        if (s.radius > 1.2 && currentAlpha > 0.6) {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = (currentAlpha - 0.5) * 0.35;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Drifting Stardust with Soft Trails
      if (!prefersReducedMotion) {
        for (let i = 0; i < dustParticles.length; i++) {
          const p = dustParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Shooting Star Graphic
      const now = Date.now();
      if (!prefersReducedMotion && !shootingStar.active && now - lastShootingStarTime > nextShootingStarDelay) {
        triggerShootingStar();
      }

      if (shootingStar.active && !prefersReducedMotion) {
        const cos = Math.cos(shootingStar.angle);
        const sin = Math.sin(shootingStar.angle);

        const tailX = shootingStar.x - cos * shootingStar.length;
        const tailY = shootingStar.y - sin * shootingStar.length;

        const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        grad.addColorStop(0, 'rgba(212, 175, 55, 0)');
        grad.addColorStop(0.7, `${shootingStar.color}66`);
        grad.addColorStop(1, `${shootingStar.color}FF`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = Math.max(0, shootingStar.alpha);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        // Head glowing particle
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.max(0, shootingStar.alpha);
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        shootingStar.x += cos * shootingStar.speed;
        shootingStar.y += sin * shootingStar.speed;
        shootingStar.alpha -= 0.016;

        if (shootingStar.alpha <= 0 || shootingStar.x > width + 100 || shootingStar.y > height + 100) {
          shootingStar.active = false;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
