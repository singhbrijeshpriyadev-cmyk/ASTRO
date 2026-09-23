import { RashiName, GrahaName, VargaChart } from '@/types/astrology';
import { ALL_VARGAS, VARGA_ORDER } from './registry';
import { VargaDefinition as FullVargaDef } from './types';

export interface VargaDefinition {
  id: string;
  name: string;
  sanskritName: string;
  factor: number;
  description: string;
  calculator: (siderealLon: number) => { rashi: RashiName; rashiNumber: number; degreeInRashi: number };
}

export const VARGA_DEFINITIONS: Record<string, VargaDefinition> = {};

// Populate all 18 classical Vargas from central registry
Object.values(ALL_VARGAS).forEach(v => {
  VARGA_DEFINITIONS[v.id] = {
    id: v.id,
    name: v.name,
    sanskritName: v.sanskritName,
    factor: v.number,
    description: v.purpose,
    calculator: v.calculate,
  };
});

export function buildVargaChart(
  vargaDef: VargaDefinition,
  ascendantSiderealLon: number,
  planets: { name: GrahaName; siderealLongitude: number }[]
): VargaChart {
  const ascCalc = vargaDef.calculator(ascendantSiderealLon);
  const positions: Record<GrahaName, { rashi: RashiName; rashiNumber: number; degreeInRashi: number; house: number }> = {} as any;

  planets.forEach(p => {
    const calc = vargaDef.calculator(p.siderealLongitude);
    const house = ((calc.rashiNumber - ascCalc.rashiNumber + 12) % 12) + 1;
    positions[p.name] = {
      rashi: calc.rashi,
      rashiNumber: calc.rashiNumber,
      degreeInRashi: calc.degreeInRashi,
      house,
    };
  });

  return {
    id: vargaDef.id,
    name: vargaDef.name,
    sanskritName: vargaDef.sanskritName,
    factor: vargaDef.factor,
    description: vargaDef.description,
    ascendant: ascCalc,
    positions,
  };
}
