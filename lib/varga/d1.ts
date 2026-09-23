import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D1Definition: VargaDefinition = {
  id: 'D1',
  number: 1,
  name: 'Rashi',
  sanskritName: 'राशि',
  purpose: 'Physical constitution, general life trajectory, vitality, and primary karma',
  divisionCount: 1,
  spanDegrees: 30,
  calculationMethod: 'Baseline natal 30° ecliptic sign',
  signMapping: 'Identity mapping: planet longitude maps directly to its residing sign',
  planetMapping: 'All 9 classical Grahas, Lagna, and MC',
  boundaryRules: '1 sign = 30° [0°, 30°)',
  traditionalNotes: 'BPHS Ch. 6, Sl. 2: The foundation of all predictive Jyotish. All higher Vargas are harmonics derived from D1.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degreeInRashi = norm - rashiIndex * 30;
    const rashi = RASHIS[rashiIndex];
    return {
      rashi: rashi.name as RashiName,
      rashiNumber: rashi.number,
      degreeInRashi,
    };
  },
};
