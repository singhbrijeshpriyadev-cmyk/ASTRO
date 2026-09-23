'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SavedTarotReading, ProductionTarotReading } from '@/lib/tarot/types';
import { getSavedReadings, deleteSavedReading, clearAllSavedReadings } from '@/lib/tarot/history';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  History, 
  Calendar, 
  Bookmark, 
  Compass, 
  Sparkles 
} from 'lucide-react';

interface ReadingHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReading: (reading: ProductionTarotReading) => void;
}

export function ReadingHistoryDrawer({
  isOpen,
  onClose,
  onSelectReading,
}: ReadingHistoryDrawerProps) {
  const [history, setHistory] = useState<SavedTarotReading[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getSavedReadings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteSavedReading(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your saved reading sanctuary?')) {
      clearAllSavedReadings();
      setHistory([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-[#061411] border-l border-[rgba(212,175,55,0.30)] p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(139,107,190,0.15)] border border-[rgba(139,107,190,0.35)] flex items-center justify-center text-[#A78BFA]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#F5F4EC]">
                Reading Sanctuary
              </h3>
              <p className="text-[11px] text-[#AABDB7] font-mono">
                {history.length} Saved {history.length === 1 ? 'Reading' : 'Readings'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-mono text-[#AABDB7] hover:text-red-400 p-1.5 transition-colors"
                title="Clear All"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Reading Cards List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[#D4AF37]">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#F5F4EC]">
                Your Sanctuary is Still
              </h4>
              <p className="text-xs text-[#AABDB7] max-w-xs font-sans leading-relaxed">
                When you cast a reading, tap &ldquo;Save Reading&rdquo; to archive your cards and reflections here.
              </p>
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.readingId}
                onClick={() => {
                  onSelectReading(item.reading);
                  onClose();
                }}
                className="liquid-glass-card p-4 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.40)] bg-[rgba(11,33,27,0.5)] transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[rgba(212,175,55,0.12)] text-[#D4AF37] border border-[rgba(212,175,55,0.25)]">
                    {item.topicLabel}
                  </span>
                  <div className="flex items-center gap-2 text-[#AABDB7]">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={e => handleDelete(item.readingId, e)}
                      className="p-1 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="font-serif text-sm font-semibold text-[#F5F4EC] line-clamp-2">
                  &ldquo;{item.question}&rdquo;
                </div>

                {/* 3 Cards Mini Thumbnails */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[rgba(255,255,255,0.05)]">
                  {item.cardSummaries.map((c, i) => (
                    <div key={i} className="text-center space-y-1">
                      <div className="relative w-full h-14 rounded overflow-hidden border border-[rgba(255,255,255,0.08)] bg-black/60">
                        <Image
                          src={c.imageUrl}
                          alt={c.name}
                          fill
                          className={`object-cover ${c.orientation === 'reversed' ? 'rotate-180' : ''}`}
                          sizes="80px"
                        />
                      </div>
                      <div className="text-[10px] text-[#AABDB7] font-sans truncate">
                        {c.name}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#D4AF37] group-hover:text-[#F2D675]">
                  <span>Open Full Reading</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
