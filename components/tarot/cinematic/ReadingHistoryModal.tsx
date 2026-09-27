'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, Trash2, Calendar, BookOpen, Compass } from 'lucide-react';

interface SavedReadingItem {
  id: string;
  timestamp: string;
  question: string;
  spreadId: string;
  spreadName: string;
  cards: {
    id: string;
    name: string;
    orientation: string;
    slotTitle: string;
    keywords?: string[];
  }[];
  dominantElement?: string;
}

interface ReadingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReadingHistoryModal({ isOpen, onClose }: ReadingHistoryModalProps) {
  const [readings, setReadings] = useState<SavedReadingItem[]>([]);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('kaalika_saved_readings');
        if (raw) {
          setReadings(JSON.parse(raw));
        }
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    const updated = readings.filter(r => r.id !== id);
    setReadings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaalika_saved_readings', JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all saved readings from your sanctuary?')) {
      setReadings([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kaalika_saved_readings');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#061411]/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[rgba(212,175,55,0.3)] bg-gradient-to-br from-[#0B211B]/95 via-[#102A23]/95 to-[#061411]/98 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 sm:p-8 z-10 no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="font-serif text-xl font-bold text-[#F5F4EC]">
                  Sanctuary Reading Chronicle
                </h3>
                <p className="text-[11px] font-mono text-[#8BB5A8]">
                  {readings.length} {readings.length === 1 ? 'recorded consultation' : 'recorded consultations'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {readings.length > 0 && (
                <button
                  onClick={handleClearAll}
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-950/40 text-[10px] font-mono transition-all"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.15)] text-[#AABDB7] hover:text-[#F5F4EC] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          {readings.length === 0 ? (
            <div className="py-12 text-center text-[#8BB5A8] space-y-2">
              <Compass className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
              <p className="text-sm font-sans">No saved consultations in your sanctuary yet.</p>
              <p className="text-xs font-mono text-[#6A9A8C]">
                Draw cards at the virtual table and click &ldquo;Save Reading&rdquo; to record them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {readings.map((r) => {
                const dateStr = new Date(r.timestamp).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(212,175,55,0.3)] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37]">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="uppercase">{r.spreadName}</span>
                        </div>
                        {r.question && (
                          <h4 className="font-serif text-sm font-semibold text-[#F5F4EC] mt-1">
                            &ldquo;{r.question}&rdquo;
                          </h4>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(r.id)}
                        type="button"
                        className="text-[#6A9A8C] hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete reading"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                      {r.cards.map((c, i) => (
                        <div key={i} className="p-2 rounded-xl bg-[rgba(0,0,0,0.25)] text-center">
                          <span className="text-[9px] font-mono text-[#8BB5A8] uppercase block">
                            {c.slotTitle}
                          </span>
                          <span className="text-xs font-serif font-bold text-[#F5F4EC] block truncate mt-0.5">
                            {c.name}
                          </span>
                          <span
                            className={`inline-block text-[8px] font-mono uppercase px-1 rounded mt-1 ${
                              c.orientation === 'reversed' ? 'text-amber-300 bg-amber-950/60' : 'text-emerald-300 bg-emerald-950/60'
                            }`}
                          >
                            {c.orientation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
