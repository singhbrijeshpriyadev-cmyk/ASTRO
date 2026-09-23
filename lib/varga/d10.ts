import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D10Definition: VargaDefinition = {
  id: 'D10',
  number: 10,
  name: 'Dashamsha',
  sanskritName: 'दशांश',
  purpose: 'Career, profession, worldly power, status, leadership, public fame, and major life impact',
  divisionCount: 10,
  spanDegrees: 3,
  calculationMethod: '10-fold division of 3° each with odd/even sign offsets',
  signMapping: 'Odd signs: count begins from the sign itself. Even signs: count begins from the 9th sign from it.',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '10 equal segments of 3° each: [0°, 3°), [3°, 6°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 16: The chart of public action (Mahat Phalam). The 10 divisions are presided over by the 10 directional guardians (Digpalas): Indra, Agni, Yama, Nirriti, Varuna, Vayu, Kubera, Ishana, Brahma, and Ananta.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(9, Math.floor(degInRashi / 3)); // 0 to 9

    const isOdd = (rashiIndex + 1) % 2 !== 0;
    const startSignIndex = isOdd ? rashiIndex : (rashiIndex + 8) % 12;
    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % 3) * 10;
    const targetRashi = RASHIS[targetIndex];

    const digpalas = [
      'Indra (East/Sovereignty)', 
      'Agni (SE/Tejas)', 
      'Yama (South/Dharma)', 
      'Nirriti (SW/Subversion)', 
      'Varuna (West/Vastness)', 
      'Vayu (NW/Speed)', 
      'Kubera (North/Wealth)', 
      'Ishana (NE/Wisdom)', 
      'Brahma (Zenith/Creation)', 
      'Ananta (Nadir/Endurance)'
    ];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity: digpalas[part],
    };
  },
};
