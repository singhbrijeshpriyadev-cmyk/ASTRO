import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D2Definition: VargaDefinition = {
  id: 'D2',
  number: 2,
  name: 'Hora',
  sanskritName: 'होरा',
  purpose: 'Wealth, accumulated assets, financial sustenance, and solar/lunar vitality',
  divisionCount: 2,
  spanDegrees: 15,
  calculationMethod: '15° halves ruled exclusively by Sun (Leo) and Moon (Cancer)',
  signMapping: 'Odd signs: 0-15° Leo (Sun), 15-30° Cancer (Moon). Even signs: 0-15° Cancer (Moon), 15-30° Leo (Sun).',
  planetMapping: 'All Grahas and Lagna condense into either Cancer or Leo',
  boundaryRules: 'Half-sign division: [0°, 15°) and [15°, 30°)',
  traditionalNotes: 'BPHS Ch. 6, Sl. 4: In odd signs the first half belongs to the Sun and second to the Moon; reversed in even signs. Evaluates wealth generation (Sun/effort) vs preservation (Moon/grace).',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const isOddSign = (rashiIndex + 1) % 2 !== 0; // 1-indexed odd
    const isFirstHalf = degInRashi < 15;

    let targetRashiNumber = 5; // Leo (Sun)
    let deity = 'Deva (Surya)';

    if (isOddSign) {
      targetRashiNumber = isFirstHalf ? 5 : 4; // 1st half: Leo (5), 2nd half: Cancer (4)
      deity = isFirstHalf ? 'Deva (Solar/Will)' : 'Pitri (Lunar/Nurture)';
    } else {
      targetRashiNumber = isFirstHalf ? 4 : 5; // 1st half: Cancer (4), 2nd half: Leo (5)
      deity = isFirstHalf ? 'Pitri (Lunar/Nurture)' : 'Deva (Solar/Will)';
    }

    const rashi = RASHIS[targetRashiNumber - 1];
    const degreeInHora = (degInRashi % 15) * 2;

    return {
      rashi: rashi.name as RashiName,
      rashiNumber: rashi.number,
      degreeInRashi: degreeInHora,
      deity,
    };
  },
};
