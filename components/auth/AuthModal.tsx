'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  X, Sparkles, LogOut, CheckCircle, Cloud,
  Smartphone, ArrowRight, Star, Github
} from 'lucide-react';
import { AnimatedBackground } from './AuthBackground';
import { EmailInput, PasswordInput, RememberMe } from './AuthInputs';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string; email: string; name: string; role?: string;
}
interface AuthModalProps {
  isOpen: boolean; onClose: () => void;
  currentUser: AuthUser | null; onUserChange: (u: AuthUser | null) => void;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }}
      className="flex justify-center mb-7"
    >
      <div className="relative">
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-[-6px] rounded-full"
          style={{ border: '1px solid rgba(212,175,55,0.18)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-[-12px] rounded-full"
          style={{ border: '1px dashed rgba(0,155,119,0.10)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />
        {/* Glass orb */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(0,155,119,0.22) 0%, rgba(0,107,91,0.14) 100%)',
            border: '1px solid rgba(212,175,55,0.30)',
            boxShadow: '0 0 30px rgba(0,155,119,0.22), 0 0 60px rgba(0,107,91,0.12), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          {/* Reflection sweep */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 50%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-cinzel text-xl font-bold relative z-10"
            style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}>
            क
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Header text ──────────────────────────────────────────────────────────────
function LoginHeader({ tab }: { tab: 'login' | 'register' | 'forgot' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="text-center mb-8"
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={tab + 'h'}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
          className="font-serif text-[30px] font-semibold tracking-tight mb-2"
          style={{ color: '#F5F4EC', textShadow: '0 0 40px rgba(0,155,119,0.15)' }}
        >
          {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Password'}
        </motion.h1>
      </AnimatePresence>
      <p className="text-[13.5px] font-sans" style={{ color: '#8BB5A8', letterSpacing: '0.01em' }}>
        {tab === 'login'
          ? 'Sign in to continue to your observatory'
          : tab === 'register'
          ? 'Begin your celestial journey'
          : 'Enter your email to receive recovery instructions'}
      </p>
    </motion.div>
  );
}

// ─── Tab switcher ─────────────────────────────────────────────────────────────
function TabSwitcher({
  tab, setTab,
}: { tab: 'login' | 'register' | 'forgot'; setTab: (t: 'login' | 'register' | 'forgot') => void }) {
  if (tab === 'forgot') {
    return (
      <div className="flex items-center justify-between mb-7 px-1">
        <button
          type="button" onClick={() => setTab('login')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8BB5A8] hover:text-[#2DDBA0] transition-colors cursor-pointer"
        >
          ← Back to Sign In
        </button>
        <span className="text-[10px] font-mono tracking-widest text-[#4A6E65]">RECOVERY</span>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 p-1 rounded-2xl mb-7 relative"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <AnimatePresence>
        <motion.div
          key={tab}
          className="absolute top-1 bottom-1 rounded-xl"
          layoutId="tab-pill"
          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
          style={{
            left: tab === 'login' ? '4px' : '50%',
            right: tab === 'login' ? '50%' : '4px',
            background: 'linear-gradient(135deg, rgba(0,155,119,0.22) 0%, rgba(0,107,91,0.16) 100%)',
            border: '1px solid rgba(0,155,119,0.30)',
            boxShadow: '0 2px 12px rgba(0,107,91,0.15)',
          }}
        />
      </AnimatePresence>
      {(['login', 'register'] as const).map(t => (
        <button
          key={t} type="button" onClick={() => setTab(t)}
          className="relative z-10 py-2 text-xs font-mono transition-colors duration-200 cursor-pointer"
          style={{ color: tab === t ? '#009B77' : '#6A9A8C' }}
        >
          {t === 'login' ? '⟢ Sign In' : '✦ Register'}
        </button>
      ))}
    </div>
  );
}

// ─── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-xs font-sans"
      style={{
        background: 'rgba(248,113,113,0.10)',
        border: '1px solid rgba(248,113,113,0.28)',
        color: '#FCA5A5',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
      {message}
    </motion.div>
  );
}

// ─── Success banner ───────────────────────────────────────────────────────────
function SuccessBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-xs font-sans"
      style={{
        background: 'rgba(0,155,119,0.12)',
        border: '1px solid rgba(0,155,119,0.30)',
        color: '#2DDBA0',
      }}
    >
      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.div>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function LoginButton({ isLoading, tab }: { isLoading: boolean; tab: 'login' | 'register' | 'forgot' }) {
  return (
    <motion.button
      type="submit" disabled={isLoading}
      whileHover={isLoading ? {} : { y: -2, boxShadow: '0 8px 30px rgba(0,155,119,0.35)' }}
      whileTap={isLoading ? {} : { scale: 0.975 }}
      className="w-full h-14 rounded-2xl text-sm font-sans font-semibold relative overflow-hidden cursor-pointer disabled:cursor-not-allowed transition-opacity"
      style={{
        background: 'linear-gradient(135deg, #006B5B 0%, #009B77 50%, #00856A 100%)',
        color: '#F5F4EC',
        border: '1px solid rgba(0,155,119,0.50)',
        boxShadow: '0 4px 20px rgba(0,107,91,0.30), inset 0 1px 0 rgba(255,255,255,0.10)',
        letterSpacing: '0.02em',
      }}
    >
      {/* Sweeping light reflection */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.10) 50%, transparent 80%)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            {tab === 'forgot' ? 'Sending link…' : 'Authenticating…'}
          </>
        ) : (
          <>
            {tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : 'Send Recovery Link'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </span>
    </motion.button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <span className="text-[10px] font-mono tracking-widest" style={{ color: '#4A6E65' }}>
        OR CONTINUE WITH
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
    </div>
  );
}

// ─── Social buttons ───────────────────────────────────────────────────────────
function SocialLogin() {
  const btnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(8px)',
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { icon: '𝗚', label: 'Google' },
        { icon: <Github className="w-4 h-4" />, label: 'GitHub' },
      ].map(({ icon, label }) => (
        <motion.button
          key={label} type="button"
          whileHover={{ y: -1.5, borderColor: 'rgba(0,155,119,0.35)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2.5 h-11 rounded-xl text-xs font-sans transition-colors cursor-pointer"
          style={{ ...btnStyle, color: '#AABDB7' }}
        >
          <span className="text-sm">{icon}</span>
          {label}
        </motion.button>
      ))}
    </div>
  );
}

// ─── Signup link ──────────────────────────────────────────────────────────────
function SignupLink({ tab, setTab }: { tab: 'login' | 'register' | 'forgot'; setTab: (t: 'login' | 'register' | 'forgot') => void }) {
  if (tab === 'forgot') {
    return (
      <p className="text-center text-xs font-sans mt-6" style={{ color: '#6A9A8C' }}>
        Remember your password?{' '}
        <button
          type="button" onClick={() => setTab('login')}
          className="relative group cursor-pointer"
          style={{ color: '#009B77' }}
        >
          <span>Sign in</span>
          <span
            className="absolute left-0 bottom-[-1px] h-px w-0 group-hover:w-full transition-all duration-300"
            style={{ background: '#009B77' }}
          />
        </button>
      </p>
    );
  }

  return (
    <p className="text-center text-xs font-sans mt-6" style={{ color: '#6A9A8C' }}>
      {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
      <button
        type="button" onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
        className="relative group cursor-pointer"
        style={{ color: '#009B77' }}
      >
        <span>{tab === 'login' ? 'Create account' : 'Sign in'}</span>
        <span
          className="absolute left-0 bottom-[-1px] h-px w-0 group-hover:w-full transition-all duration-300"
          style={{ background: '#009B77' }}
        />
      </button>
    </p>
  );
}

// ─── Logged-in profile card ───────────────────────────────────────────────────
function ProfileView({
  user, onLogout, successMsg,
}: { user: AuthUser; onLogout: () => void; successMsg: string | null }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-serif text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(0,155,119,0.22) 0%, rgba(0,107,91,0.15) 100%)',
              border: '1px solid rgba(0,155,119,0.40)',
              color: '#009B77',
              boxShadow: '0 0 30px rgba(0,107,91,0.18)',
            }}
          >
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: '#009B77', border: '2px solid #061411' }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#061411]" />
          </div>
        </div>
        <div className="text-center">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono mb-2"
            style={{ background: 'rgba(0,155,119,0.12)', border: '1px solid rgba(0,155,119,0.28)', color: '#009B77' }}
          >
            <Cloud className="w-3 h-3" /> Cloud Synchronized
          </div>
          <div className="font-serif text-lg font-bold text-[#F5F4EC]">{user.name}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: '#8BB5A8' }}>{user.email}</div>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 space-y-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#009B77' }}>
          <Smartphone className="w-3.5 h-3.5" />
          Multi-Device Persistence Active
        </div>
        <p className="text-[11px] font-sans leading-relaxed" style={{ color: '#8BB5A8' }}>
          Your birth profiles, Kundali charts, and Tarot readings are encrypted and synced across all your devices.
        </p>
      </div>

      <AnimatePresence>
        {successMsg && <SuccessBanner message={successMsg} />}
      </AnimatePresence>

      <motion.button
        onClick={onLogout} type="button"
        whileHover={{ borderColor: 'rgba(0,155,119,0.45)' }}
        className="w-full py-3 rounded-xl text-sm font-sans flex items-center justify-center gap-2 transition-all cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          color: '#8BB5A8',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5F4EC'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8BB5A8'; }}
      >
        <LogOut className="w-4 h-4" /> Sign Out of Observatory
      </motion.button>
    </motion.div>
  );
}

