'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductionTarotReading } from '@/lib/tarot/types';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface ShareReadingModalProps {
  reading: ProductionTarotReading;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareReadingModal({ reading, isOpen, onClose }: ShareReadingModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = async () => {
    const summary = [
      `✦ KAALIKA TAROT OBSERVATORY READING ✦`,
      `Inquiry: "${reading.question}"`,
      `Topic: ${reading.topicLabel}`,
      `Date: ${new Date(reading.timestamp).toLocaleDateString()}`,
      ``,
      `1. PAST / FOUNDATION: ${reading.cards[0].name} (${reading.cards[0].orientation})`,
      `2. PRESENT / ENERGY: ${reading.cards[1].name} (${reading.cards[1].orientation})`,
      `3. FUTURE / HORIZON: ${reading.cards[2].name} (${reading.cards[2].orientation})`,
      ``,
      `Key Themes: ${reading.themes.join(' • ')}`,
      ``,
      `Reflection: "${reading.reflection}"`,
      ``,
      `Cast with Kaalika Vedic Observatory`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl liquid-glass-panel border border-[rgba(212,175,55,0.40)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(212,175,55,0.15)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Share Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#D4AF37] tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F2D675]" />
            <span>SHARE CELESTIAL READING</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#F5F4EC]">
            Observatory Tarot Card
          </h3>
          <p className="text-xs text-[#AABDB7] font-sans">
            Share an elegant reflection card of your reading without exposing personal credentials.
          </p>
        </div>

        {/* Visual Share Card Preview */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B211B] via-[#102A23] to-[#061411] border border-[rgba(212,175,55,0.35)] shadow-inner space-y-5">
          {/* Card Brand Header */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg border border-[rgba(212,175,55,0.4)] bg-[#0B211B] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs">
                काल
              </div>
              <span className="font-serif text-sm font-bold text-[#F5F4EC] tracking-wider">
                KAALIKA OBSERVATORY
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[rgba(212,175,55,0.12)] text-[#F2D675] border border-[rgba(212,175,55,0.30)]">
              {reading.topicLabel}
            </span>
          </div>

          {/* Question */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#AABDB7] tracking-widest">
              Contemplative Inquiry:
            </span>
            <div className="text-sm font-serif font-semibold text-[#F5F4EC] italic">
              &ldquo;{reading.question}&rdquo;
            </div>
          </div>

          {/* 3 Cards Mini Row */}
          <div className="grid grid-cols-3 gap-3 py-1">
            {reading.cards.map((c, i) => (
              <div key={i} className="text-center space-y-1.5">
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[rgba(212,175,55,0.3)] bg-black/60">
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    className={`object-cover ${c.orientation === 'reversed' ? 'rotate-180' : ''}`}
                    sizes="120px"
                  />
                </div>
                <div className="text-[10px] font-mono text-[#D4AF37] uppercase truncate">
                  {c.positionName.split('/')[0].trim()}
                </div>
                <div className="text-[11px] font-serif font-bold text-[#F5F4EC] truncate">
                  {c.name}
                </div>
                <div className="text-[9px] font-mono text-[#AABDB7] uppercase">
                  {c.orientation}
                </div>
              </div>
            ))}
          </div>

          {/* Themes & Reflection */}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-2">
            <div className="flex flex-wrap gap-1">
              {reading.themes.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[9px] font-sans px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[#AABDB7]"
                >
                  ✦ {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#AABDB7] font-serif italic line-clamp-2">
              &ldquo;{reading.reflection}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#006B5B] to-[#009B77] hover:from-[#007D69] hover:to-[#00B388] text-[#F5F4EC] text-xs font-sans font-semibold border border-[#009B77] shadow-[0_0_15px_rgba(0,155,119,0.3)] flex items-center justify-center gap-1.5 transition-all"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-[#F2D675]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Summary Copied!' : 'Copy Text Summary'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(212,175,55,0.15)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(212,175,55,0.40)] text-[#AABDB7] hover:text-[#F2D675] text-xs font-mono transition-all flex items-center justify-center gap-1.5"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#009B77]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
