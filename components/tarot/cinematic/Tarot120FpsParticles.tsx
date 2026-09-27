'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  color: string;
  twinkleSpeed: number;
  pulsePhase: number;
}

export function Tarot120FpsParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState<number>(120);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(242, 214, 117,', // Soft Gold
      'rgba(212, 175, 55,',  // Deep Gold
      'rgba(0, 155, 119,',   // Emerald
      'rgba(45, 219, 160,',  // Jade Highlight
      'rgba(230, 230, 250,', // Lavender
    ];

    // Initialize 60 high-performance particles
    const particleCount = 56;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.12, // subtle upward celestial drift
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        targetAlpha: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // High-Resolution 120 FPS Time Delta Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = lastTime;

    const render = (now: number) => {
      // Calculate delta time capped at 33ms to prevent spiral on tab blur
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      // Update FPS Telemetry counter every 400ms
      frameCount++;
      if (now - lastFpsUpdate >= 400) {
        const measuredFps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        // Clamp to likely refresh rates (60, 90, 120, 144)
        setFps(measuredFps > 100 ? 120 : measuredFps > 75 ? 90 : 60);
        frameCount = 0;
        lastFpsUpdate = now;
      }

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mouseRef.current.active;

      // Draw subtle connecting constellation filaments between nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 6400) { // 80px distance threshold
            const filamentAlpha = (1 - distSq / 6400) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(212, 175, 55, ${filamentAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw each celestial stardust particle
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Cursor gravitation / repulsion physics
        if (hasMouse) {
          const cdx = p.x - mx;
          const cdy = p.y - my;
          const cDistSq = cdx * cdx + cdy * cdy;
          if (cDistSq < 16000 && cDistSq > 1) { // 126px radius
            const cDist = Math.sqrt(cDistSq);
            const force = (1 - cDist / 126) * 1.8;
            p.x += (cdx / cDist) * force;
            p.y += (cdy / cDist) * force;
          }
        }

        // Subpixel movement with delta-time integration
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);

        // Screen wrap-around with smooth boundary margins
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Twinkle pulse phase
        p.pulsePhase += p.twinkleSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.25;
        const clampedAlpha = Math.max(0.05, Math.min(0.85, currentAlpha));

        // Draw particle soft glow aura
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        glow.addColorStop(0, `${p.color} ${clampedAlpha})`);
        glow.addColorStop(0.5, `${p.color} ${clampedAlpha * 0.35})`);
        glow.addColorStop(1, `${p.color} 0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core bright spark
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, clampedAlpha * 1.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
    />
  );
}
