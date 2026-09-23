import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D5Definition: VargaDefinition = {
  id: 'D5',
  number: 5,
  name: 'Panchamsha',
  sanskritName: 'पंचांश',
  purpose: 'Spiritual inclination, devotional intellect, mantra siddhi, creative destiny, and purva punya',
  divisionCount: 5,
  spanDegrees: 6,
  calculationMethod: '5-fold division of 6° each based on Odd/Even sign polarity',
  signMapping: 'Odd signs: count begins from Aries (Mesha). Even signs: count begins from Libra (Tula).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '5 equal segments of 6° each: [0°, 6°), [6°, 12°), [12°, 18°), [18°, 24°), [24°, 30°)',
  traditionalNotes: 'Classical Parashari convention: Odd signs commence at Aries, Even signs commence at Libra. Evaluates subtle mental brilliance and spiritual merits from past incarnations.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(4, Math.floor(degInRashi / 6)); // 0 to 4

    const isOdd = (rashiIndex + 1) % 2 !== 0;
    const startSignIndex = isOdd ? 0 : 6; // Aries (0) or Libra (6)
    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 6) * 5;
    const targetRashi = RASHIS[targetIndex];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
    };
  },
};
