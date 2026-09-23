import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D20Definition: VargaDefinition = {
  id: 'D20',
  number: 20,
  name: 'Vimshamsha',
  sanskritName: 'विंशांश',
  purpose: 'Spiritual evolution, devotional practices (Upasana), mantra siddhi, meditation, and divine grace',
  divisionCount: 20,
  spanDegrees: 1.5, // 1° 30'
  calculationMethod: '20-fold division of 1°30\' each based on sign modality mapping',
  signMapping: 'Movable signs start from Aries (0). Fixed signs start from Sagittarius (8). Dual signs start from Leo (4).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '20 equal segments of 1°30\' each: [0°, 1.5°), [1.5°, 3.0°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 22: Presided over by 20 specific devatas. Primary chart for spiritual inclinations, Ishta Devata confirmation, and esoteric sadhana.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(19, Math.floor(degInRashi / 1.5)); // 0 to 19

    const modality = rashiIndex % 3;
    let startSignIndex = 0;
    if (modality === 0) startSignIndex = 0; // Aries
    else if (modality === 1) startSignIndex = 8; // Sagittarius
    else startSignIndex = 4; // Leo

    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 1.5) * 20;
    const targetRashi = RASHIS[targetIndex];

    const deities = [
      'Kali', 'Gauri', 'Jaya', 'Aditi', 'Shachi', 'Dhavani', 'Mata', 'Gayatri', 
      'Rudra', 'Narayani', 'Sharvani', 'Kamala', 'Pali', 'Shobhana', 'Prajna', 
      'Prabha', 'Kanti', 'Giti', 'Kriti', 'Tara'
    ];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity: deities[part % deities.length],
    };
  },
};
