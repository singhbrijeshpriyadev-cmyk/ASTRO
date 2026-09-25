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
  maxAlpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface CursorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
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
  '#E08E6D', // Mars copper
];

export function CelestialInteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; prevX: number; prevY: number; active: boolean; moved: boolean }>({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    active: false,
    moved: false,
  });

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

    // Track mouse & generate spark trail
    const cursorSparks: CursorSpark[] = [];

    const onMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current.prevX = prevX;
      mouseRef.current.prevY = prevY;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      mouseRef.current.moved = true;

      // Spawn 1-2 interactive cursor stardust particles when cursor travels
      if (cursorSparks.length < 50 && prevX > -500) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 3) {
          const sparkColor = Math.random() > 0.4 ? '#F2D675' : '#D4AF37';
          cursorSparks.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.8 - dx * 0.05,
            vy: (Math.random() - 0.5) * 0.8 - dy * 0.05 - 0.2,
            radius: Math.random() * 1.6 + 0.6,
            alpha: 0.85,
            color: sparkColor,
            life: 0,
            maxLife: Math.random() * 25 + 20,
          });
        }
      }
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize stars
    const starCount = Math.floor((width * height) / 10000);
    const stars: Star[] = Array.from({ length: Math.min(starCount, 180) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.4,
      baseAlpha: Math.random() * 0.5 + 0.25,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: CELESTIAL_COLORS[Math.floor(Math.random() * CELESTIAL_COLORS.length)],
    }));

    // Initialize 36 stardust particles
    const dustParticles: Stardust[] = Array.from({ length: 36 }, () => {
      const maxLife = Math.random() * 200 + 100;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.14 - 0.06,
        radius: Math.random() * 1.4 + 0.5,
        alpha: Math.random() * 0.4 + 0.15,
        maxAlpha: Math.random() * 0.45 + 0.2,
        color: Math.random() > 0.4 ? '#D4AF37' : '#71B29F',
        life: Math.random() * maxLife,
        maxLife,
      };
    });

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
    let nextShootingStarDelay = Math.random() * 5000 + 4000;

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.35,
        length: Math.random() * 75 + 65,
        speed: Math.random() * 9 + 11,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.28,
        alpha: 1,
        active: true,
        color: Math.random() > 0.3 ? '#F2D675' : '#F5F4EC',
      };
      lastShootingStarTime = Date.now();
      nextShootingStarDelay = Math.random() * 8000 + 5000;
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

      // 1. Dynamic Constellation Filaments near Cursor
      if (mouse.active && !prefersReducedMotion) {
        const nearbyStars: Star[] = [];
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            nearbyStars.push(s);
          }
        }

        // Draw soft golden links between nearby stars
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.14)';
        ctx.lineWidth = 0.75;
        for (let i = 0; i < nearbyStars.length; i++) {
          for (let j = i + 1; j < nearbyStars.length; j++) {
            const s1 = nearbyStars[i];
            const s2 = nearbyStars[j];
            const d = Math.hypot(s1.x - s2.x, s1.y - s2.y);
            if (d < 110) {
              const alpha = (1 - d / 110) * 0.22;
              ctx.strokeStyle = `rgba(242, 214, 117, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        let currentAlpha = prefersReducedMotion
          ? s.baseAlpha
          : s.baseAlpha + Math.sin(tick * s.twinkleSpeed + s.twinklePhase) * 0.28;

        currentAlpha = Math.max(0.12, Math.min(0.95, currentAlpha));

        // Subtle mouse proximity glow
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            currentAlpha = Math.min(1, currentAlpha + (1 - dist / 150) * 0.45);
          }
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Delicate star aura on brighter stars
        if (s.radius > 1.1 && currentAlpha > 0.55) {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = (currentAlpha - 0.45) * 0.32;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Drifting Stardust Particles
      if (!prefersReducedMotion) {
        for (let i = 0; i < dustParticles.length; i++) {
          const p = dustParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          const progress = p.life / p.maxLife;
          const fadeAlpha = Math.sin(progress * Math.PI) * p.maxAlpha;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.05, fadeAlpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife) {
            p.life = 0;
            p.x = Math.random() * width;
            p.y = Math.random() * height;
          }
        }
      }

      // 4. Draw Interactive Cursor Stardust Wake
      if (!prefersReducedMotion) {
        for (let i = cursorSparks.length - 1; i >= 0; i--) {
          const sp = cursorSparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.life += 1;
          const ratio = 1 - sp.life / sp.maxLife;

          if (ratio <= 0) {
            cursorSparks.splice(i, 1);
            continue;
          }

          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sp.alpha * ratio;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius * (0.6 + ratio * 0.4), 0, Math.PI * 2);
          ctx.fill();

          // Soft spark glow aura
          ctx.globalAlpha = sp.alpha * ratio * 0.25;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Shooting Star Graphic
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
        grad.addColorStop(0.7, `${shootingStar.color}77`);
        grad.addColorStop(1, `${shootingStar.color}FF`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.9;
        ctx.globalAlpha = Math.max(0, shootingStar.alpha);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        // Glowing head particle
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.max(0, shootingStar.alpha);
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        shootingStar.x += cos * shootingStar.speed;
        shootingStar.y += sin * shootingStar.speed;
        shootingStar.alpha -= 0.015;

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
      style={{ opacity: 0.9 }}
    />
  );
}

