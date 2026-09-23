'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, User, Mail, Lock, Sparkles, LogOut, CheckCircle, Cloud, Smartphone } from 'lucide-react';

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

export function AuthModal({ isOpen, onClose, currentUser, onUserChange }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login' ? { email, password } : { email, password, name };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onUserChange(data.user);
      setSuccessMsg(tab === 'login' ? 'Successfully authenticated!' : 'Account created & synced!');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
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
      setSuccessMsg('Logged out successfully');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061411]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-[#0B211B] border border-[#D4AF37]/30 rounded-xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Subtle radial glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#009B77]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#AABDB7] hover:text-[#F5F4EC] hover:bg-[#102A23] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* User Profile & Active Cloud Session View */
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#102A23] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif text-2xl font-bold shadow-inner">
              {currentUser.name.slice(0, 1).toUpperCase()}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#009B77]/20 border border-[#009B77]/40 text-[#009B77] text-xs font-mono mb-2">
                <Cloud className="w-3 h-3" />
                Cloud Synchronized
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F5F4EC]">{currentUser.name}</h3>
              <p className="text-xs font-mono text-[#AABDB7]">{currentUser.email}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#061411] border border-[#D4AF37]/20 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#009B77]">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Multi-Device Persistence Active</span>
              </div>
              <p className="text-[#AABDB7] leading-relaxed">
                Your birth profiles, Kundali charts, and Tarot readings are synced to your cloud account. Log in from any phone or computer to access your observatory history.
              </p>
            </div>

            {successMsg && (
              <div className="p-2.5 rounded bg-[#009B77]/20 border border-[#009B77]/40 text-[#F5F4EC] text-xs font-mono flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#009B77]" />
                {successMsg}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg border border-[#D4AF37]/30 bg-[#102A23] text-[#F5F4EC] hover:bg-[#102A23]/80 hover:text-[#D4AF37] transition-colors font-mono text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Kaalika
            </button>
          </div>
        ) : (
          /* Authentication Forms */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                Cloud Sanctuary
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F5F4EC] mb-1">
              {tab === 'login' ? 'Sign In to Kaalika' : 'Create Cloud Account'}
            </h3>
            <p className="text-xs text-[#AABDB7] mb-5">
              Access your birth profiles and Kundali records across all your devices.
            </p>

            {/* Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-[#061411] rounded-lg border border-[#D4AF37]/20 mb-5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`py-1.5 text-xs font-mono rounded transition-colors ${
                  tab === 'login'
                    ? 'bg-[#102A23] text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-semibold'
                    : 'text-[#AABDB7] hover:text-[#F5F4EC]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`py-1.5 text-xs font-mono rounded transition-colors ${
                  tab === 'register'
                    ? 'bg-[#102A23] text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-semibold'
                    : 'text-[#AABDB7] hover:text-[#F5F4EC]'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-2.5 rounded bg-[#009B77]/20 border border-[#009B77]/40 text-[#F5F4EC] text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#009B77]" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-mono text-[#AABDB7] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#AABDB7]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aryabhata"
                      className="w-full pl-9 pr-3 py-2 bg-[#061411] border border-[#D4AF37]/25 rounded-lg text-xs text-[#F5F4EC] placeholder-[#AABDB7]/50 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#AABDB7] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#AABDB7]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="practitioner@observatory.org"
                    className="w-full pl-9 pr-3 py-2 bg-[#061411] border border-[#D4AF37]/25 rounded-lg text-xs text-[#F5F4EC] placeholder-[#AABDB7]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#AABDB7] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#AABDB7]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#061411] border border-[#D4AF37]/25 rounded-lg text-xs text-[#F5F4EC] placeholder-[#AABDB7]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F2D675] text-[#061411] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50 mt-2 shadow-lg"
              >
                {isLoading
                  ? 'Connecting to Cloud...'
                  : tab === 'login'
                  ? 'Enter Observatory'
                  : 'Create Cloud Account'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
