import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D27Definition: VargaDefinition = {
  id: 'D27',
  number: 27,
  name: 'Saptavimshamsha',
  sanskritName: 'सप्तविंशांश',
  purpose: 'Inherent stamina, latent physical and psychological strengths, vulnerabilities, and general vitality',
  divisionCount: 27,
  spanDegrees: 30 / 27, // 1° 06' 40"
  calculationMethod: '27-fold division of 1°06\'40" each mapped according to the 4 element triplicities',
  signMapping: 'Fire signs start from Aries (0). Earth signs start from Cancer (3). Air signs start from Libra (6). Water signs start from Capricorn (9).',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '27 equal segments of 30/27 degrees each',
  traditionalNotes: 'BPHS Ch. 6, Sl. 26: Also known as Bhamsa or Nakshatramsha. Illuminates the subconscious resilience and psycho-spiritual endurance of the individual against severe karmic afflictions.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(26, Math.floor(degInRashi / (30 / 27))); // 0 to 26

    // Element triplicity: Fire (0, 4, 8), Earth (1, 5, 9), Air (2, 6, 10), Water (3, 7, 11)
    const element = rashiIndex % 4;
    let startSignIndex = 0;
    if (element === 0) startSignIndex = 0; // Fire -> Aries
    else if (element === 1) startSignIndex = 3; // Earth -> Cancer
    else if (element === 2) startSignIndex = 6; // Air -> Libra
    else startSignIndex = 9; // Water -> Capricorn

    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % (30 / 27)) * 27;
    const targetRashi = RASHIS[targetIndex];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
    };
  },
};