// ─── Main shake hook ──────────────────────────────────────────────────────────
function useShake() {
  const [shake, setShake] = useState(false);
  const trigger = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);
  return { shake, trigger };
}

// ─── AUTH MODAL (full-screen overlay) ────────────────────────────────────────
export function AuthModal({ isOpen, onClose, currentUser, onUserChange }: AuthModalProps) {
  // Form state
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccess] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{ email?: boolean; password?: boolean }>({});

  // Mouse / parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const { shake, trigger: triggerShake } = useShake();

  // Smooth cursor interpolation via rAF
  useEffect(() => {
    if (!isOpen) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let mx = mousePos.x, my = mousePos.y;
    const loop = () => {
      mx = lerp(mx, mousePos.x, 0.08);
      my = lerp(my, mousePos.y, 0.08);
      setSmoothMouse({ x: mx, y: my });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isOpen, mousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  if (!isOpen) return null;

  // Parallax transform (2deg max)
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 700;
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 500;
  const rotX = ((smoothMouse.y - cy) / cy) * -1.8;
  const rotY = ((smoothMouse.x - cx) / cx) * 1.8;
  const bgX = (smoothMouse.x - cx) * 0.008;
  const bgY = (smoothMouse.y - cy) * 0.008;

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setFieldError({});

    // Client validation
    if (!email || !email.includes('@')) {
      setFieldError({ email: true });
      setError('Please enter a valid email address.');
      triggerShake(); return;
    }

    if (tab === 'forgot') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccess('Password recovery link sent! Check your inbox ✦');
        setTimeout(() => setTab('login'), 2200);
      }, 700);
      return;
    }

    if (password.length < 6) {
      setFieldError({ password: true });
      setError('Password must be at least 6 characters.');
      triggerShake(); return;
    }

    setIsLoading(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login' ? { email, password } : { email, password, name };
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      onUserChange(data.user);
      setSuccess(tab === 'login' ? 'Welcome back to your observatory ✦' : 'Sanctuary created — syncing your stars…');
      setTimeout(() => { onClose(); setSuccess(null); }, 1400);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      setFieldError({ email: true, password: true });
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      onUserChange(null);
      setSuccess('Safely departed from the Observatory');
      setTimeout(() => { onClose(); setSuccess(null); }, 900);
    } catch (err) { console.error(err); }
  };

  // Staggered field animation variants
  const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.78 + i * 0.10, duration: 0.4, ease: 'easeOut' as const } }),
  };

  return (
    <AnimatePresence>
      <motion.div
        key="auth-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onMouseMove={handleMouseMove}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        {/* === BACKGROUND === */}
        <motion.div
          className="absolute inset-0"
          style={{ x: bgX, y: bgY }}
          transition={{ type: 'tween', duration: 0.1 }}
        >
          <AnimatedBackground mousePos={smoothMouse} />
        </motion.div>

        {/* === BACKDROP BLUR OVERLAY === */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ background: 'rgba(6,20,17,0.68)', backdropFilter: 'blur(10px)' }}
        />

        {/* === GLASS CARD === */}
        <motion.div
          key="auth-card"
          className="relative w-full z-10 overflow-hidden"
          style={{
            maxWidth: 460,
            borderRadius: 28,
            background: 'linear-gradient(145deg, rgba(11,33,27,0.88) 0%, rgba(16,42,35,0.82) 60%, rgba(8,24,20,0.90) 100%)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(32px) saturate(160%)',
            WebkitBackdropFilter: 'blur(32px) saturate(160%)',
            boxShadow: [
              '0 0 0 1px rgba(0,155,119,0.10)',
              '0 40px 80px rgba(0,0,0,0.65)',
              '0 8px 32px rgba(0,0,0,0.40)',
              '0 0 60px rgba(0,107,91,0.10)',
              'inset 0 1px 0 rgba(255,255,255,0.07)',
              'inset 0 -1px 0 rgba(0,0,0,0.20)',
            ].join(', '),
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, scale: 0.96, y: 30, filter: 'blur(8px)' }}
          animate={{
            opacity: 1, scale: 1, y: 0,
            filter: 'blur(0px)',
            rotateX: rotX, rotateY: rotY,
          }}
          exit={{ opacity: 0, scale: 0.96, y: 20, filter: 'blur(4px)' }}
          transition={{
            opacity: { delay: 0.30, duration: 0.55, ease: 'easeOut' },
            scale:   { delay: 0.30, duration: 0.55, ease: 'easeOut' },
            y:       { delay: 0.30, duration: 0.55, ease: 'easeOut' },
            filter:  { delay: 0.30, duration: 0.60, ease: 'easeOut' },
            rotateX: { type: 'spring', stiffness: 200, damping: 30 },
            rotateY: { type: 'spring', stiffness: 200, damping: 30 },
          }}
        >
          {/* === Glass reflection sweep === */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[28px] overflow-hidden"
            style={{ zIndex: 0 }}
          >
            <motion.div
              className="absolute h-full w-[35%] skew-x-[-15deg]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.035) 50%, transparent 100%)',
                top: 0,
              }}
              animate={{ left: ['-40%', '130%'] }}
              transition={{ duration: 18, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* === Ambient top glow === */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-36 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(0,155,119,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}
          />

          {/* === Close button === */}
          <motion.button
            onClick={onClose} type="button"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.10)' }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            aria-label="Close"
          >
            <X className="w-4 h-4" style={{ color: '#6A9A8C' }} />
          </motion.button>

          {/* === Card body === */}
          <motion.div
            className={`px-8 pt-8 pb-7 relative z-10 ${shake ? 'animate-shake' : ''}`}
            animate={shake ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={shake ? { duration: 0.45, ease: 'easeInOut' } : {}}
          >
            {currentUser ? (
              <ProfileView user={currentUser} onLogout={handleLogout} successMsg={successMsg} />
            ) : (
              <>
                {/* Logo */}
                <Logo />

                {/* Heading */}
                <LoginHeader tab={tab} />

                {/* Tab switcher */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <TabSwitcher tab={tab} setTab={t => { setTab(t); setError(null); setFieldError({}); }} />
                </motion.div>

                {/* Alerts */}
                <AnimatePresence mode="wait">
                  {error && <ErrorBanner key="err" message={error} />}
                  {successMsg && <SuccessBanner key="ok" message={successMsg} />}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    {/* Name field (register only) */}
                    <AnimatePresence>
                      {tab === 'register' && (
                        <motion.div
                          key="name-row"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="relative pb-1">
                            <motion.label
                              className="absolute text-[13.5px] pointer-events-none"
                              style={{ left: 48, top: 18, color: '#6A9A8C' }}
                            >
                              Full Name
                            </motion.label>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#4A6E65' }}>
                              <Star className="w-[17px] h-[17px]" />
                            </div>
                            <input
                              type="text" value={name}
                              onChange={e => setName(e.target.value)}
                              placeholder="e.g. Aryabhata"
                              aria-label="Full Name"
                              className="w-full h-14 pl-12 pr-4 text-sm text-[#F5F4EC] outline-none rounded-2xl"
                              style={{
                                background: 'rgba(255,255,255,0.032)',
                                border: '1px solid rgba(255,255,255,0.09)',
                                backdropFilter: 'blur(8px)',
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email */}
                    <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show">
                      <EmailInput value={email} onChange={setEmail} hasError={fieldError.email} />
                    </motion.div>

                    {/* Password */}
                    <AnimatePresence>
                      {tab !== 'forgot' && (
                        <motion.div
                          key="pw-block"
                          custom={1} variants={fieldVariants} initial="hidden" animate="show"
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <PasswordInput
                            value={password} onChange={setPassword}
                            hasError={fieldError.password} showStrength={tab === 'register'}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Remember + Forgot */}
                    <AnimatePresence>
                      {tab !== 'forgot' && (
                        <motion.div
                          key="rem-block"
                          custom={2} variants={fieldVariants} initial="hidden" animate="show"
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between"
                        >
                          <RememberMe checked={remember} onChange={setRemember} />
                          <button
                            type="button"
                            onClick={() => { setTab('forgot'); setError(null); setFieldError({}); }}
                            className="text-xs font-sans transition-colors cursor-pointer"
                            style={{ color: '#6A9A8C' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#009B77'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6A9A8C'; }}
                          >
                            Forgot password?
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA */}
                    <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                      <LoginButton isLoading={isLoading} tab={tab} />
                    </motion.div>
                  </div>

                  {/* Social */}
                  {tab !== 'forgot' && (
                    <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show">
                      <OrDivider />
                      <SocialLogin />
                    </motion.div>
                  )}

                  {/* Signup link */}
                  <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="show">
                    <SignupLink tab={tab} setTab={t => { setTab(t); setError(null); setFieldError({}); }} />
                  </motion.div>
                </form>
              </>
            )}
          </motion.div>

          {/* Bottom shimmer line */}
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,155,119,0.35), rgba(212,175,55,0.20), transparent)' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
