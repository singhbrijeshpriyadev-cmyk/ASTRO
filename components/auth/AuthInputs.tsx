'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// ─── Floating-label input ─────────────────────────────────────────────────────
interface InputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  autoComplete?: string;
  children?: React.ReactNode; // right slot (e.g. eye toggle)
  icon: React.ElementType;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function FloatingInput({
  id, type, label, value, onChange, hasError, autoComplete, children, icon: Icon,
  onKeyDown, onKeyUp,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const borderColor = hasError
    ? 'rgba(248,113,113,0.65)'
    : focused
    ? 'rgba(0,155,119,0.75)'
    : 'rgba(255,255,255,0.09)';

  const glowShadow = hasError
    ? '0 0 0 3px rgba(248,113,113,0.10)'
    : focused
    ? '0 0 0 3px rgba(0,155,119,0.12), 0 0 16px rgba(0,155,119,0.08)'
    : 'none';

  return (
    <motion.div
      className="relative"
      animate={{ y: focused ? -1 : 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        className="absolute pointer-events-none font-sans select-none"
        animate={{
          y: lifted ? 7 : 18,
          scale: lifted ? 0.75 : 1,
          color: lifted
            ? hasError ? '#FCA5A5' : focused ? '#2DDBA0' : '#8BB5A8'
            : '#6A9A8C',
        }}
        transition={{ duration: 0.20, ease: [0.4, 0, 0.2, 1] }}
        style={{ left: 48, transformOrigin: 'left center', fontSize: 14, lineHeight: 1 }}
      >
        {label}
      </motion.label>

      {/* Icon */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
        style={{ color: focused ? '#009B77' : '#4A6E65' }}
      >
        <Icon className="w-[18px] h-[18px]" />
      </div>

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        aria-label={label}
        aria-invalid={hasError}
        className="w-full h-14 pl-12 pr-12 pt-4 pb-1 text-sm text-[#F5F4EC] outline-none rounded-2xl transition-all duration-200 bg-transparent placeholder-transparent"
        style={{
          background: focused
            ? 'rgba(255,255,255,0.055)'
            : 'rgba(255,255,255,0.032)',
          border: `1px solid ${borderColor}`,
          boxShadow: glowShadow,
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Right slot */}
      {children && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {children}
        </div>
      )}
    </motion.div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return s as 0 | 1 | 2 | 3;
}

const STRENGTH_LABEL = ['', 'Weak', 'Medium', 'Strong'] as const;
const STRENGTH_COLOR = ['', '#EF4444', '#F59E0B', '#10B981'] as const;

export function PasswordStrength({ password }: { password: string }) {
  const s = getStrength(password);
  if (!password) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-1"
    >
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="h-[3px] flex-1 rounded-full"
            animate={{ backgroundColor: i <= s ? STRENGTH_COLOR[s] : 'rgba(255,255,255,0.08)' }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <motion.span
        key={s}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-[10px] font-mono w-12 text-right"
        style={{ color: STRENGTH_COLOR[s] }}
      >
        {STRENGTH_LABEL[s]}
      </motion.span>
    </motion.div>
  );
}

// ─── Email input block ────────────────────────────────────────────────────────
export function EmailInput({
  value, onChange, hasError,
}: { value: string; onChange: (v: string) => void; hasError?: boolean }) {
  return (
    <FloatingInput
      id="kaalika-email" type="email" label="Email address"
      value={value} onChange={onChange} hasError={hasError}
      autoComplete="email" icon={Mail}
    />
  );
}

// ─── Password input block ─────────────────────────────────────────────────────
export function PasswordInput({
  value, onChange, hasError, showStrength,
}: { value: string; onChange: (v: string) => void; hasError?: boolean; showStrength?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLock(e.getModifierState('CapsLock'));
    }
  };

  return (
    <div className="space-y-1.5">
      <FloatingInput
        id="kaalika-password" type={visible ? 'text' : 'password'}
        label="Password" value={value} onChange={onChange}
        hasError={hasError} autoComplete="current-password" icon={Lock}
        onKeyDown={checkCapsLock}
        onKeyUp={checkCapsLock}
      >
        <button
          type="button" onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="text-[#4A6E65] hover:text-[#009B77] transition-colors cursor-pointer p-0.5"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </FloatingInput>

      <AnimatePresence>
        {capsLock && (
          <motion.div
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="flex items-center gap-1.5 px-2 text-[11px] font-mono text-amber-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Caps Lock is ON
          </motion.div>
        )}
      </AnimatePresence>

      {showStrength && <PasswordStrength password={value} />}
    </div>
  );
}

// ─── Remember Me checkbox ─────────────────────────────────────────────────────
export function RememberMe({
  checked, onChange,
}: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 cursor-pointer group"
      aria-pressed={checked}
    >
      <motion.div
        className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0"
        animate={{
          background: checked ? 'rgba(0,155,119,0.25)' : 'rgba(255,255,255,0.04)',
          borderColor: checked ? 'rgba(0,155,119,0.70)' : 'rgba(255,255,255,0.14)',
          boxShadow: checked ? '0 0 8px rgba(0,155,119,0.20)' : 'none',
        }}
        style={{ border: '1px solid', borderColor: 'rgba(255,255,255,0.14)' }}
        transition={{ duration: 0.22 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check" viewBox="0 0 10 8" fill="none"
              className="w-2.5 h-2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <motion.path
                d="M1 4L3.5 6.5L9 1" stroke="#009B77" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.22 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="text-xs font-sans text-[#8BB5A8] group-hover:text-[#AABDB7] transition-colors select-none">
        Remember me
      </span>
    </button>
  );
}
