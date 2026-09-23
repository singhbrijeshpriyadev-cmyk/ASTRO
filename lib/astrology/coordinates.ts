import { RASHIS, NAKSHATRAS, GRAHA_METADATA } from './constants';
import { RashiName, WesternZodiac, NakshatraName, TraditionalGraha, DignityType } from '@/types/astrology';

/**
 * Normalizes any angle in degrees to the [0, 360) interval.
 */
export function normalizeDegrees(deg: number): number {
  const norm = deg % 360;
  return norm < 0 ? norm + 360 : norm;
}

/**
 * Formats a decimal degree value into astronomical DMS (Degrees, Minutes, Seconds)
 * e.g., 14.5234 -> 14° 31' 24"
 */
export function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  
  // Handle edge case where rounding seconds bumps to 60
  if (s === 60) {
    return `${d}° ${String(m + 1).padStart(2, '0')}' 00"`;
  }
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
}

/**
 * Maps a continuous sidereal longitude [0, 360) to Rashi, Nakshatra, and Pada details.
 */
export function getSiderealPositionDetails(siderealLon: number) {
  const norm = normalizeDegrees(siderealLon);
  const rashiIndex = Math.floor(norm / 30);
  const degreeInRashi = norm - (rashiIndex * 30);
  const rashi = RASHIS[rashiIndex];

  const nakshatraSpan = 360 / 27; // 13° 20' = 13.33333333°
  const nakshatraIndex = Math.floor(norm / nakshatraSpan);
  const degInNakshatra = norm - (nakshatraIndex * nakshatraSpan);
  const padaSpan = nakshatraSpan / 4; // 3° 20' = 3.33333333°
  const pada = Math.floor(degInNakshatra / padaSpan) + 1;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  return {
    rashi: rashi.name as RashiName,
    rashiEnglish: rashi.english as WesternZodiac,
    rashiNumber: rashi.number,
    degreeInRashi,
    dms: formatDMS(degreeInRashi),
    nakshatra: nakshatra.name as NakshatraName,
    nakshatraNumber: nakshatra.number,
    pada,
    nakshatraLord: nakshatra.lord as TraditionalGraha,
  };
}

/**
 * Calculates Graha Dignity (Exalted, Debilitated, Moolatrikona, Own Sign, Friend, Enemy)
 */
export function calculateDignity(
  planet: TraditionalGraha,
  rashi: RashiName,
  degreeInRashi: number
): DignityType {
  const meta = GRAHA_METADATA[planet];
  if (!meta) return 'Neutral';

  if (rashi === meta.exaltedRashi) {
    return 'Exalted';
  }
  if (rashi === meta.debilitatedRashi) {
    return 'Debilitated';
  }
  if (rashi === meta.moolatrikonaRashi && degreeInRashi <= 20) {
    return 'Moolatrikona';
  }
  if (meta.ownRashis.includes(rashi)) {
    return 'Own Sign';
  }

  // Determine relationship to the ruler of the sign
  const signInfo = RASHIS.find(r => r.name === rashi);
  if (!signInfo) return 'Neutral';
  const signLord = signInfo.lord;

  if (meta.friends.includes(signLord)) {
    return 'Friend';
  }
  if (meta.enemies.includes(signLord)) {
    return 'Enemy';
  }
  return 'Neutral';
}

/**
 * Calculates Bhava / House placement from Ascendant (Whole Sign / Equal House system)
 */
export function calculateHouse(grahaRashiNumber: number, lagnaRashiNumber: number): number {
  return ((grahaRashiNumber - lagnaRashiNumber + 12) % 12) + 1;
}
