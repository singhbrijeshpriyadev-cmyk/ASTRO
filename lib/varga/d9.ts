import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D9Definition: VargaDefinition = {
  id: 'D9',
  number: 9,
  name: 'Navamsha',
  sanskritName: 'नवांश',
  purpose: 'Marriage, spouse, dharma, inherent spiritual strength, and the second half of life',
  divisionCount: 9,
  spanDegrees: 30 / 9, // 3° 20' = 3.333333°
  calculationMethod: '9-fold division of 3°20\' exactly coinciding with one Nakshatra Pada',
  signMapping: 'Movable signs: start from same sign. Fixed signs: start from 9th sign. Dual signs: start from 5th sign.',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '9 equal segments of 3°20\' [0° to 3°20\', 3°20\' to 6°40\', ...]',
  traditionalNotes: 'BPHS Ch. 6, Sl. 14: The most essential divisional chart. A planet strong in D1 but weak in D9 fails to produce fruits; a planet exalted in D9 gains divine elevation. Coincides with the 108 Padas of the 27 Nakshatras.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(8, Math.floor(degInRashi / (30 / 9))); // 0 to 8

    const signModality = rashiIndex % 3; // 0 = Movable, 1 = Fixed, 2 = Dual
    let startSignIndex = 0;

    if (signModality === 0) {
      startSignIndex = rashiIndex; // Movable: same sign
    } else if (signModality === 1) {
      startSignIndex = (rashiIndex + 8) % 12; // Fixed: 9th from it
    } else {
      startSignIndex = (rashiIndex + 4) % 12; // Dual: 5th from it
    }

    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % (30 / 9)) * 9;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Deva (Divine)', 'Nara (Human)', 'Rakshasa (Demonic)'];
    const deity = deities[part % 3];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
