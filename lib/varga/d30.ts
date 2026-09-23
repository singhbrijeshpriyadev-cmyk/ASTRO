import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D30Definition: VargaDefinition = {
  id: 'D30',
  number: 30,
  name: 'Trimshamsha',
  sanskritName: 'त्रिंशांश',
  purpose: 'Inherent misfortunes, character blemishes, sub-conscious weaknesses, and moral/karmic afflictions (Arishta)',
  divisionCount: 30,
  spanDegrees: 1, // Average 1 degree, but traditional boundary is UNEQUAL (5°, 5°, 8°, 7°, 5°)
  calculationMethod: 'Unequal five-fold traditional planetary partitions (Mars, Saturn, Jupiter, Mercury, Venus)',
  signMapping: 'Odd signs: 0-5° Aries (Mars), 5-10° Aquarius (Saturn), 10-18° Sagittarius (Jupiter), 18-25° Gemini (Mercury), 25-30° Taurus (Venus). Even signs: 0-5° Taurus (Venus), 5-12° Virgo (Mercury), 12-20° Pisces (Jupiter), 20-25° Capricorn (Saturn), 25-30° Scorpio (Mars).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: 'Strict unequal planetary boundaries governed by Agni, Vayu, Indra, Varuna, and Yama',
  traditionalNotes: 'BPHS Ch. 6, Sl. 28: Sun and Moon have no lordship in Trimshamsha. Primary chart for analyzing moral temptations, hidden vices, and female horoscopy character determinations.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const isOdd = (rashiIndex + 1) % 2 !== 0;

    let targetRashiNumber = 1;
    let deity = 'Agni';
    let fraction = 0;

    if (isOdd) {
      if (degInRashi < 5) {
        targetRashiNumber = 1; // Aries (Mars)
        deity = 'Agni (Fire)';
        fraction = degInRashi / 5;
      } else if (degInRashi < 10) {
        targetRashiNumber = 11; // Aquarius (Saturn)
        deity = 'Vayu (Wind)';
        fraction = (degInRashi - 5) / 5;
      } else if (degInRashi < 18) {
        targetRashiNumber = 9; // Sagittarius (Jupiter)
        deity = 'Indra (Sovereign)';
        fraction = (degInRashi - 10) / 8;
      } else if (degInRashi < 25) {
        targetRashiNumber = 3; // Gemini (Mercury)
        deity = 'Varuna (Waters)';
        fraction = (degInRashi - 18) / 7;
      } else {
        targetRashiNumber = 2; // Taurus (Venus)
        deity = 'Yama (Restraint)';
        fraction = (degInRashi - 25) / 5;
      }
    } else {
      if (degInRashi < 5) {
        targetRashiNumber = 2; // Taurus (Venus)
        deity = 'Varuna (Waters)';
        fraction = degInRashi / 5;
      } else if (degInRashi < 12) {
        targetRashiNumber = 6; // Virgo (Mercury)
        deity = 'Vayu (Wind)';
        fraction = (degInRashi - 5) / 7;
      } else if (degInRashi < 20) {
        targetRashiNumber = 12; // Pisces (Jupiter)
        deity = 'Indra (Sovereign)';
        fraction = (degInRashi - 12) / 8;
      } else if (degInRashi < 25) {
        targetRashiNumber = 10; // Capricorn (Saturn)
        deity = 'Agni (Fire)';
        fraction = (degInRashi - 20) / 5;
      } else {
        targetRashiNumber = 8; // Scorpio (Mars)
        deity = 'Yama (Restraint)';
        fraction = (degInRashi - 25) / 5;
      }
    }

    const rashi = RASHIS[targetRashiNumber - 1];
    const targetDegree = fraction * 30;

    return {
      rashi: rashi.name as RashiName,
      rashiNumber: rashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
