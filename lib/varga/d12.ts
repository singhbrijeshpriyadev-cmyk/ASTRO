import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D12Definition: VargaDefinition = {
  id: 'D12',
  number: 12,
  name: 'Dwadashamsha',
  sanskritName: 'द्वादशांश',
  purpose: 'Parents, ancestral lineage, parental well-being, genetic heritage, and pitri debts',
  divisionCount: 12,
  spanDegrees: 2.5,
  calculationMethod: '12-fold division of 2°30\' each, mapped sequentially from source sign',
  signMapping: 'Starts from the source sign itself and traverses the 12 signs in sequential order',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '12 equal segments of 2°30\' each: [0°, 2°30\'), [2°30\', 5°00\'), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 18: Presided over cyclically by Ganesha, the Ashwini Kumaras, Yama, and Sarpa (repeated 3 times). Used for paternal and maternal lineage and hereditary tendencies.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(11, Math.floor(degInRashi / 2.5));

    const targetIndex = (rashiIndex + part) % 12;
    const targetDegree = (degInRashi % 2.5) * 12;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Ganesha', 'Ashwini Kumaras', 'Yama', 'Sarpa'];
    const deity = deities[part % 4];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
