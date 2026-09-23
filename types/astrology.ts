export type TraditionalGraha = 
  | 'Surya' 
  | 'Chandra' 
  | 'Mangala' 
  | 'Budha' 
  | 'Guru' 
  | 'Shukra' 
  | 'Shani' 
  | 'Rahu' 
  | 'Ketu'
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn';

export type GrahaName = 
  | TraditionalGraha
  | 'Uranus' 
  | 'Neptune' 
  | 'Pluto'
  | 'Lagna'
  | 'Ascendant';

export type RashiName = 
  | 'Mesha' 
  | 'Vrishabha' 
  | 'Mithuna' 
  | 'Karka' 
  | 'Simha' 
  | 'Kanya' 
  | 'Tula' 
  | 'Vrishchika' 
  | 'Dhanu' 
  | 'Makara' 
  | 'Kumbha' 
  | 'Meena';

export type WesternZodiac = 
  | 'Aries' 
  | 'Taurus' 
  | 'Gemini' 
  | 'Cancer' 
  | 'Leo' 
  | 'Virgo' 
  | 'Libra' 
  | 'Scorpio' 
  | 'Sagittarius' 
  | 'Capricorn' 
  | 'Aquarius' 
  | 'Pisces';

export type NakshatraName = 
  | 'Ashwini' 
  | 'Bharani' 
  | 'Krittika' 
  | 'Rohini' 
  | 'Mrigashira' 
  | 'Ardra' 
  | 'Punarvasu' 
  | 'Pushya' 
  | 'Ashlesha' 
  | 'Magha' 
  | 'Purva Phalguni' 
  | 'Uttara Phalguni' 
  | 'Hasta' 
  | 'Chitra' 
  | 'Swati' 
  | 'Vishakha' 
  | 'Anuradha' 
  | 'Jyeshtha' 
  | 'Mula' 
  | 'Purva Ashadha' 
  | 'Uttara Ashadha' 
  | 'Shravana' 
  | 'Dhanishta' 
  | 'Shatabhisha' 
  | 'Purva Bhadrapada' 
  | 'Uttara Bhadrapada' 
  | 'Revati';

export type DignityType = 
  | 'Exalted' 
  | 'Moolatrikona' 
  | 'Own Sign' 
  | 'Great Friend' 
  | 'Friend' 
  | 'Neutral' 
  | 'Enemy' 
  | 'Great Enemy' 
  | 'Debilitated';

/**
 * Raw input as provided by the user.
 */
export interface RawBirthInput {
  name: string;
  birthLocalDate: string; // "YYYY-MM-DD"
  birthLocalTime: string; // "HH:MM:SS" or "HH:MM"
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string; // e.g. "Asia/Kolkata" or "LMT"
  manualUtcOffset?: number;
}

/**
 * Normalized astronomical calculation data after resolving coordinates and historical timezones.
 */
