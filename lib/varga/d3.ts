import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D3Definition: VargaDefinition = {
  id: 'D3',
  number: 3,
  name: 'Drekkana',
  sanskritName: 'द्रेष्काण',
  purpose: 'Siblings, vitality, energy, initiative, courage, and karmic death markers (22nd Drekkana)',
  divisionCount: 3,
  spanDegrees: 10,
  calculationMethod: 'Tri-fold division mapped to trinal signs (1st, 5th, 9th from source sign)',
  signMapping: '0°-10°: Same sign. 10°-20°: 5th sign from it. 20°-30°: 9th sign from it.',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '3 segments of 10° each: [0°, 10°), [10°, 20°), [20°, 30°)',
  traditionalNotes: 'BPHS Ch. 6, Sl. 6: The rulers of Drekkanas are Narada (1st), Agastya (2nd), and Durvasa (3rd). Used for analyzing third-house matters and Khara (22nd Drekkana).',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(2, Math.floor(degInRashi / 10)); // 0, 1, 2

    const offsets = [0, 4, 8];
    const deities = ['Narada (Sattvic)', 'Agastya (Rajasic)', 'Durvasa (Tamasic)'];

    const targetIndex = (rashiIndex + offsets[part]) % 12;
    const targetDegree = (degInRashi % 10) * 3;
    const targetRashi = RASHIS[targetIndex];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity: deities[part],
    };
  },
};
