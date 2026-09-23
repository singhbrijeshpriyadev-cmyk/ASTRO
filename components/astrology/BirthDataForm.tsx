import React, { useState, useEffect, useRef } from 'react';
import { RawBirthInput, CalculationSettings } from '@/types/astrology';
import { searchIndianLocations, IndianLocation } from '@/lib/location/indian-locations';
import { resolveIndianHistoricalUtcOffset } from '@/lib/location/timezone-history';
import { MapPin, Calendar, Clock, Compass, Search, ChevronDown, Check } from 'lucide-react';

interface BirthDataFormProps {
  initialValues: RawBirthInput;
  settings: CalculationSettings;
  onSubmit: (raw: RawBirthInput, settings: CalculationSettings) => void;
  isLoading?: boolean;
}

export function BirthDataForm({ initialValues, settings, onSubmit, isLoading = false }: BirthDataFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [birthDate, setBirthDate] = useState(initialValues.birthLocalDate);
  const [birthTime, setBirthTime] = useState(initialValues.birthLocalTime);
  const [birthPlace, setBirthPlace] = useState(initialValues.birthPlace);
  const [latitude, setLatitude] = useState(initialValues.latitude);
  const [longitude, setLongitude] = useState(initialValues.longitude);
  const [timezone, setTimezone] = useState(initialValues.timezone);
  const [manualOffset, setManualOffset] = useState<number | undefined>(initialValues.manualUtcOffset);

  // Settings
  const [calcSettings, setCalcSettings] = useState<CalculationSettings>(settings);

  // Location search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<IndianLocation[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute live historical offset preview
  const [historicalInfo, setHistoricalInfo] = useState(() => {
    const [y, m, d] = (initialValues.birthLocalDate || '1995-10-24').split('-').map(Number);
    return resolveIndianHistoricalUtcOffset(y || 1995, m || 10, d || 24, initialValues.longitude, initialValues.birthPlace);
  });

  useEffect(() => {
    const [y, m, d] = (birthDate || '1995-10-24').split('-').map(Number);
    if (y && m && d) {
      const info = resolveIndianHistoricalUtcOffset(y, m, d, longitude, birthPlace);
      setHistoricalInfo(info);
    }
  }, [birthDate, longitude, birthPlace]);

  useEffect(() => {
    setLocationSuggestions(searchIndianLocations(searchQuery, 8));
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: IndianLocation) => {
    setBirthPlace(`${loc.name}, ${loc.state}`);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setTimezone(loc.timezone);
    setShowLocationDropdown(false);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      birthLocalDate: birthDate,
      birthLocalTime: birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone,
      manualUtcOffset: manualOffset,
    }, calcSettings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Native Name / Reference */}
      <div>
        <label className="block text-[10.5px] font-mono uppercase tracking-widest text-vedic-gold mb-1">
          Native / Inscription Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-vedic-bg border border-vedic-gold-border rounded px-3 py-1.5 text-xs text-vedic-text focus:outline-none focus:border-vedic-gold font-sans"
          placeholder="e.g. Ananda Sadhaka"
          required
        />
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date of Birth */}
        <div>
          <label className="block text-[10.5px] font-mono uppercase tracking-widest text-vedic-gold mb-1 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-vedic-muted" /> Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full bg-vedic-bg border border-vedic-gold-border rounded px-2.5 py-1.5 text-xs text-vedic-text font-mono focus:outline-none focus:border-vedic-gold"
            required
          />
        </div>

        {/* Exact Birth Time */}
        <div>
          <label className="block text-[10.5px] font-mono uppercase tracking-widest text-vedic-gold mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-vedic-muted" /> Exact Time (24h)
          </label>
          <input
            type="time"
            step="1"
            value={birthTime}
            onChange={e => setBirthTime(e.target.value)}
            className="w-full bg-vedic-bg border border-vedic-gold-border rounded px-2.5 py-1.5 text-xs text-vedic-text font-mono focus:outline-none focus:border-vedic-gold"
            required
          />
        </div>
      </div>

      {/* Searchable Indian Locations */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10.5px] font-mono uppercase tracking-widest text-vedic-gold flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-vedic-muted" /> Birth Place (Search Indian Cities/Towns)
          </label>
          <span className="text-[9.5px] font-mono text-vedic-muted">100+ Astrological Observatories</span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={birthPlace}
            onFocus={() => setShowLocationDropdown(true)}
            onChange={e => {
              setBirthPlace(e.target.value);
              setSearchQuery(e.target.value);
              setShowLocationDropdown(true);
            }}
            placeholder="Search city, town, or tirtha (e.g. Varanasi, Ujjain, Delhi)"
            className="w-full bg-vedic-bg border border-vedic-gold-border rounded pl-8 pr-3 py-1.5 text-xs text-vedic-text focus:outline-none focus:border-vedic-gold font-sans"
            required
          />
          <Search className="w-3.5 h-3.5 text-vedic-muted absolute left-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Autocomplete Dropdown */}
        {showLocationDropdown && (
          <div className="absolute z-30 left-0 right-0 mt-1 bg-vedic-secondary border border-vedic-gold-border rounded shadow-2xl max-h-56 overflow-y-auto no-scrollbar py-1">
            {locationSuggestions.map(loc => (
              <button
                type="button"
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-vedic-surface flex items-center justify-between transition-colors border-b border-vedic-gold-border/30 last:border-none"
              >
                <div>
                  <div className="text-vedic-text font-medium flex items-center gap-1.5">
                    <span>{loc.name}</span>
                    {loc.category === 'pilgrimage' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-vedic-gold/15 text-vedic-gold-soft font-mono uppercase">
                        Tirtha
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-vedic-text-secondary font-mono">
                    {loc.state} • {loc.latitude.toFixed(4)}°N, {loc.longitude.toFixed(4)}°E
                  </div>
                </div>
                {birthPlace.includes(loc.name) && (
                  <Check className="w-3.5 h-3.5 text-vedic-gold" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Geographical Coordinates & Historical Timezone Strip */}
      <div className="p-2.5 rounded bg-vedic-surface/60 border border-vedic-gold-border space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
          <div>
            <span className="text-vedic-muted block text-[9.5px]">LATITUDE</span>
            <span className="text-vedic-text font-semibold">{latitude.toFixed(4)}° N</span>
          </div>
          <div>
            <span className="text-vedic-muted block text-[9.5px]">LONGITUDE</span>
            <span className="text-vedic-text font-semibold">{longitude.toFixed(4)}° E</span>
          </div>
        </div>

        {/* Historical UTC Offset Badge */}
        <div className="pt-1.5 border-t border-vedic-gold-border/50 text-[10px] font-mono flex items-center justify-between">
          <span className="text-vedic-muted">ASTRONOMICAL OFFSET:</span>
          <span className={`px-1.5 py-0.5 rounded font-bold ${
            historicalInfo.isHistoricalDeviation 
              ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
              : 'bg-vedic-peacock/20 text-vedic-gold-soft border border-vedic-gold-border'
          }`}>
            {historicalInfo.offsetFormatted} ({historicalInfo.timezoneName})
          </span>
        </div>

        {historicalInfo.isHistoricalDeviation && (
          <p className="text-[9.5px] text-amber-200/80 font-sans italic leading-tight">
            *{historicalInfo.notes}
          </p>
        )}
      </div>

      {/* Ayanamsha & House System Settings Toggle */}
      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
        <div>
          <label className="block text-[10px] font-mono uppercase text-vedic-gold mb-1">
            Ayanamsha
          </label>
          <select
            value={calcSettings.ayanamsha}
            onChange={e => setCalcSettings({ ...calcSettings, ayanamsha: e.target.value as any })}
            className="w-full bg-vedic-bg border border-vedic-gold-border rounded px-2 py-1 text-xs text-vedic-text font-mono focus:outline-none focus:border-vedic-gold"
          >
            <option value="Lahiri">Lahiri (Chitra-Paksha)</option>
            <option value="Krishnamurti">Krishnamurti (KP)</option>
            <option value="Raman">B.V. Raman</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase text-vedic-gold mb-1">
            House System
          </label>
          <select
            value={calcSettings.houseSystem}
            onChange={e => setCalcSettings({ ...calcSettings, houseSystem: e.target.value as any })}
            className="w-full bg-vedic-bg border border-vedic-gold-border rounded px-2 py-1 text-xs text-vedic-text font-mono focus:outline-none focus:border-vedic-gold"
          >
            <option value="whole-sign">Whole Sign (Parashari)</option>
            <option value="equal-house">Equal House</option>
            <option value="sripati">Sripati (Porphyry)</option>
          </select>
        </div>
      </div>

      {/* Submit Calculation Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-2.5 px-4 rounded bg-vedic-gold text-vedic-bg font-serif font-bold tracking-widest uppercase text-xs hover:bg-vedic-gold-soft transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        {isLoading ? 'Computing Ephemeris...' : 'Calculate Ephemeris & D1'}
      </button>
    </form>
  );
}
