'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Mail, Lock, User, Sparkles, LogOut,
  CheckCircle, Cloud, Smartphone, Eye, EyeOff,
  ArrowRight, Shield, Star
} from 'lucide-react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUserChange: (user: AuthUser | null) => void;
}

// ─── Floating star particle ───────────────────────────────────────────────────
function StarParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size,
        background: `radial-gradient(circle, rgba(45,219,160,0.9) 0%, rgba(126,184,255,0.5) 60%, transparent 100%)` }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5], y: [0, -20, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

const PARTICLES = [
  { delay: 0,   x: 10, y: 20, size: 3 }, { delay: 1.2, x: 80, y: 15, size: 2 },
  { delay: 2.4, x: 55, y: 70, size: 4 }, { delay: 0.8, x: 25, y: 85, size: 2 },
  { delay: 3.1, x: 90, y: 60, size: 3 }, { delay: 1.7, x: 40, y: 10, size: 2 },
  { delay: 0.4, x: 70, y: 40, size: 3 }, { delay: 2.9, x: 15, y: 55, size: 2 },
  { delay: 1.5, x: 60, y: 90, size: 4 }, { delay: 3.6, x: 85, y: 30, size: 2 },
];

// ─── Input field ─────────────────────────────────────────────────────────────
function AuthInput({
  type, value, onChange, placeholder, icon: Icon, label, rightSlot
}: {
  type: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon: React.ElementType; label: string;
  rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-mono uppercase tracking-[0.15em]"
        style={{ color: focused ? '#2DDBA0' : '#8BB5A8' }}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ color: focused ? '#2DDBA0' : '#6A9A8C' }}>
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type} value={value} required
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-[#EFF6F2] placeholder-[#6A9A8C]/60 outline-none transition-all duration-300"
          style={{
            background: 'rgba(12, 34, 24, 0.80)',
            border: focused
              ? '1px solid rgba(45,219,160,0.7)'
              : '1px solid rgba(0,200,140,0.22)',
            boxShadow: focused
              ? '0 0 0 3px rgba(0,168,120,0.12), inset 0 1px 0 rgba(255,255,255,0.04)'
              : 'inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        />
        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AuthModal({ isOpen, onClose, currentUser, onUserChange }: AuthModalProps) {
  const [tab, setTab]           = useState<'login' | 'register'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [successMsg, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setIsLoading(true);
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
      setSuccess(tab === 'login' ? 'Welcome back to the Observatory!' : 'Sanctuary created — syncing stars…');
      setTimeout(() => { onClose(); setSuccess(null); }, 1200);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop ───────────────────────────────────────────────────── */
        <motion.div
          key="auth-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(3,16,10,0.85)', backdropFilter: 'blur(18px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          {/* ── Modal Card ─────────────────────────────────────────────── */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden"
            style={{
              borderRadius: 28,
              background: 'linear-gradient(145deg, #071A10 0%, #0C2218 60%, #071520 100%)',
              border: '1px solid rgba(0,200,140,0.28)',
              boxShadow: '0 0 0 1px rgba(0,168,120,0.12), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,168,120,0.12)',
            }}
          >
            {/* ── Ambient orbs ─────────────────────────────────────────── */}
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,168,120,0.18) 0%, transparent 70%)', filter: 'blur(1px)' }} />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(15,82,186,0.16) 0%, transparent 70%)', filter: 'blur(1px)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(61,64,91,0.08) 0%, transparent 70%)' }} />

            {/* ── Star particles ───────────────────────────────────────── */}
            {PARTICLES.map((p, i) => <StarParticle key={i} {...p} />)}

            {/* ── Top header band ──────────────────────────────────────── */}
            <div className="relative px-8 pt-8 pb-6"
              style={{ borderBottom: '1px solid rgba(0,200,140,0.12)' }}>
              {/* Logo mark */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,168,120,0.3) 0%, rgba(15,82,186,0.2) 100%)',
                    border: '1px solid rgba(45,219,160,0.4)',
                    boxShadow: '0 0 20px rgba(0,168,120,0.25)',
                  }}>
                  <Star className="w-5 h-5 text-[#2DDBA0]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#2DDBA0]/80">
                    ✦ Cloud Sanctuary
                  </div>
                  <div className="font-serif text-xl font-bold text-[#EFF6F2] leading-tight">
                    {currentUser
                      ? currentUser.name
                      : tab === 'login'
                      ? 'Sign In to Kaalika'
                      : 'Create Your Sanctuary'}
                  </div>
                </div>
              </div>
              {!currentUser && (
                <p className="text-xs text-[#8BB5A8] leading-relaxed">
                  Access your birth profiles, Kundali charts and Tarot readings across every device.
                </p>
              )}
            </div>

            {/* ── Close button ─────────────────────────────────────────── */}
            <button onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              style={{ background: 'rgba(0,200,140,0.08)', border: '1px solid rgba(0,200,140,0.18)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,200,140,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,200,140,0.08)'; }}
            >
              <X className="w-4 h-4 text-[#8BB5A8]" />
            </button>

            {/* ── Body ─────────────────────────────────────────────────── */}
            <div className="px-8 py-6">
              {currentUser ? (
                /* ── Logged-in state ─────────────────────────────────── */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-serif text-3xl font-bold"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,168,120,0.25) 0%, rgba(15,82,186,0.2) 100%)',
                          border: '1px solid rgba(45,219,160,0.4)',
                          color: '#2DDBA0',
                          boxShadow: '0 0 30px rgba(0,168,120,0.20)',
                        }}>
                        {currentUser.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: '#00A878', border: '2px solid #071A10' }}>
                        <CheckCircle className="w-3.5 h-3.5 text-[#03100A]" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono mb-1.5"
                        style={{ background: 'rgba(0,168,120,0.15)', border: '1px solid rgba(0,200,140,0.35)', color: '#2DDBA0' }}>
                        <Cloud className="w-3 h-3" /> Cloud Synchronized
                      </div>
                      <div className="font-serif text-lg font-bold text-[#EFF6F2]">{currentUser.name}</div>
                      <div className="text-xs font-mono text-[#8BB5A8]">{currentUser.email}</div>
                    </div>
                  </div>

                  {/* Info card */}
                  <div className="rounded-xl p-4 space-y-2"
                    style={{ background: 'rgba(12,34,24,0.70)', border: '1px solid rgba(0,200,140,0.16)' }}>
                    <div className="flex items-center gap-2 text-xs text-[#2DDBA0] font-mono">
                      <Smartphone className="w-3.5 h-3.5" />
                      Multi-Device Persistence Active
                    </div>
                    <p className="text-[11px] text-[#8BB5A8] leading-relaxed">
                      Your birth profiles, Kundali charts, and Tarot readings are synced to your cloud account. Log in from any device to access your full observatory history.
                    </p>
                  </div>

                  {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl text-xs font-mono flex items-center gap-2"
                      style={{ background: 'rgba(0,168,120,0.15)', border: '1px solid rgba(0,200,140,0.35)', color: '#2DDBA0' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {successMsg}
                    </motion.div>
                  )}

                  <button onClick={handleLogout}
                    className="w-full py-3 rounded-xl text-sm font-mono flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                    style={{ background: 'rgba(12,34,24,0.70)', border: '1px solid rgba(0,200,140,0.22)', color: '#8BB5A8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EFF6F2'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,200,140,0.45)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8BB5A8'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,200,140,0.22)'; }}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out of Observatory
                  </button>
                </motion.div>
              ) : (
                /* ── Auth forms ──────────────────────────────────────── */
                <div className="space-y-5">
                  {/* Tab switcher */}
                  <div className="grid grid-cols-2 p-1 rounded-xl gap-1"
                    style={{ background: 'rgba(3,16,10,0.80)', border: '1px solid rgba(0,200,140,0.14)' }}>
                    {(['login', 'register'] as const).map(t => (
                      <button key={t} type="button"
                        onClick={() => { setTab(t); setError(null); }}
                        className="py-2 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer"
                        style={tab === t ? {
                          background: 'linear-gradient(135deg, rgba(0,168,120,0.25) 0%, rgba(15,82,186,0.15) 100%)',
                          border: '1px solid rgba(45,219,160,0.38)',
                          color: '#2DDBA0',
                          fontWeight: 600,
                          boxShadow: '0 2px 12px rgba(0,168,120,0.15)',
                        } : { color: '#6A9A8C', background: 'transparent', border: '1px solid transparent' }}>
                        {t === 'login' ? '⟢ Sign In' : '✦ Register'}
                      </button>
                    ))}
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {error && (
                      <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-3 rounded-xl text-xs font-mono flex items-center gap-2"
                        style={{ background: 'rgba(180,30,30,0.15)', border: '1px solid rgba(248,113,113,0.35)', color: '#FCA5A5' }}>
                        <Shield className="w-4 h-4 flex-shrink-0 text-red-400" />
                        {error}
                      </motion.div>
                    )}
                    {successMsg && (
                      <motion.div key="ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-3 rounded-xl text-xs font-mono flex items-center gap-2"
                        style={{ background: 'rgba(0,168,120,0.15)', border: '1px solid rgba(0,200,140,0.35)', color: '#2DDBA0' }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        {successMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                      {tab === 'register' && (
                        <motion.div key="name-field"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
                          <AuthInput type="text" value={name} onChange={setName}
                            placeholder="e.g. Aryabhata" icon={User} label="Full Name" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AuthInput type="email" value={email} onChange={setEmail}
                      placeholder="practitioner@observatory.org" icon={Mail} label="Email Address" />

                    <AuthInput type={showPw ? 'text' : 'password'} value={password} onChange={setPassword}
                      placeholder="••••••••" icon={Lock} label="Password"
                      rightSlot={
                        <button type="button" onClick={() => setShowPw(v => !v)}
                          className="text-[#6A9A8C] hover:text-[#2DDBA0] transition-colors cursor-pointer">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      } />

                    {/* Submit button */}
                    <motion.button
                      type="submit" disabled={isLoading}
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                      className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-1"
                      style={{
                        background: isLoading
                          ? 'linear-gradient(135deg, #006B4A 0%, #082060 100%)'
                          : 'linear-gradient(135deg, #00A878 0%, #0F52BA 100%)',
                        color: '#EFF6F2',
                        boxShadow: '0 4px 24px rgba(0,168,120,0.35), 0 1px 0 rgba(255,255,255,0.08) inset',
                        border: '1px solid rgba(45,219,160,0.35)',
                      }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                          Connecting to Observatory…
                        </>
                      ) : (
                        <>
                          {tab === 'login' ? 'Enter Observatory' : 'Create Sanctuary'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Features strip */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { icon: Shield, label: 'Secure', sub: 'Encrypted' },
                      { icon: Cloud, label: 'Synced', sub: 'All Devices' },
                      { icon: Star, label: 'Sacred', sub: 'Private Data' },
                    ].map(({ icon: Icon, label, sub }) => (
                      <div key={label} className="flex flex-col items-center gap-1 py-2 rounded-xl text-center"
                        style={{ background: 'rgba(12,34,24,0.50)', border: '1px solid rgba(0,200,140,0.10)' }}>
                        <Icon className="w-3.5 h-3.5 text-[#2DDBA0]" />
                        <div className="text-[10px] font-mono text-[#EFF6F2] leading-none">{label}</div>
                        <div className="text-[9px] font-mono text-[#6A9A8C]">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Bottom shimmer line ───────────────────────────────────── */}
            <div className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,168,120,0.4), rgba(15,82,186,0.4), transparent)' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
