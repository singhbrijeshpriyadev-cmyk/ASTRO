import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D4Definition: VargaDefinition = {
  id: 'D4',
  number: 4,
  name: 'Chaturthamsha',
  sanskritName: 'चतुर्थांश',
  purpose: 'Real estate, immovable property, fixed assets, home life, and fortune (Bhagya in residence)',
  divisionCount: 4,
  spanDegrees: 7.5,
  calculationMethod: '4-fold division mapped to Kendra signs (1st, 4th, 7th, 10th from source sign)',
  signMapping: 'Part 1: Same sign. Part 2: 4th from it. Part 3: 7th from it. Part 4: 10th from it.',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '4 equal segments of 7°30\' each',
  traditionalNotes: 'BPHS Ch. 6, Sl. 8: Ruled by the 4 Kumaras: Sanaka, Sanandana, Sanatkumara, and Sanatana. Illuminates internal happiness and ancestral lands.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(3, Math.floor(degInRashi / 7.5)); // 0, 1, 2, 3

    const deities = ['Sanaka', 'Sanandana', 'Sanatkumara', 'Sanatana'];
    const targetIndex = (rashiIndex + part * 3) % 12;
    const targetDegree = (degInRashi % 7.5) * 4;
    const targetRashi = RASHIS[targetIndex];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity: deities[part],
    };
  },
};
