import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export const D7Definition: VargaDefinition = {
  id: 'D7',
  number: 7,
  name: 'Saptamsha',
  sanskritName: 'सप्तांश',
  purpose: 'Children, progeny, lineage continuation, creative output, and grandchildren',
  divisionCount: 7,
  spanDegrees: 30 / 7,
  calculationMethod: '7-fold division of 4°17\'08.57" each with odd/even sign offsets',
  signMapping: 'Odd signs: count begins from the sign itself. Even signs: count begins from the 7th sign from it.',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '7 equal segments of 30/7 degrees each',
  traditionalNotes: 'BPHS Ch. 6, Sl. 12: In odd signs the counts start from the sign itself; in even signs from the 7th. Ruled by the 7 sacred oceans (Kshara, Kshira, Dadhi, Ghrita, Ikshu, Madhu, Shuddhadaka). Critical for progeny analysis.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(6, Math.floor(degInRashi / (30 / 7)));

    const isOdd = (rashiIndex + 1) % 2 !== 0;
    const startSignIndex = isOdd ? rashiIndex : (rashiIndex + 6) % 12;
    const targetIndex = (startSignIndex + part) % 12;
    const targetDegree = (degInRashi % (30 / 7)) * 7;
    const targetRashi = RASHIS[targetIndex];

    const deities = ['Kshara (Salt)', 'Kshira (Milk)', 'Dadhi (Curd)', 'Ghrita (Ghee)', 'Ikshu (Sugarcane)', 'Madhu (Honey)', 'Shuddhadaka (Pure Water)'];

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity: deities[part],
    };
  },
};
