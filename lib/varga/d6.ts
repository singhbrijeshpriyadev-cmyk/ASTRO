import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D6Definition: VargaDefinition = {
  id: 'D6',
  number: 6,
  name: 'Shashtamsha',
  sanskritName: 'षष्ठांश',
  purpose: 'Acute health vulnerabilities, diseases, enemies, debts, litigation, and obstacles',
  divisionCount: 6,
  spanDegrees: 5,
  calculationMethod: '6-fold division of 5° each with sign polarity mapping',
  signMapping: 'Odd signs: count begins from Aries (Mesha). Even signs: count begins from Libra (Tula).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '6 equal segments of 5° each: [0°, 5°), [5°, 10°), [10°, 15°), [15°, 20°), [20°, 25°), [25°, 30°)',
  traditionalNotes: 'BPHS Ch. 6, Sl. 10: Odd signs mapped from Aries, Even signs mapped from Libra. Evaluates competitive stamina and constitutional weaknesses against chronic diseases.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(5, Math.floor(degInRashi / 5)); // 0 to 5

    const isOdd = (rashiIndex + 1) % 2 !== 0;
    const startSignIndex = isOdd ? 0 : 6; // Aries (0) or Libra (6)
    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 5) * 6;
    const targetRashi = RASHIS[targetIndex];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
    };
  },
};
