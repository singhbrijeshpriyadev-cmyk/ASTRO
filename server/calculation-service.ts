import { 
  RawBirthInput, 
  NormalizedBirthData, 
  CalculationSettings, 
  KundaliData,
  ChartData
} from '@/types/astrology';
import { StrictBirthInputSchema } from '@/lib/validation/birth-schema';
import { resolveIndianHistoricalUtcOffset } from '@/lib/location/timezone-history';
import { calculateD1RashiChart } from '@/lib/astrology/d1-engine';
import { calculateKundali } from '@/lib/astrology/kundali';

export interface CalculationServiceResult {
  success: boolean;
  data?: KundaliData;
  error?: string;
  timestamp: string;
  engineVersion: string;
}

export class AstrologyCalculationService {
  private static instance: AstrologyCalculationService;
  private cache: Map<string, { result: CalculationServiceResult; timestamp: number }> = new Map();
  private readonly MAX_CACHE_SIZE = 500;
  private readonly CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

  public static getInstance(): AstrologyCalculationService {
    if (!AstrologyCalculationService.instance) {
      AstrologyCalculationService.instance = new AstrologyCalculationService();
    }
    return AstrologyCalculationService.instance;
  }

  public getCacheKey(valid: any, settings: CalculationSettings): string {
    return [
      valid.birthLocalDate,
      valid.birthLocalTime,
      Number(valid.latitude).toFixed(6),
      Number(valid.longitude).toFixed(6),
      valid.timezone || 'auto',
      valid.manualUtcOffset ?? 'auto',
      settings.zodiac,
      settings.ayanamsha,
      settings.nodeType,
      settings.houseSystem,
    ].join('|');
  }

  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Normalizes raw user input into deterministic astronomical coordinates,
   * applying historical timezone offset rules rather than blindly assuming +05:30.
   */
  public normalizeBirthData(raw: RawBirthInput): NormalizedBirthData {
    const [yStr, mStr, dStr] = raw.birthLocalDate.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const day = parseInt(dStr, 10);

    const timeParts = raw.birthLocalTime.split(':').map(p => parseInt(p, 10));
    const hour = timeParts[0];
    const minute = timeParts[1];
    const second = timeParts[2] !== undefined ? timeParts[2] : 0;

    // Determine UTC offset
    let utcOffset = raw.manualUtcOffset;
    let isHistorical = false;
    let offsetNote: string | undefined = undefined;

    // Check if coordinates belong to India (approx Lat 6° to 38°N, Lon 68° to 98°E) or location mentions India
    const isIndiaCoords = raw.latitude >= 6 && raw.latitude <= 38 && raw.longitude >= 68 && raw.longitude <= 98;
    const isIndiaNamed = raw.birthPlace.toLowerCase().includes('india') || raw.timezone.includes('Kolkata');

    if (utcOffset === undefined && (isIndiaCoords || isIndiaNamed)) {
      const hist = resolveIndianHistoricalUtcOffset(year, month, day, raw.longitude, raw.birthPlace);
      utcOffset = hist.utcOffsetHours;
      isHistorical = hist.isHistoricalDeviation;
      offsetNote = hist.notes;
    }

    if (utcOffset === undefined) {
      // Default to +5.5 for Indian timezone if unassigned, or standard offset
      utcOffset = 5.5;
    }

    // Compute exact UTC timestamp
    // Local date-time converted to epoch milliseconds
    const localMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const offsetMs = utcOffset * 3600 * 1000;
    const utcMs = localMs - offsetMs;
    const birthUTCDate = new Date(utcMs);
    const birthUTC = birthUTCDate.toISOString();

    // High-precision Julian Day number
    const julianDay = (utcMs / 86400000) + 2440587.5;

    return {
      rawInput: raw,
      resolvedPlace: {
        name: raw.birthPlace,
        country: 'India',
        latitude: raw.latitude,
        longitude: raw.longitude,
      },
      birthLocalDate: raw.birthLocalDate,
      birthLocalTime: raw.birthLocalTime,
      latitude: raw.latitude,
      longitude: raw.longitude,
      timezone: raw.timezone,
      utcOffset,
      birthUTC,
      julianDay,
      isHistoricalOffsetApplied: isHistorical,
      historicalOffsetNote: offsetNote,
    };
  }

