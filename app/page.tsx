'use client';

import React, { useState } from 'react';
import { RawBirthInput, CalculationSettings, KundaliData } from '@/types/astrology';
import { calculateKundali } from '@/lib/astrology/kundali';
import { calculateD1RashiChart } from '@/lib/astrology/d1-engine';
import { resolveIndianHistoricalUtcOffset } from '@/lib/location/timezone-history';
import { SidebarNav, NavSection } from '@/components/navigation/SidebarNav';
import { BottomGlassNav } from '@/components/layout/BottomGlassNav';
import { CelestialBackground } from '@/components/layout/CelestialBackground';
import { motion, AnimatePresence } from 'motion/react';
import { motionTokens } from '@/lib/motion/animationTokens';
import { CosmicHero } from '@/components/astrology/CosmicHero';
import { CalculationStatus } from '@/components/astrology/CalculationStatus';
import { BirthDetailsCard } from '@/components/astrology/BirthDetailsCard';
import { ChartSettingsCard } from '@/components/astrology/ChartSettingsCard';
import { KundaliCard } from '@/components/astrology/KundaliCard';
import { KeyInsightsCard } from '@/components/astrology/KeyInsightsCard';
import { QuickActionsCard } from '@/components/astrology/QuickActionsCard';
import { AstroTarotHeroCard } from '@/components/astrology/AstroTarotHeroCard';
import { BirthDataForm } from '@/components/astrology/BirthDataForm';
import { NorthIndianChart } from '@/components/charts/NorthIndianChart';
import { SouthIndianChart } from '@/components/charts/SouthIndianChart';
import { EastIndianChart } from '@/components/charts/EastIndianChart';
import { ChartControls } from '@/components/charts/ChartControls';
import { PanchangCard } from '@/components/astrology/PanchangCard';
import { PlanetaryTable } from '@/components/astrology/PlanetaryTable';
import { BhavaTable } from '@/components/astrology/BhavaTable';
import { VargaGrid } from '@/components/varga/VargaGrid';
import { DivisionalChartsView } from '@/components/varga/DivisionalChartsView';
import { TarotArchetypeShell } from '@/components/tarot/TarotArchetypeShell';
import { DashaTimelineView } from '@/components/dasha/DashaTimelineView';
import { TarotSanctuaryView } from '@/components/tarot/TarotSanctuaryView';
import { InterpretationView } from '@/components/interpretation/InterpretationView';
import { CombinedReadingView } from '@/components/synthesis/CombinedReadingView';
import { YogaDoshaView } from '@/components/yoga/YogaDoshaView';
import { TarotReadingSnapshot } from '@/lib/tarot/types';
import { ChartData } from '@/types/astrology';
import { TransitsView } from '@/components/views/TransitsView';
import { ReportsView } from '@/components/views/ReportsView';
import { ProfileView } from '@/components/views/ProfileView';
import { CalculationAuditModal } from '@/components/audit/CalculationAuditModal';
import { CalculationAuditView } from '@/components/audit/CalculationAuditView';
import { AuthModal, AuthUser } from '@/components/auth/AuthModal';
import { 
  Compass, 
  Clock, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Layers, 
  Radio, 
  BookOpen, 
  ShieldCheck, 
  Edit3, 
  ChevronRight,
  ArrowRightLeft,
  FileText,
  Cpu,
  Cloud
} from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'east'>('north');
  const [showDegrees, setShowDegrees] = useState(true);
  const [activeVarga, setActiveVarga] = useState('D1');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTarotSnapshot, setActiveTarotSnapshot] = useState<TarotReadingSnapshot | null>(null);

  // Sync session on mount
  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Initial Benchmark Horoscope: Ananda Sadhaka born 1995-10-24 08:30 in New Delhi
  const [rawInput, setRawInput] = useState<RawBirthInput>({
    name: 'Ananda Sadhaka',
    birthLocalDate: '1995-10-24',
    birthLocalTime: '08:30:00',
    birthPlace: 'New Delhi, Delhi NCT',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
  });

  const [settings, setSettings] = useState<CalculationSettings>({
    zodiac: 'sidereal',
    ayanamsha: 'Lahiri',
    nodeType: 'true',
    houseSystem: 'whole-sign',
    ephemeris: 'VSOP87/ELP2000 (Swiss Ephemeris precision)',
    calculationVersion: '1.0.0',
  });

  // Calculate full initial kundali
  const [kundali, setKundali] = useState<KundaliData>(() => {
    const [y, m, d] = [1995, 10, 24];
    const [h, min, s] = [8, 30, 0];
    const offsetResult = resolveIndianHistoricalUtcOffset(y, m, d, 77.2090, 'New Delhi');

    return calculateKundali({
      name: 'Ananda Sadhaka',
      year: y,
      month: m,
      day: d,
      hour: h,
      minute: min,
      second: s,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: offsetResult.utcOffsetHours,
      locationName: 'New Delhi, Delhi NCT',
      ayanamshaSystem: 'Lahiri',
    });
  });

  const d1Chart: ChartData = React.useMemo(() => {
    return calculateD1RashiChart(kundali.normalizedData, settings);
  }, [kundali.normalizedData, settings]);

  const handleCompute = async (newRaw: RawBirthInput, newSettings: CalculationSettings) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/astrology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRaw.name,
          birthLocalDate: newRaw.birthLocalDate,
          birthLocalTime: newRaw.birthLocalTime,
          birthPlace: newRaw.birthPlace,
          latitude: newRaw.latitude,
          longitude: newRaw.longitude,
          timezone: newRaw.timezone,
          manualUtcOffset: newRaw.manualUtcOffset,
          ayanamshaSystem: newSettings.ayanamsha,
          houseSystem: newSettings.houseSystem,
          nodeType: newSettings.nodeType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setKundali(data);
        setRawInput(newRaw);
        setSettings(newSettings);
      } else {
        // Fallback to client calculation engine
        const [y, m, d] = newRaw.birthLocalDate.split('-').map(Number);
        const [h, min, s] = newRaw.birthLocalTime.split(':').map(Number);
        const offset = resolveIndianHistoricalUtcOffset(y, m, d, newRaw.longitude, newRaw.birthPlace);

        const clientKundali = calculateKundali({
          name: newRaw.name,
          year: y,
          month: m,
          day: d,
          hour: h,
          minute: min,
          second: s || 0,
          latitude: newRaw.latitude,
          longitude: newRaw.longitude,
          timezone: offset.utcOffsetHours,
          locationName: newRaw.birthPlace,
          ayanamshaSystem: (newSettings.ayanamsha as any) || 'Lahiri',
        });

        setKundali(clientKundali);
        setRawInput(newRaw);
        setSettings(newSettings);
      }
    } catch {
      // Local fallback
      const [y, m, d] = newRaw.birthLocalDate.split('-').map(Number);
      const [h, min, s] = newRaw.birthLocalTime.split(':').map(Number);
      const offset = resolveIndianHistoricalUtcOffset(y, m, d, newRaw.longitude, newRaw.birthPlace);

      const clientKundali = calculateKundali({
        name: newRaw.name,
        year: y,
        month: m,
        day: d,
        hour: h,
        minute: min,
        second: s || 0,
        latitude: newRaw.latitude,
        longitude: newRaw.longitude,
        timezone: offset.utcOffsetHours,
        locationName: newRaw.birthPlace,
        ayanamshaSystem: (newSettings.ayanamsha as any) || 'Lahiri',
      });

      setKundali(clientKundali);
      setRawInput(newRaw);
      setSettings(newSettings);
    } finally {
      setIsLoading(false);
      setShowFormModal(false);
    }
  };

  // Celestial Greeting calculation
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Subha Prabhata (शुभ प्रभात)';
    if (hr < 17) return 'Subha Madhyanha (शुभ मध्याह्न)';
    return 'Subha Sandhya (शुभ संध्या)';
  };

  const [clockTime, setClockTime] = useState<string>('');

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Extract Key Pillars
  const sun = kundali.planets.find(p => p.name === 'Surya')!;
  const moon = kundali.planets.find(p => p.name === 'Chandra')!;
  const activeMahadasha = kundali.dashas.find(d => d.isCurrent) || kundali.dashas[0];
  const activeAntardasha = activeMahadasha?.subPeriods?.find(s => s.isCurrent) || activeMahadasha?.subPeriods?.[0];

  return (
    <div className="min-h-screen text-[#F5F4EC] relative flex flex-col overflow-x-hidden">
      {/* 6-Layer Atmospheric Celestial Animated Background */}
      <CelestialBackground />

      {/* Signature Liquid Glass Floating Bottom Navigation Dock */}
      <BottomGlassNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Content Area (Full width, centered, padded at bottom for dock) */}
      <div className="flex-1 flex flex-col min-w-0 w-full pb-32 sm:pb-36 relative z-10">
        {/* Top Observatory Metric Header */}
        <header className="border-b border-[rgba(212,175,55,0.18)] bg-[#061411]/85 backdrop-blur-2xl sticky top-0 z-20 px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.05 }}
              transition={{ duration: 0.5, ease: motionTokens.ease.standard }}
              className="w-9 h-9 rounded-xl border border-[rgba(212,175,55,0.45)] bg-gradient-to-br from-[#0B211B] via-[#102A23] to-[#061411] flex items-center justify-center text-[#F2D675] font-serif font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.22)] cursor-pointer"
              onClick={() => setActiveSection('home')}
            >
              काल
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold text-[#F5F4EC] tracking-wider">
                  KAALIKA
                </span>
                <span className="text-[10px] text-[#AABDB7]">•</span>
                <span className="text-[9.5px] font-mono uppercase text-[#D4AF37] tracking-widest font-semibold">
                  VEDIC OBSERVATORY
                </span>
              </div>
              <div className="text-[11px] text-[#AABDB7] font-sans flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => setShowFormModal(true)}
                  className="flex items-center gap-1.5 text-[#AABDB7] hover:text-[#F2D675] transition-colors cursor-pointer group"
                >
                  <span className="text-[#AABDB7]">Chart:</span>
                  <span className="font-medium group-hover:underline underline-offset-2">{rawInput.name}</span>
                  <Edit3 className="w-2.5 h-2.5 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono">
            {/* Live Observatory Clock Telemetry */}
            {clockTime && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(11,33,27,0.55)] border border-[rgba(255,255,255,0.08)] text-[#AABDB7] text-[11px] shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009B77] shadow-[0_0_8px_#009B77] animate-pulse" />
                <span className="text-[#AABDB7]">TIME:</span>
                <span className="text-[#F2D675] font-semibold">{clockTime}</span>
              </div>
            )}

            {/* Live Ayanamsha Coordinate Readout */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(11,33,27,0.55)] border border-[rgba(212,175,55,0.22)] text-[#AABDB7] text-[11px] shadow-inner">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#AABDB7]">{kundali.ayanamshaName}:</span>
              <span className="text-[#F2D675] font-semibold">{kundali.panchang.ayanamsa.formatted}</span>
            </div>

            <motion.button
              onClick={() => setShowAuthModal(true)}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(0,155,119,0.40)] bg-[rgba(0,107,91,0.20)] hover:bg-[rgba(0,155,119,0.30)] text-xs font-mono transition-colors shadow-sm cursor-pointer"
              title="Cloud Account & Cross-Device Sync"
            >
              <span className={`w-2 h-2 rounded-full ${currentUser ? 'bg-[#009B77] shadow-[0_0_8px_#009B77]' : 'bg-[#D4AF37]/60'}`} />
              <span className="text-[#F5F4EC] font-medium hidden sm:inline">
                {currentUser ? currentUser.name : 'Cloud Sync'}
              </span>
            </motion.button>

            <motion.button
              onClick={() => setShowDetailsModal(true)}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl border border-[rgba(212,175,55,0.40)] bg-[rgba(212,175,55,0.10)] hover:bg-[rgba(212,175,55,0.20)] hover:border-[rgba(212,175,55,0.6)] text-[#F2D675] hover:text-[#F5F4EC] transition-all font-mono text-[11px] shadow-[0_0_15px_rgba(212,175,55,0.12)] flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Audit Details</span>
            </motion.button>
          </div>
        </header>

        {/* Main Observatory Body View Router with AnimatePresence */}
        <main className="flex-1 p-4 sm:p-7 max-w-[1450px] w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: motionTokens.ease.standard }}
              className="w-full"
            >
              {/* 1. HOME VIEW: THREE-COLUMN OBSERVATORY BLUEPRINT */}
              {activeSection === 'home' && (
                <div className="space-y-6">
                  {/* Hero Section with Live Telemetry & Quick CTAs */}
                  <CosmicHero 
                    kundali={kundali} 
                    onNavigate={setActiveSection} 
                  />

                  {/* Liquid Glass Calculation Status Bar */}
                  <CalculationStatus
                    kundali={kundali}
                    settings={settings}
                    timezone={rawInput.timezone}
                    onOpenAudit={() => setShowDetailsModal(true)}
                  />

                  {/* Three Column Observatory Grid (Desktop: 300px minmax(500px, 1fr) 300px) */}
                  <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(480px,1fr)_300px] gap-4 sm:gap-5 items-start">
                    {/* LEFT COLUMN: Birth Details + Chart Settings */}
                    <div className="space-y-4">
                      <BirthDetailsCard 
                        input={rawInput} 
                        onModify={() => setShowFormModal(true)} 
                      />
                      <ChartSettingsCard 
                        settings={settings} 
                        chartStyle={chartStyle} 
                      />
                    </div>

                    {/* CENTER COLUMN: Natal D1 Rashi Kundali (Primary Focus) */}
                    <div className="w-full">
                      <KundaliCard
                        kundali={kundali}
                        chartStyle={chartStyle}
                        onChangeStyle={setChartStyle}
                        showDegrees={showDegrees}
                        onToggleDegrees={() => setShowDegrees(!showDegrees)}
                      />
                    </div>

                    {/* RIGHT COLUMN: Key Insights + Quick Actions + Astro + Tarot */}
                    <div className="space-y-4">
                      <KeyInsightsCard 
                        kundali={kundali} 
                        onExploreDasha={() => setActiveSection('dashas')} 
                      />
                      <QuickActionsCard 
                        onNavigate={setActiveSection} 
                      />
                      <AstroTarotHeroCard 
                        onExplore={() => setActiveSection('synthesis')} 
                      />
                    </div>
                  </div>

                  {/* Quick Panchanga Strip */}
                  <div className="pt-2">
                    <PanchangCard panchang={kundali.panchang} />
                  </div>
                </div>
              )}

              {/* 2. BIRTH CHART VIEW */}
              {activeSection === 'birth-chart' && (
                <div className="space-y-5">
                  <ChartControls
                    chartStyle={chartStyle}
                    onStyleChange={setChartStyle}
                    showDegrees={showDegrees}
                    onToggleDegrees={() => setShowDegrees(!showDegrees)}
                    activeVarga={activeVarga}
                    onVargaChange={setActiveVarga}
                    onOpenDetails={() => setShowDetailsModal(true)}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-6 flex justify-center p-4 rounded bg-vedic-secondary/70 border border-vedic-gold-border">
                      {chartStyle === 'north' ? (
                        <NorthIndianChart kundali={kundali} vargaId={activeVarga} showDegrees={showDegrees} />
                      ) : chartStyle === 'south' ? (
                        <SouthIndianChart kundali={kundali} vargaId={activeVarga} showDegrees={showDegrees} />
                      ) : (
                        <EastIndianChart kundali={kundali} vargaId={activeVarga} showDegrees={showDegrees} />
                      )}
                    </div>

                    <div className="lg:col-span-6 space-y-4">
                      <PlanetaryTable planets={kundali.planets} ascendant={kundali.ascendant} />
                      <BhavaTable bhavas={kundali.bhavas} />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. DIVISIONAL CHARTS VIEW */}
              {activeSection === 'divisional-charts' && (
                <DivisionalChartsView kundali={kundali} initialChartStyle={chartStyle} />
              )}

              {/* 4. DASHAS VIEW */}
              {activeSection === 'dashas' && (
                <DashaTimelineView
                  chart={d1Chart}
                  birthDate={`${rawInput.birthLocalDate}T${rawInput.birthLocalTime}Z`}
                />
              )}

              {/* 5. TRANSITS VIEW */}
              {activeSection === 'transits' && (
                <TransitsView kundali={kundali} />
              )}

              {/* 6. YOGAS VIEW */}
              {activeSection === 'yogas' && (
                <YogaDoshaView chart={d1Chart} />
              )}

              {/* 7. DOSHAS VIEW */}
              {activeSection === 'doshas' && (
                <YogaDoshaView chart={d1Chart} />
              )}

              {/* 8. TAROT VIEW */}
              {activeSection === 'tarot' && (
                <TarotSanctuaryView
                  onSynthesizeReading={(snap) => {
                    setActiveTarotSnapshot(snap);
                    setActiveSection('synthesis');
                  }}
                />
              )}

              {/* 9. COMBINED ASTROLOGY + TAROT SYNTHESIS VIEW */}
              {activeSection === 'synthesis' && (
                <CombinedReadingView
                  chart={d1Chart}
                  birthDate={`${rawInput.birthLocalDate}T${rawInput.birthLocalTime}Z`}
                  initialSnapshot={activeTarotSnapshot}
                />
              )}

              {/* 10. REPORTS (13-LAYER DETERMINISTIC INTERPRETATION) VIEW */}
              {activeSection === 'reports' && (
                <InterpretationView
                  chart={d1Chart}
                  birthDate={`${rawInput.birthLocalDate}T${rawInput.birthLocalTime}Z`}
                />
              )}

              {/* 11. CALCULATION AUDIT (35-STEP TRACE) VIEW */}
              {activeSection === 'audit' && (
                <CalculationAuditView
                  chart={d1Chart}
                  normalized={kundali.normalizedData}
                  settings={settings}
                />
              )}

              {/* 12. PROFILE VIEW */}
              {activeSection === 'profile' && (
                <ProfileView
                  kundali={kundali}
                  onOpenDetails={() => setShowDetailsModal(true)}
                  currentUser={currentUser}
                  onOpenAuthModal={() => setShowAuthModal(true)}
                  onSelectProfile={(newRaw) => handleCompute(newRaw, settings)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Cloud Authentication & Sync Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* Calculation Audit Modal */}
      <CalculationAuditModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        chart={d1Chart}
        normalized={kundali.normalizedData}
        settings={settings}
      />

      {/* Modify Birth Data Modal with Motion */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFormModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={motionTokens.spring.medium}
              className="relative z-10 w-full max-w-lg bg-vedic-bg border border-vedic-gold-border rounded-xl shadow-2xl p-5 space-y-3 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-vedic-gold-border">
                <h3 className="font-serif text-base font-bold text-vedic-text">
                  Modify Astronomical Coordinates
                </h3>
                <motion.button
                  onClick={() => setShowFormModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs font-mono text-vedic-muted hover:text-vedic-text cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
              <BirthDataForm
                initialValues={rawInput}
                settings={settings}
                onSubmit={handleCompute}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
