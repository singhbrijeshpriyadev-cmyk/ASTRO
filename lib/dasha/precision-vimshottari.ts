import { TraditionalGraha } from '@/types/astrology';
import { GRAHA_METADATA, VIMSHOTTARI_SEQUENCE, NAKSHATRAS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';

export interface PratyantardashaPeriod {
  level: 'Pratyantardasha';
  planet: TraditionalGraha;
  startDate: string; // ISO format YYYY-MM-DD
  endDate: string;   // ISO format YYYY-MM-DD
  startMs: number;
  endMs: number;
  durationDays: number;
  isCurrent: boolean;
}

export interface AntardashaPeriod {
  level: 'Antardasha';
  planet: TraditionalGraha;
  startDate: string;
  endDate: string;
  startMs: number;
  endMs: number;
  durationYears: number;
  durationDays: number;
  isCurrent: boolean;
  pratyantardashas: PratyantardashaPeriod[];
}

export interface MahadashaPeriod {
  level: 'Mahadasha';
  planet: TraditionalGraha;
  startDate: string;
  endDate: string;
  startMs: number;
  endMs: number;
  durationYears: number;
  isCurrent: boolean;
  antardashas: AntardashaPeriod[];
}

export interface DashaBalanceAtBirth {
  startingLord: TraditionalGraha;
  nakshatraName: string;
  nakshatraNumber: number;
  nakshatraLord: string;
  degreeInNakshatra: number;
  totalNakshatraSpan: number;
  fractionElapsed: number;
  fractionRemaining: number;
  balanceYears: number;
  balanceMonths: number;
  balanceDays: number;
}

export interface VimshottariTimeline {
  birthDate: string;
  birthMs: number;
  moonSiderealLon: number;
  balanceAtBirth: DashaBalanceAtBirth;
  mahadashas: MahadashaPeriod[];
}

export interface ActiveDashaState {
  targetDate: string;
  targetMs: number;
  mahadasha: MahadashaPeriod;
  antardasha: AntardashaPeriod;
  pratyantardasha: PratyantardashaPeriod;
  mdProgressPercent: number;
  adProgressPercent: number;
  pdProgressPercent: number;
}

const SOLAR_YEAR_DAYS = 365.2425;
const MS_PER_DAY = 24 * 3600 * 1000;
const MS_PER_YEAR = SOLAR_YEAR_DAYS * MS_PER_DAY;

/**
 * Calculates complete Vimshottari Mahadasha, Antardasha, and Pratyantardasha tree
 * with exact astronomical balance at birth.
 */
export function calculatePrecisionVimshottari(
  birthDate: Date,
  moonSiderealLon: number,
  targetLifespanYears = 120
): VimshottariTimeline {
  const normMoon = normalizeDegrees(moonSiderealLon);
  const nakshatraSpan = 360 / 27; // 13° 20' = 13.333333333333334°
  const nakshatraIndex = Math.floor(normMoon / nakshatraSpan);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const startingLord = nakshatra.lord as TraditionalGraha;

  const degInNakshatra = normMoon - nakshatraIndex * nakshatraSpan;
  const fractionElapsed = degInNakshatra / nakshatraSpan;
  const fractionRemaining = 1 - fractionElapsed;

  const startingLordIndex = VIMSHOTTARI_SEQUENCE.indexOf(startingLord);
  const startingLordTotalYears = GRAHA_METADATA[startingLord].vimshottariYears;
  const balanceYearsFloat = fractionRemaining * startingLordTotalYears;

  const balanceYears = Math.floor(balanceYearsFloat);
  const remainingMonthsFloat = (balanceYearsFloat - balanceYears) * 12;
  const balanceMonths = Math.floor(remainingMonthsFloat);
  const balanceDays = Math.round((remainingMonthsFloat - balanceMonths) * 30.4375);

  const balanceAtBirth: DashaBalanceAtBirth = {
    startingLord,
    nakshatraName: nakshatra.name,
    nakshatraNumber: nakshatra.number,
    nakshatraLord: nakshatra.lord,
    degreeInNakshatra: degInNakshatra,
    totalNakshatraSpan: nakshatraSpan,
    fractionElapsed,
    fractionRemaining,
    balanceYears,
    balanceMonths,
    balanceDays,
  };

  const birthMs = birthDate.getTime();
  const nowMs = Date.now();

  // The virtual start of the first Mahadasha occurred before birth
  const firstMdElapsedMs = fractionElapsed * startingLordTotalYears * MS_PER_YEAR;
  let currentStartMs = birthMs - firstMdElapsedMs;

  const mahadashas: MahadashaPeriod[] = [];
  let cumulativeYears = 0;
  let idx = startingLordIndex;

  while (cumulativeYears < targetLifespanYears) {
    const lord = VIMSHOTTARI_SEQUENCE[idx % 9];
    const lordYears = GRAHA_METADATA[lord].vimshottariYears;
    const durationMs = lordYears * MS_PER_YEAR;
    const endMs = currentStartMs + durationMs;

    // We calculate if it intersects life (endMs > birthMs)
    if (endMs > birthMs) {
      const isCurrentMd = nowMs >= Math.max(currentStartMs, birthMs) && nowMs < endMs;
      const mIdx = VIMSHOTTARI_SEQUENCE.indexOf(lord);

      // Calculate 9 Antardashas
      const antardashas: AntardashaPeriod[] = [];
      let adStartMs = currentStartMs;

      for (let s = 0; s < 9; s++) {
        const adLord = VIMSHOTTARI_SEQUENCE[(mIdx + s) % 9];
        const adLordYears = GRAHA_METADATA[adLord].vimshottariYears;
        const adDurationYears = (lordYears * adLordYears) / 120;
        const adDurationMs = adDurationYears * MS_PER_YEAR;
        const adEndMs = adStartMs + adDurationMs;

        if (adEndMs > birthMs) {
          const isCurrentAd = nowMs >= Math.max(adStartMs, birthMs) && nowMs < adEndMs;
          const adIdx = VIMSHOTTARI_SEQUENCE.indexOf(adLord);

          // Calculate 9 Pratyantardashas
          const pratyantardashas: PratyantardashaPeriod[] = [];
          let pdStartMs = adStartMs;

          for (let p = 0; p < 9; p++) {
            const pdLord = VIMSHOTTARI_SEQUENCE[(adIdx + p) % 9];
            const pdLordYears = GRAHA_METADATA[pdLord].vimshottariYears;
            // PD duration in years = (lordYears * adLordYears * pdLordYears) / (120 * 120)
            const pdDurationYears = (lordYears * adLordYears * pdLordYears) / 14400;
            const pdDurationMs = pdDurationYears * MS_PER_YEAR;
            const pdEndMs = pdStartMs + pdDurationMs;

            if (pdEndMs > birthMs) {
              const effectivePdStart = Math.max(pdStartMs, birthMs);
              pratyantardashas.push({
                level: 'Pratyantardasha',
                planet: pdLord,
                startDate: new Date(effectivePdStart).toISOString().split('T')[0],
                endDate: new Date(pdEndMs).toISOString().split('T')[0],
                startMs: effectivePdStart,
                endMs: pdEndMs,
                durationDays: Math.round((pdEndMs - effectivePdStart) / MS_PER_DAY),
                isCurrent: nowMs >= effectivePdStart && nowMs < pdEndMs,
              });
            }
            pdStartMs = pdEndMs;
          }

          const effectiveAdStart = Math.max(adStartMs, birthMs);
          antardashas.push({
            level: 'Antardasha',
            planet: adLord,
            startDate: new Date(effectiveAdStart).toISOString().split('T')[0],
            endDate: new Date(adEndMs).toISOString().split('T')[0],
            startMs: effectiveAdStart,
            endMs: adEndMs,
            durationYears: adDurationYears,
            durationDays: Math.round((adEndMs - effectiveAdStart) / MS_PER_DAY),
            isCurrent: isCurrentAd,
            pratyantardashas,
          });
        }
        adStartMs = adEndMs;
      }

      const effectiveMdStart = Math.max(currentStartMs, birthMs);
      mahadashas.push({
        level: 'Mahadasha',
        planet: lord,
        startDate: new Date(effectiveMdStart).toISOString().split('T')[0],
        endDate: new Date(endMs).toISOString().split('T')[0],
        startMs: effectiveMdStart,
        endMs: endMs,
        durationYears: lordYears,
        isCurrent: isCurrentMd,
        antardashas,
      });

      cumulativeYears += (endMs - effectiveMdStart) / MS_PER_YEAR;
    }

    currentStartMs = endMs;
    idx++;
  }

  return {
    birthDate: birthDate.toISOString(),
    birthMs,
    moonSiderealLon,
    balanceAtBirth,
    mahadashas,
  };
}

/**
 * Resolves the exact active Mahadasha, Antardasha, and Pratyantardasha for any specific date
 */
export function resolveActiveDasha(
  timeline: VimshottariTimeline,
  targetDate: Date = new Date()
): ActiveDashaState | null {
  const targetMs = targetDate.getTime();

  // Find active Mahadasha
  const md = timeline.mahadashas.find(m => targetMs >= m.startMs && targetMs < m.endMs);
  if (!md) {
    // If before birth or after 120-year span, pick the closest edge
    if (timeline.mahadashas.length === 0) return null;
    const fallbackMd = targetMs < timeline.birthMs ? timeline.mahadashas[0] : timeline.mahadashas[timeline.mahadashas.length - 1];
    const fallbackAd = fallbackMd.antardashas[0];
    const fallbackPd = fallbackAd.pratyantardashas[0];
    return {
      targetDate: targetDate.toISOString().split('T')[0],
      targetMs,
      mahadasha: fallbackMd,
      antardasha: fallbackAd,
      pratyantardasha: fallbackPd,
      mdProgressPercent: 0,
      adProgressPercent: 0,
      pdProgressPercent: 0,
    };
  }

  // Find active Antardasha
  const ad = md.antardashas.find(a => targetMs >= a.startMs && targetMs < a.endMs) || md.antardashas[0];

  // Find active Pratyantardasha
  const pd = ad.pratyantardashas.find(p => targetMs >= p.startMs && targetMs < p.endMs) || ad.pratyantardashas[0];

  const mdProgress = Math.min(100, Math.max(0, ((targetMs - md.startMs) / (md.endMs - md.startMs)) * 100));
  const adProgress = Math.min(100, Math.max(0, ((targetMs - ad.startMs) / (ad.endMs - ad.startMs)) * 100));
  const pdProgress = Math.min(100, Math.max(0, ((targetMs - pd.startMs) / (pd.endMs - pd.startMs)) * 100));

  return {
    targetDate: targetDate.toISOString().split('T')[0],
    targetMs,
    mahadasha: md,
    antardasha: ad,
    pratyantardasha: pd,
    mdProgressPercent: Math.round(mdProgress * 10) / 10,
    adProgressPercent: Math.round(adProgress * 10) / 10,
    pdProgressPercent: Math.round(pdProgress * 10) / 10,
  };
}
