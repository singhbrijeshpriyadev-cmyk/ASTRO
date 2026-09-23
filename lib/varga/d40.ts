import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D40Definition: VargaDefinition = {
  id: 'D40',
  number: 40,
  name: 'Khavedamsha',
  sanskritName: 'खवेदांश',
  purpose: 'Maternal ancestral heritage, auspicious and inauspicious familial karmas, and subtle fortunes',
  divisionCount: 40,
  spanDegrees: 0.75, // 45 arcminutes
  calculationMethod: '40-fold division of 0°45\' each based on sign polarity',
  signMapping: 'Odd signs start from Aries (0). Even signs start from Libra (6).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '40 equal segments of 45 arcminutes each: [0°, 0.75°), [0.75°, 1.5°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 30: Also named Chatvarimshamsha. Presided over by Vishnu, Chandra, Marichi, and Tvasta (repeated 10 times). Examines subtle karmic purity from the maternal ancestral stream.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(39, Math.floor(degInRashi / 0.75)); // 0 to 39

    const isOdd = (rashiIndex + 1) % 2 !== 0;
    const startSignIndex = isOdd ? 0 : 6; // Aries (0) or Libra (6)
    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 0.75) * 40;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Vishnu', 'Chandra', 'Marichi', 'Tvasta'];
    const deity = deities[part % 4];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
