import { VargaDefinition } from './types';
import { RASHIS } from '../astrology/constants';
import { normalizeDegrees } from '../astrology/coordinates';
import { RashiName } from '@/types/astrology';

export interface ShashtiamshaDeity {
  number: number;
  name: string;
  isBenefic: boolean;
}

export const SHASHTIAMSHA_DEITIES: ShashtiamshaDeity[] = [
  { number: 1, name: 'Ghora', isBenefic: false },
  { number: 2, name: 'Rakshasa', isBenefic: false },
  { number: 3, name: 'Deva', isBenefic: true },
  { number: 4, name: 'Kubera', isBenefic: true },
  { number: 5, name: 'Yaksha', isBenefic: true },
  { number: 6, name: 'Kinnara', isBenefic: true },
  { number: 7, name: 'Bhrashta', isBenefic: false },
  { number: 8, name: 'Kulaghna', isBenefic: false },
  { number: 9, name: 'Garala', isBenefic: false },
  { number: 10, name: 'Vahni', isBenefic: false },
  { number: 11, name: 'Maya', isBenefic: false },
  { number: 12, name: 'Purishaka', isBenefic: false },
  { number: 13, name: 'Apampati', isBenefic: true },
  { number: 14, name: 'Marutvan', isBenefic: true },
  { number: 15, name: 'Kala', isBenefic: false },
  { number: 16, name: 'Sarpa', isBenefic: false },
  { number: 17, name: 'Amrita', isBenefic: true },
  { number: 18, name: 'Indu', isBenefic: true },
  { number: 19, name: 'Mridu', isBenefic: true },
  { number: 20, name: 'Komala', isBenefic: true },
  { number: 21, name: 'Heramba', isBenefic: true },
  { number: 22, name: 'Brahma', isBenefic: true },
  { number: 23, name: 'Vishnu', isBenefic: true },
  { number: 24, name: 'Maheshwara', isBenefic: true },
  { number: 25, name: 'Deva', isBenefic: true },
  { number: 26, name: 'Ardra', isBenefic: true },
  { number: 27, name: 'Kalinasa', isBenefic: true },
  { number: 28, name: 'Kshiteesha', isBenefic: true },
  { number: 29, name: 'Kamalakara', isBenefic: true },
  { number: 30, name: 'Gulika', isBenefic: false },
  { number: 31, name: 'Mrityu', isBenefic: false },
  { number: 32, name: 'Kala', isBenefic: false },
  { number: 33, name: 'Davagni', isBenefic: false },
  { number: 34, name: 'Ghora', isBenefic: false },
  { number: 35, name: 'Yama', isBenefic: false },
  { number: 36, name: 'Kantaka', isBenefic: false },
  { number: 37, name: 'Sudha', isBenefic: true },
  { number: 38, name: 'Amrita', isBenefic: true },
  { number: 39, name: 'Purnachandra', isBenefic: true },
  { number: 40, name: 'Vishadagdha', isBenefic: false },
  { number: 41, name: 'Kulanasa', isBenefic: false },
  { number: 42, name: 'Vamshakshaya', isBenefic: false },
  { number: 43, name: 'Utpata', isBenefic: false },
  { number: 44, name: 'Kala', isBenefic: false },
  { number: 45, name: 'Saumya', isBenefic: true },
  { number: 46, name: 'Komala', isBenefic: true },
  { number: 47, name: 'Shitala', isBenefic: true },
  { number: 48, name: 'Karaladamshtra', isBenefic: false },
  { number: 49, name: 'Chandramukhi', isBenefic: true },
  { number: 50, name: 'Pravina', isBenefic: true },
  { number: 51, name: 'Kalapavaka', isBenefic: false },
  { number: 52, name: 'Dandayudha', isBenefic: false },
  { number: 53, name: 'Nirmala', isBenefic: true },
  { number: 54, name: 'Saumya', isBenefic: true },
  { number: 55, name: 'Krura', isBenefic: false },
  { number: 56, name: 'Atishitala', isBenefic: true },
  { number: 57, name: 'Amrita', isBenefic: true },
  { number: 58, name: 'Payodhisa', isBenefic: true },
  { number: 59, name: 'Bhramana', isBenefic: false },
  { number: 60, name: 'Chandrarekha', isBenefic: true },
];

export const D60Definition: VargaDefinition = {
  id: 'D60',
  number: 60,
  name: 'Shashtiamsha',
  sanskritName: 'षष्ट्यंश',
  purpose: 'Total karmic summation, subtle past-life debts, microscopic destiny seeds, and absolute confirmation',
  divisionCount: 60,
  spanDegrees: 0.5, // 30 arcminutes
  calculationMethod: '60-fold division of 0°30\' each, mapped cyclically from source sign with 60 specific deities',
  signMapping: 'Starts from the source sign itself and traverses the 12 signs cyclically: target = (rashiIndex + part) % 12',
  planetMapping: 'All Grahas and Lagna',
  boundaryRules: '60 equal segments of 30 arcminutes each: [0°, 0.5°), [0.5°, 1.0°), ...',
  traditionalNotes: 'BPHS Ch. 6, Sl. 34-41: The supreme crowning divisional chart in the Shodashavarga scheme. Holds 4 full units of strength (Rupas) in Vimshopaka Bala—more weight than D1 or D9! Presided over by 60 distinct deities whose auspiciousness/maleficence seals the ultimate fate of each planet.',
  calculate: (siderealLon: number) => {
    const norm = normalizeDegrees(siderealLon);
    const rashiIndex = Math.floor(norm / 30);
    const degInRashi = norm - rashiIndex * 30;
    const part = Math.min(59, Math.floor(degInRashi / 0.5)); // 0 to 59

    const targetIndex = (rashiIndex + part) % 12;
    const targetDegree = (degInRashi % 0.5) * 60;
    const targetRashi = RASHIS[targetIndex];

    const deityObj = SHASHTIAMSHA_DEITIES[part];
    const deityStr = `${deityObj.name} (${deityObj.isBenefic ? 'Shubha/Benefic' : 'Ashubha/Malefic'})`;

    return {
      rashi: targetRashi.name as RashiName,
      rashiNumber: targetRashi.number,
      degreeInRashi: targetDegree,
      deity: deityStr,
    };
  },
};
