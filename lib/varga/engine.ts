import { VargaChartResult, VargaPlacement } from './types';
import { ALL_VARGAS, getVargaDefinition } from './registry';
import { GrahaName, TraditionalGraha, RashiName, WesternZodiac } from '@/types/astrology';
import { RASHIS, GRAHA_METADATA } from '../astrology/constants';
import { calculateDignity, formatDMS, normalizeDegrees } from '../astrology/coordinates';

export interface VargaEngineInput {
  ascendantSiderealLon: number;
  planets: Array<{
    name: GrahaName;
    siderealLongitude: number;
    symbol: string;
    sanskrit: string;
    d1Rashi: RashiName;
    nakshatra?: string;
    pada?: number;
    isRetrograde?: boolean;
    isCombust?: boolean;
  }>;
}

export function computeVargaChart(
  vargaId: string,
  input: VargaEngineInput
): VargaChartResult {
  const def = getVargaDefinition(vargaId);

  // 1. Calculate Ascendant in this Varga
  const ascCalc = def.calculate(input.ascendantSiderealLon);
  const ascDms = formatDMS(ascCalc.degreeInRashi);

  const ascendant = {
    rashi: ascCalc.rashi,
    rashiNumber: ascCalc.rashiNumber,
    degreeInRashi: ascCalc.degreeInRashi,
    dms: ascDms,
    deity: ascCalc.deity,
  };

  // 2. Calculate Planets in this Varga
  const positions: Record<GrahaName, VargaPlacement> = {} as any;
  const vargottamaPlanets: string[] = [];
  const exaltedPlanets: string[] = [];
  const debilitatedPlanets: string[] = [];
  const kendraPlanets: string[] = [];

  input.planets.forEach(p => {
    const calc = def.calculate(p.siderealLongitude);
    const house = ((calc.rashiNumber - ascCalc.rashiNumber + 12) % 12) + 1;
    const rashiInfo = RASHIS[calc.rashiNumber - 1];
    const dignity = calculateDignity(p.name as TraditionalGraha, calc.rashi, calc.degreeInRashi);
    const isVargottama = calc.rashi === p.d1Rashi;

    if (isVargottama) {
      vargottamaPlanets.push(p.name);
    }
    if (dignity === 'Exalted') {
      exaltedPlanets.push(p.name);
    }
    if (dignity === 'Debilitated') {
      debilitatedPlanets.push(p.name);
    }
    if ([1, 4, 7, 10].includes(house)) {
      kendraPlanets.push(p.name);
    }

    const norm = normalizeDegrees(p.siderealLongitude);
    const sourceDegInRashi = norm % 30;
    const sourceRashi = RASHIS[Math.floor(norm / 30)].name as RashiName;

    positions[p.name] = {
      planet: p.name,
      sanskrit: p.sanskrit,
      symbol: p.symbol,
      sourceDegreeInRashi: sourceDegInRashi,
      sourceRashi,
      vargaRashi: calc.rashi,
      vargaRashiEnglish: rashiInfo.english as WesternZodiac,
      vargaRashiNumber: calc.rashiNumber,
      vargaDegree: calc.degreeInRashi,
      dms: formatDMS(calc.degreeInRashi),
      house,
      dignity,
      isVargottama,
      nakshatra: p.nakshatra,
      pada: p.pada,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      deity: calc.deity,
    };
  });

  // 3. Generate Key Observations
  const keyObservations: string[] = [];
  if (vargottamaPlanets.length > 0) {
    keyObservations.push(
      `Vargottama Alignment: ${vargottamaPlanets.join(', ')} occupy the identical sign (${positions[vargottamaPlanets[0] as GrahaName].vargaRashi}) in both D1 and ${def.id}, endowing immense structural stability.`
    );
  }
  if (exaltedPlanets.length > 0) {
    keyObservations.push(
      `Exaltation in ${def.id}: ${exaltedPlanets.join(', ')} attain peak dignity (उच्‍च) in this harmonic realm, signifying exceptional refinement in ${def.purpose.toLowerCase()}.`
    );
  }
  if (debilitatedPlanets.length > 0) {
    keyObservations.push(
      `Debilitation in ${def.id}: ${debilitatedPlanets.join(', ')} occupy debilitated signs (नीच), indicating themes requiring conscious spiritual discipline and patient maturation.`
    );
  }
  if (kendraPlanets.length > 0) {
    keyObservations.push(
      `Kendra Pillars: ${kendraPlanets.join(', ')} occupy angular houses (1st, 4th, 7th, or 10th) in ${def.id}, directly driving forward the tangible events of this divisional plane.`
    );
  }
  if (keyObservations.length === 0) {
    keyObservations.push(
      `Balanced distribution across houses; planetary strengths operate in a steady, moderate harmonic pattern.`
    );
  }

  // 4. Classical Interpretation
  const interpretation = `Under Sage Parashara's classical system, the ${def.name} (${def.sanskritName}, ${def.id}) divides each sign into ${def.divisionCount} segments of ${def.spanDegrees.toFixed(2)}°. Its primary cosmic function is to evaluate ${def.purpose.toLowerCase()}. The Ascendant rising in ${ascendant.rashi} establishes the foundation for this divisional realm${ascendant.deity ? `, presided over by ${ascendant.deity}` : ''}.`;

  return {
    definition: def,
    ascendant,
    positions,
    keyObservations,
    interpretation,
  };
}
