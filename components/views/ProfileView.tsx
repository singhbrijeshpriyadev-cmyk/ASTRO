import React, { useState, useEffect } from 'react';
import { KundaliData, RawBirthInput } from '@/types/astrology';
import { User, MapPin, Calendar, Clock, Cloud, Smartphone, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthUser } from '@/components/auth/AuthModal';

interface ProfileViewProps {
  kundali: KundaliData;
  onOpenDetails: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onSelectProfile?: (input: RawBirthInput) => void;
}

interface SavedProfile {
  id: string;
  name: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  birth_minute: number;
  birth_second: number;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  location_name: string;
  ayanamsha_system: string;
  created_at: string;
}

export function ProfileView({
  kundali,
  onOpenDetails,
  currentUser,
  onOpenAuthModal,
  onSelectProfile,
}: ProfileViewProps) {
  const { rawInput, normalizedData, calculationSettings } = kundali;
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchProfiles = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        const data = await res.json();
        setSavedProfiles(data.profiles || []);
      }
    } catch (err) {
      console.error('Failed to load profiles:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSaveCurrentProfile = async () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const [y, m, d] = rawInput.birthLocalDate.split('-').map(Number);
      const [h, min, s] = rawInput.birthLocalTime.split(':').map(Number);

      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rawInput.name,
          birthYear: y,
          birthMonth: m,
          birthDay: d,
          birthHour: h,
          birthMinute: min,
          birthSecond: s || 0,
          latitude: rawInput.latitude,
          longitude: rawInput.longitude,
          timezoneOffset: normalizedData.utcOffset,
          locationName: rawInput.birthPlace,
          ayanamshaSystem: calculationSettings.ayanamsha,
        }),
      });

      if (!res.ok) throw new Error('Failed to save profile to cloud');

      setStatusMessage({ text: 'Profile synced to cloud database!', type: 'success' });
      fetchProfiles();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error saving profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      const res = await fetch(`/api/profiles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedProfiles((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <div className="border border-[#D4AF37]/30 rounded-xl p-5 bg-[#0B211B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border border-[#D4AF37]/40 bg-[#102A23] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xl shadow-inner">
            {rawInput.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-[#F5F4EC] tracking-wide">
                {rawInput.name}
              </h2>
              {currentUser && (
                <span className="px-2 py-0.5 rounded-full bg-[#009B77]/20 border border-[#009B77]/40 text-[#009B77] text-[10px] font-mono flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> Synced
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[#AABDB7]">
              Ephemeris Inscription • {rawInput.birthPlace}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveCurrentProfile}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-[#006B5B] hover:bg-[#009B77] border border-[#009B77]/50 text-xs font-mono text-[#F5F4EC] transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Cloud className="w-3.5 h-3.5" />
            {isSaving ? 'Syncing...' : 'Save to Cloud DB'}
          </button>
          <button
            onClick={onOpenDetails}
            className="px-3.5 py-1.5 rounded-lg bg-[#102A23] border border-[#D4AF37]/30 text-xs font-mono text-[#F2D675] hover:bg-[#D4AF37]/15 transition-colors"
          >
            Calculation Details
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#009B77]/20 border-[#009B77]/40 text-[#F5F4EC]'
              : 'bg-red-950/40 border-red-500/40 text-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-[#009B77]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Cloud Synchronized Profiles Section */}
      <div className="p-4 rounded-xl bg-[#0B211B] border border-[#D4AF37]/25 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif text-sm font-bold text-[#F5F4EC]">
              Cloud Profiles (Multi-Device Sync)
            </h3>
          </div>
          {currentUser ? (
            <span className="text-[11px] font-mono text-[#AABDB7]">
              Logged in as <strong className="text-[#F2D675]">{currentUser.name}</strong>
            </span>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="text-[11px] font-mono text-[#D4AF37] hover:underline"
            >
              Sign In to enable cross-device sync →
            </button>
          )}
        </div>

        {currentUser ? (
          savedProfiles.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#AABDB7]">
              No saved profiles in your cloud vault yet. Click &quot;Save to Cloud DB&quot; above to preserve this horoscope.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {savedProfiles.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-[#061411] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-xs text-[#F5F4EC] truncate">
                        {p.name}
                      </span>
                      <button
                        onClick={() => handleDeleteProfile(p.id)}
                        className="p-1 text-[#AABDB7] hover:text-red-400 transition-colors"
                        title="Delete profile"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-[#AABDB7]">
                      {p.birth_year}-{String(p.birth_month).padStart(2, '0')}-{String(p.birth_day).padStart(2, '0')}{' '}
                      {String(p.birth_hour).padStart(2, '0')}:{String(p.birth_minute).padStart(2, '0')}
                    </p>
                    <p className="text-[10px] text-[#AABDB7]/80 truncate mt-0.5">{p.location_name}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectProfile) {
                        onSelectProfile({
                          name: p.name,
                          birthLocalDate: `${p.birth_year}-${String(p.birth_month).padStart(2, '0')}-${String(
                            p.birth_day
                          ).padStart(2, '0')}`,
                          birthLocalTime: `${String(p.birth_hour).padStart(2, '0')}:${String(
                            p.birth_minute
                          ).padStart(2, '0')}:${String(p.birth_second || 0).padStart(2, '0')}`,
                          birthPlace: p.location_name,
                          latitude: p.latitude,
                          longitude: p.longitude,
                          timezone: 'Asia/Kolkata',
                        });
                      }
                    }}
                    className="mt-3 w-full py-1 rounded bg-[#102A23] hover:bg-[#006B5B] border border-[#D4AF37]/20 text-[10px] font-mono text-[#F2D675] hover:text-[#F5F4EC] transition-colors"
                  >
                    Load into Observatory
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="p-4 rounded-lg bg-[#061411] border border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-[#AABDB7]">
              Want to calculate on your MacBook and view the same chart on your phone? Sign in to your free cloud account.
            </div>
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F2D675] text-[#061411] font-bold text-xs shrink-0 shadow-md"
            >
              Sign In / Register
            </button>
          </div>
        )}
      </div>

      {/* Raw Input vs Normalized Astronomical Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Raw User Input */}
        <div className="p-4 rounded-xl bg-[#0B211B] border border-[#D4AF37]/25 space-y-3">
          <div className="font-mono text-xs uppercase text-[#D4AF37] tracking-wider pb-2 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <span>Stored Raw User Input</span>
            <span className="text-[10px] text-[#AABDB7]">Pre-normalization</span>
          </div>
          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
              <span className="text-[#AABDB7] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#AABDB7]" /> Inscription Name
              </span>
              <span className="font-semibold text-[#F5F4EC]">{rawInput.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
              <span className="text-[#AABDB7] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#AABDB7]" /> Birth Local Date
              </span>
              <span className="font-mono text-[#F5F4EC]">{rawInput.birthLocalDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
              <span className="text-[#AABDB7] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#AABDB7]" /> Birth Local Time
              </span>
              <span className="font-mono text-[#F5F4EC]">{rawInput.birthLocalTime}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#AABDB7] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#AABDB7]" /> Declared Birth Place
              </span>
              <span className="text-[#F5F4EC] text-right">{rawInput.birthPlace}</span>
            </div>
          </div>
        </div>

        {/* Right: Normalized Astronomical Data */}
        <div className="p-4 rounded-xl bg-[#0B211B] border border-[#D4AF37]/25 space-y-3">
          <div className="font-mono text-xs uppercase text-[#D4AF37] tracking-wider pb-2 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <span>Normalized Astronomical Epoch</span>
            <span className="text-[10px] text-[#AABDB7]">Deterministic</span>
          </div>
          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
              <span className="text-[#AABDB7]">Universal Time (UTC)</span>
              <span className="font-mono text-[#F2D675]">{normalizedData.birthUTC}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
              <span className="text-[#AABDB7]">Julian Ephemeris Day</span>
              <span className="font-mono text-[#F5F4EC]">{normalizedData.julianDay.toFixed(5)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#D4AF37]/10">
              <span className="text-[#AABDB7]">Geographic Coordinates</span>
              <span className="font-mono text-[#F5F4EC]">
                {normalizedData.latitude.toFixed(4)}°N, {normalizedData.longitude.toFixed(4)}°E
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#AABDB7]">Calculated UTC Offset</span>
              <span className="font-mono text-[#D4AF37]">
                UTC {normalizedData.utcOffset >= 0 ? '+' : ''}
                {normalizedData.utcOffset}h
                {normalizedData.isHistoricalOffsetApplied && ' (Historical)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Settings Card */}
      <div className="p-4 rounded-xl bg-[#0B211B] border border-[#D4AF37]/25 space-y-3">
        <div className="font-mono text-xs uppercase text-[#D4AF37] tracking-wider pb-2 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <span>Active Calculation Assumptions & Settings</span>
          <span className="text-[10px] text-[#AABDB7]">v{calculationSettings.calculationVersion}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#061411] border border-[#D4AF37]/20">
            <span className="text-[9px] text-[#AABDB7] uppercase block">Zodiac Framework</span>
            <span className="text-[#F2D675] font-semibold">{calculationSettings.zodiac.toUpperCase()}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#061411] border border-[#D4AF37]/20">
            <span className="text-[9px] text-[#AABDB7] uppercase block">Ayanamsha Standard</span>
            <span className="text-[#F2D675] font-semibold">{calculationSettings.ayanamsha}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#061411] border border-[#D4AF37]/20">
            <span className="text-[9px] text-[#AABDB7] uppercase block">Lunar Node Type</span>
            <span className="text-[#F2D675] font-semibold">{calculationSettings.nodeType.toUpperCase()} Node</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#061411] border border-[#D4AF37]/20">
            <span className="text-[9px] text-[#AABDB7] uppercase block">House Division</span>
            <span className="text-[#F2D675] font-semibold">{calculationSettings.houseSystem.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
