import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D45Definition: VargaDefinition = {
  id: 'D45',
  number: 45,
  name: 'Akshavedamsha',
  sanskritName: 'अक्षवेदांश',
  purpose: 'General character purity, ethical conscience, holistic auspiciousness, and spiritual integrity',
  divisionCount: 45,
  spanDegrees: 30 / 45, // 0° 40' = 0.666667°
  calculationMethod: '45-fold division of 0°40\' each based on sign modality triplicity',
  signMapping: 'Movable signs start from Aries (0). Fixed signs start from Leo (4). Dual signs start from Sagittarius (8).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '45 equal segments of 40 arcminutes each: [0°, 0.6667°), [0.6667°, 1.3333°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 32: Presided over by the Holy Trinity: Brahma, Shiva, and Vishnu (repeated 15 times). Evaluates whether external accomplishments are supported by genuine ethical and spiritual nobility.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const span = 30 / 45;
    const part = Math.min(44, Math.floor(degInRashi / span)); // 0 to 44

    const modality = rashiIndex % 3;
    let startSignIndex = 0;
    if (modality === 0) startSignIndex = 0; // Aries
    else if (modality === 1) startSignIndex = 4; // Leo
    else startSignIndex = 8; // Sagittarius

    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % span) * 45;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Brahma', 'Shiva', 'Vishnu'];
    const deity = deities[part % 3];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
