import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D24Definition: VargaDefinition = {
  id: 'D24',
  number: 24,
  name: 'Chaturvimshamsha',
  sanskritName: 'चतुर्विंशांश',
  purpose: 'Higher education, learning, scholarship, memory, academic achievements, and intellectual synthesis',
  divisionCount: 24,
  spanDegrees: 1.25, // 1° 15'
  calculationMethod: '24-fold division of 1°15\' each based on solar/lunar sign polarity',
  signMapping: 'Odd signs: count begins from Leo (Simha, index 4). Even signs: count begins from Cancer (Karka, index 3).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '24 equal segments of 1°15\' each: [0°, 1.25°), [1.25°, 2.50°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 24: Also called Siddhamsha. Presided over by Skanda, Parashudhara, Anala, and Vishvakarma (repeated 6 times). Evaluates capacity for higher philosophical and empirical sciences.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(23, Math.floor(degInRashi / 1.25)); // 0 to 23

    const isOdd = (rashiIndex + 1) % 2 !== 0;
    const startSignIndex = isOdd ? 4 : 3; // Leo (4) or Cancer (3)
    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 1.25) * 24;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Skanda (Focus)', 'Parashudhara (Discrimination)', 'Anala (Purifying Fire)', 'Vishvakarma (Universal Architect)'];
    const deity = deities[part % 4];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