export interface NormalizedBirthData {
  rawInput: RawBirthInput;
  resolvedPlace: {
    name: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  birthLocalDate: string;
  birthLocalTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffset: number; // in hours, e.g. 5.5, 6.5
  birthUTC: string;  // ISO UTC string
  julianDay: number;
  isHistoricalOffsetApplied: boolean;
  historicalOffsetNote?: string;
}

/**
 * Explicit calculation settings object.
 */
export interface CalculationSettings {
  zodiac: 'sidereal' | 'tropical' | string;
  ayanamsha: 'Lahiri' | 'Krishnamurti' | 'Raman' | string;
  nodeType: 'true' | 'mean' | string;
  houseSystem: 'whole-sign' | 'equal-house' | 'sripati' | 'placidus' | string;
  ephemeris: string; // e.g. 'VSOP87/ELP2000 (Swiss Ephemeris precision)'
  calculationVersion?: string; // e.g. '1.0.0'
}

/**
 * Explicit PlanetPosition type requested.
 */
export interface PlanetPosition {
  name: GrahaName;
  planet: TraditionalGraha;
  englishName: string;
  sanskrit: string;
  symbol: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  zodiacSign: RashiName;
  zodiacSignEnglish?: WesternZodiac;
  sign?: string;
  signIndex?: number;
  rashiNumber: number; // 1-12
  degree: number;      // 0-29 integer
  minutes: number;     // 0-59 integer
  minute?: number;     // 0-59 alias
  seconds: number;     // 0-59 integer
  second?: number;     // 0-59 alias
  degreeDecimal?: number; // 0 to 30
  dms: string;         // e.g. 14° 23' 11"
  house: number;       // 1-12
  isRetrograde: boolean;
  isCombust: boolean;
  speed?: number;
  nakshatra: NakshatraName | string;
  nakshatraNumber: number; // 1-27
  pada: number;        // 1-4
  nakshatraLord: TraditionalGraha;
  dignity: DignityType | string;
}

/**
 * Explicit Ascendant type requested.
 */
export interface Ascendant {
  tropicalLongitude?: number;
  siderealLongitude?: number;
  longitude: number;
  zodiacSign?: RashiName;
  zodiacSignEnglish?: WesternZodiac;
  sign: string;
  signIndex: number;
  rashiNumber: number;
  degree: number;
  minutes: number;
  minute?: number;
  seconds: number;
  second?: number;
  degreeDecimal?: number;
  dms: string;
  formatted?: string;
  nakshatra?: NakshatraName | string;
  nakshatraNumber?: number;
  pada?: number;
  nakshatraLord?: TraditionalGraha;
}

/**
 * Explicit HousePosition type requested.
 */
export interface HousePosition {
  houseNumber: number; // 1-12
  zodiacSign?: RashiName;
  sign?: string;
  signIndex?: number;
  rashiNumber: number;
  cuspLongitude: number;
  degree: number;
  minutes: number;
  minute?: number;
  seconds: number;
  second?: number;
  dms: string;
  lord: TraditionalGraha;
  occupants: GrahaName[];
  significances: string[];
}

/**
 * Explicit ChartData type requested for D1 / Vargas.
 */
export interface ChartData {
  chartId?: string; // 'D1', 'D9', etc.
  name?: string;
  sanskritName?: string;
  ascendant: Ascendant;
  mc?: {
    tropicalLongitude: number;
    siderealLongitude: number;
    zodiacSign: RashiName;
    degreeDecimal: number;
    dms: string;
  };
  planets: PlanetPosition[];
  houses: HousePosition[];
  calculationSettings: CalculationSettings;
  normalizedBirthData?: NormalizedBirthData;
}

// Backward compatibility aliases
export type PlanetaryPosition = PlanetPosition;
export type BhavaData = HousePosition;

export interface PanchangData {
  tithi: {
    number: number;
    name: string;
    paksha: 'Shukla' | 'Krishna';
    completionPercentage: number;
  };
  nakshatra: {
    number: number;
    name: string;
    lord: TraditionalGraha;
    pada: number;
    completionPercentage: number;
  };
  yoga: {
    number: number;
    name: string;
  };
  karana: {
    number: number;
    name: string;
  };
  vaara: {
    dayNumber: number;
    name: string;
    lord: TraditionalGraha;
  };
  ayanamsa: {
    name: string;
    value: number;
    formatted: string;
  };
  sunRise: string;
  sunSet: string;
}

export interface VimshottariDashaPeriod {
  planet: TraditionalGraha;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent?: boolean;
  subPeriods?: VimshottariDashaPeriod[];
}

export interface VargaChart {
  id: string;
  name: string;
  sanskritName: string;
  factor: number;
  description: string;
  ascendant: {
    rashi: RashiName;
    rashiNumber: number;
    degreeInRashi: number;
  };
  positions: Record<GrahaName, {
    rashi: RashiName;
    rashiNumber: number;
    degreeInRashi: number;
    house: number;
  }>;
}

export interface YogaResult {
  name: string;
  sanskritName: string;
  category: 'Mahapurusha' | 'Raja' | 'Dhana' | 'Auspicious' | 'Inauspicious' | 'Dosha';
  beneficence: 'positive' | 'challenging' | 'neutral';
  planetsInvolved: GrahaName[];
  housesInvolved: number[];
  description: string;
  effects: string;
}

export interface KundaliData {
  chartData: ChartData;
  rawInput: RawBirthInput;
  normalizedData: NormalizedBirthData;
  calculationSettings: CalculationSettings;
  julianDay: number;
  greenwichSiderealTimeHours: number;
  localSiderealTimeHours: number;
  ayanamshaValue: number;
  ayanamshaName: string;
  ascendant: PlanetPosition;
  planets: PlanetPosition[];
  bhavas: HousePosition[];
  panchang: PanchangData;
  vargas: Record<string, VargaChart>;
  dashas: VimshottariDashaPeriod[];
  yogas: YogaResult[];
  // For legacy access
  birthInput: {
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second?: number;
    latitude: number;
    longitude: number;
    timezone: number;
    locationName?: string;
    ayanamshaSystem?: 'Lahiri' | 'Krishnamurti' | 'Raman';
  };
}
