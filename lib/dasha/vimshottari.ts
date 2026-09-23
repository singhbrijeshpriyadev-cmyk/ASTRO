import { TraditionalGraha, VimshottariDashaPeriod } from '@/types/astrology';
import { GRAHA_METADATA, VIMSHOTTARI_SEQUENCE, NAKSHATRAS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';

/**
 * Calculates complete Vimshottari Mahadasha and Antardasha timeline from birth date and Moon sidereal longitude.
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonSiderealLon: number,
  targetYears = 100
): VimshottariDashaPeriod[] {
  const normMoon = normalizeDegrees(moonSiderealLon);
  const nakshatraSpan = 360 / 27; // 13.33333333°
  const nakshatraIndex = Math.floor(normMoon / nakshatraSpan);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const startingLord = nakshatra.lord as TraditionalGraha;

  const degInNakshatra = normMoon - nakshatraIndex * nakshatraSpan;
  const elapsedFraction = degInNakshatra / nakshatraSpan;
  const remainingFraction = 1 - elapsedFraction;

  const startingLordIndex = VIMSHOTTARI_SEQUENCE.indexOf(startingLord);
  const startingLordYears = GRAHA_METADATA[startingLord].vimshottariYears;

  const birthMs = birthDate.getTime();
  const msPerYear = 365.2425 * 24 * 3600 * 1000;

  // Virtual start date of first Mahadasha
  let currentStartMs = birthMs - elapsedFraction * startingLordYears * msPerYear;
  const nowMs = Date.now();

  const dashaList: VimshottariDashaPeriod[] = [];
  let cumulativeYears = 0;
  let idx = startingLordIndex;

  while (cumulativeYears < targetYears) {
    const lord = VIMSHOTTARI_SEQUENCE[idx % 9];
    const lordYears = GRAHA_METADATA[lord].vimshottariYears;
    const durationMs = lordYears * msPerYear;
    const endMs = currentStartMs + durationMs;

    // Only include periods that overlap life (endMs >= birthMs)
    if (endMs >= birthMs) {
      const isCurrent = nowMs >= Math.max(currentStartMs, birthMs) && nowMs < endMs;
      
      // Calculate 9 Antardashas for this Mahadasha
      const subPeriods: VimshottariDashaPeriod[] = [];
      let subStartMs = currentStartMs;
      const mIdx = VIMSHOTTARI_SEQUENCE.indexOf(lord);

      for (let s = 0; s < 9; s++) {
        const subLord = VIMSHOTTARI_SEQUENCE[(mIdx + s) % 9];
        const subLordYears = GRAHA_METADATA[subLord].vimshottariYears;
        const subDurationYears = (lordYears * subLordYears) / 120;
        const subDurationMs = subDurationYears * msPerYear;
        const subEndMs = subStartMs + subDurationMs;

        if (subEndMs >= birthMs) {
          subPeriods.push({
            planet: subLord,
            startDate: new Date(Math.max(subStartMs, birthMs)).toISOString().split('T')[0],
            endDate: new Date(subEndMs).toISOString().split('T')[0],
            durationYears: subDurationYears,
            isCurrent: nowMs >= Math.max(subStartMs, birthMs) && nowMs < subEndMs,
          });
        }
        subStartMs = subEndMs;
      }

      dashaList.push({
        planet: lord,
        startDate: new Date(Math.max(currentStartMs, birthMs)).toISOString().split('T')[0],
        endDate: new Date(endMs).toISOString().split('T')[0],
        durationYears: lordYears,
        isCurrent,
        subPeriods,
      });

      cumulativeYears += (endMs - Math.max(currentStartMs, birthMs)) / msPerYear;
    }

    currentStartMs = endMs;
    idx++;
  }

  return dashaList;
}