  public async computeKundali(rawPayload: unknown): Promise<CalculationServiceResult> {
    const parse = StrictBirthInputSchema.safeParse(rawPayload);
    if (!parse.success) {
      const msg = parse.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
      return {
        success: false,
        error: msg,
        timestamp: new Date().toISOString(),
        engineVersion: 'Kaalika-AstroEngine-v1.0 (VSOP87/ELP2000 & Lahiri Chitra-Paksha)',
      };
    }

    try {
      const valid = parse.data;
      const rawInput: RawBirthInput = {
        name: valid.name,
        birthLocalDate: valid.birthLocalDate,
        birthLocalTime: valid.birthLocalTime,
        birthPlace: valid.birthPlace,
        latitude: valid.latitude,
        longitude: valid.longitude,
        timezone: valid.timezone,
        manualUtcOffset: valid.manualUtcOffset,
      };

      const settings: CalculationSettings = {
        zodiac: 'sidereal',
        ayanamsha: valid.ayanamshaSystem || 'Lahiri',
        nodeType: valid.nodeType || 'true',
        houseSystem: valid.houseSystem || 'whole-sign',
        ephemeris: 'VSOP87/ELP2000 (Swiss Ephemeris precision)',
        calculationVersion: '1.0.0',
      };

      const cacheKey = this.getCacheKey(valid, settings);
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL_MS)) {
        return cached.result;
      }

      const normalized = this.normalizeBirthData(rawInput);
      const d1Chart = calculateD1RashiChart(normalized, settings);

      // Parse legacy input format to generate full Kundali pipeline (dashas, yogas, etc.)
      const [y, m, d] = valid.birthLocalDate.split('-').map(Number);
      const [h, min, s] = valid.birthLocalTime.split(':').map(Number);

      const legacyKundali = calculateKundali({
        name: valid.name,
        year: y,
        month: m,
        day: d,
        hour: h,
        minute: min,
        second: s || 0,
        latitude: valid.latitude,
        longitude: valid.longitude,
        timezone: normalized.utcOffset,
        locationName: valid.birthPlace,
        ayanamshaSystem: valid.ayanamshaSystem,
      }, settings);

      const fullData: KundaliData = {
        ...legacyKundali,
        chartData: d1Chart,
        planets: d1Chart.planets,
        bhavas: d1Chart.houses,
        ascendant: {
          ...legacyKundali.ascendant,
          name: 'Lagna',
          planet: 'Ascendant' as any,
          englishName: 'Ascendant (Lagna)',
          sanskrit: 'लग्न',
          tropicalLongitude: d1Chart.ascendant.tropicalLongitude || legacyKundali.ascendant.tropicalLongitude,
          siderealLongitude: d1Chart.ascendant.siderealLongitude || d1Chart.ascendant.longitude,
          degree: d1Chart.ascendant.degree,
          minutes: d1Chart.ascendant.minutes,
          seconds: d1Chart.ascendant.seconds,
          rashiNumber: d1Chart.ascendant.rashiNumber,
          zodiacSign: d1Chart.ascendant.zodiacSign || legacyKundali.ascendant.zodiacSign,
          zodiacSignEnglish: d1Chart.ascendant.zodiacSignEnglish || legacyKundali.ascendant.zodiacSignEnglish,
          dms: d1Chart.ascendant.dms,
        },
        rawInput,
        normalizedData: normalized,
        calculationSettings: settings,
      };

      const result: CalculationServiceResult = {
        success: true,
        data: fullData,
        timestamp: new Date().toISOString(),
        engineVersion: 'Kaalika-AstroEngine-v1.0 (VSOP87/ELP2000 & Lahiri Chitra-Paksha)',
      };

      this.cache.set(cacheKey, { result, timestamp: Date.now() });
      if (this.cache.size > this.MAX_CACHE_SIZE) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) this.cache.delete(oldestKey);
      }

      return result;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Astronomical calculation error',
        timestamp: new Date().toISOString(),
        engineVersion: 'Kaalika-AstroEngine-v1.0',
      };
    }
  }
}

export const calculationService = AstrologyCalculationService.getInstance();
