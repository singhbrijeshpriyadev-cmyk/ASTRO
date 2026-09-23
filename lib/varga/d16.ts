import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D16Definition: VargaDefinition = {
  id: 'D16',
  number: 16,
  name: 'Shodashamsha',
  sanskritName: 'षोडशांश',
  purpose: 'Conveyances, vehicles (Vahana), physical luxuries, general happiness, and accidental vulnerabilities',
  divisionCount: 16,
  spanDegrees: 1.875, // 1° 52' 30"
  calculationMethod: '16-fold division of 1°52\'30" each based on sign modality triplicity',
  signMapping: 'Movable signs start from Aries (0). Fixed signs start from Leo (4). Dual signs start from Sagittarius (8).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '16 equal segments of 1.875° each: [0°, 1.875°), [1.875°, 3.75°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 20: Also termed Kalamsa. Presided over by Brahma, Vishnu, Shiva, and Surya (repeated 4 times). Key chart for evaluating vehicular safety and domestic comfort.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(15, Math.floor(degInRashi / 1.875)); // 0 to 15

    const modality = rashiIndex % 3; // 0 = Movable, 1 = Fixed, 2 = Dual
    let startSignIndex = 0;
    if (modality === 0) startSignIndex = 0; // Aries
    else if (modality === 1) startSignIndex = 4; // Leo
    else startSignIndex = 8; // Sagittarius

    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 1.875) * 16;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Brahma (Creator)', 'Vishnu (Preserver)', 'Shiva (Dissolver)', 'Surya (Illuminator)'];
    const deity = deities[part % 4];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity,
    };
  },
};
