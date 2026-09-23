import { ChartData, PlanetPosition, TraditionalGraha } from '@/types/astrology';
import { PlanetSynthesisFact, HouseSynthesisFact, PanchadhaMaitriType } from './types';
import { computeVargaChart } from '../varga/engine';
import { normalizeDegrees } from '../astrology/coordinates';

/**
 * Natural planetary rulership of signs (0=Aries ... 11=Pisces)
 */
export const SIGN_LORDS: Record<number, TraditionalGraha> = {
  0: 'Mars',
  1: 'Venus',
  2: 'Mercury',
  3: 'Moon',
  4: 'Sun',
  5: 'Mercury',
  6: 'Venus',
  7: 'Mars',
  8: 'Jupiter',
  9: 'Saturn',
  10: 'Saturn',
  11: 'Jupiter',
};

/**
 * Classical Natural Friendship Table (Naisargika Maitri)
 */
const NATURAL_RELATIONSHIPS: Partial<Record<TraditionalGraha, { friends: TraditionalGraha[]; enemies: TraditionalGraha[] }>> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] },
  Rahu: { friends: ['Venus', 'Saturn', 'Mercury'], enemies: ['Sun', 'Moon', 'Mars'] },
  Ketu: { friends: ['Mars', 'Venus', 'Saturn'], enemies: ['Sun', 'Moon'] },
};

/**
 * Classical Combustion Orbs (in degrees from Sun)
 */
const COMBUSTION_ORBS: Partial<Record<TraditionalGraha, { direct: number; retro: number }>> = {
  Sun: { direct: 0, retro: 0 },
  Moon: { direct: 12, retro: 12 },
  Mars: { direct: 17, retro: 17 },
  Mercury: { direct: 14, retro: 12 },
  Jupiter: { direct: 11, retro: 11 },
  Venus: { direct: 10, retro: 8 },
  Saturn: { direct: 15, retro: 15 },
  Rahu: { direct: 0, retro: 0 }, // Nodes do not get combust
  Ketu: { direct: 0, retro: 0 },
};

/**
 * Natural Karakas (significators) for each house
 */
const HOUSE_KARAKAS: Record<number, TraditionalGraha[]> = {
  1: ['Sun'],
  2: ['Jupiter'],
  3: ['Mars'],
  4: ['Moon', 'Venus'],
  5: ['Jupiter'],
  6: ['Mars', 'Saturn'],
  7: ['Venus'],
  8: ['Saturn'],
  9: ['Jupiter', 'Sun'],
  10: ['Sun', 'Mercury', 'Jupiter', 'Saturn'],
  11: ['Jupiter'],
  12: ['Saturn', 'Ketu'],
};

/**
 * Calculates Panchadha Maitri (5-fold compound relationship)
 */
export function calculatePanchadhaMaitri(
  grahaA: TraditionalGraha,
  grahaB: TraditionalGraha,
  signA: number,
  signB: number
): PanchadhaMaitriType {
  if (grahaA === grahaB) return 'Great Friend (Adhi Mitra)';

  // 1. Natural Relationship (-1 = enemy, 0 = neutral, +1 = friend)
  const natDef = NATURAL_RELATIONSHIPS[grahaA];
  let natScore = 0;
  if (natDef?.friends.includes(grahaB)) natScore = 1;
  else if (natDef?.enemies.includes(grahaB)) natScore = -1;

  // 2. Temporal Relationship (Tatkalika)
  // Distance from signA to signB in signs (1 to 12)
  const diffSigns = ((signB - signA + 12) % 12) + 1;
  // 2nd, 3rd, 4th, 10th, 11th, 12th are temporal friends (+1)
  // 1st, 5th, 6th, 7th, 8th, 9th are temporal enemies (-1)
  const isTemporalFriend = [2, 3, 4, 10, 11, 12].includes(diffSigns);
  const tempScore = isTemporalFriend ? 1 : -1;

  // 3. Compounded Sum: +2 = Adhi Mitra, +1 = Mitra, 0 = Sama, -1 = Shatru, -2 = Adhi Shatru
  const compound = natScore + tempScore;
  switch (compound) {
    case 2: return 'Great Friend (Adhi Mitra)';
    case 1: return 'Friend (Mitra)';
    case 0: return 'Neutral (Sama)';
    case -1: return 'Enemy (Shatru)';
    case -2: default: return 'Great Enemy (Adhi Shatru)';
  }
}

/**
 * Returns houses aspected by a planet based on classical Parashari rules
 */
export function getHousesAspectedByPlanet(
  planet: TraditionalGraha,
  occupyingHouse: number
): number[] {
  const aspected: number[] = [];
  const addHouse = (offset: number) => {
    aspected.push(((occupyingHouse - 1 + offset) % 12) + 1);
  };

  // Every planet aspects the 7th house (opposite)
  addHouse(6); // 7th house from itself (offset 6)

  // Special full aspects
  if (planet === 'Mars') {
    addHouse(3); // 4th house
    addHouse(7); // 8th house
  } else if (planet === 'Jupiter' || planet === 'Rahu' || planet === 'Ketu') {
    addHouse(4); // 5th house
    addHouse(8); // 9th house
  } else if (planet === 'Saturn') {
    addHouse(2); // 3rd house
    addHouse(9); // 10th house
  }

  return aspected;
}

/**
 * Synthesizes all planetary facts from ChartData
 */
const TO_ENGLISH_GRAHA: Record<string, TraditionalGraha> = {
  Surya: 'Sun',
  Chandra: 'Moon',
  Mangala: 'Mars',
  Budha: 'Mercury',
  Guru: 'Jupiter',
  Shukra: 'Venus',
  Shani: 'Saturn',
  Sun: 'Sun',
  Moon: 'Moon',
  Mars: 'Mars',
  Mercury: 'Mercury',
  Jupiter: 'Jupiter',
  Venus: 'Venus',
  Saturn: 'Saturn',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
};

export function synthesizePlanetaryFacts(chart: ChartData): Record<TraditionalGraha, PlanetSynthesisFact> {
  const sun = chart.planets.find(p => p.planet === 'Sun' || p.planet === 'Surya' || p.name === 'Surya' || p.name === 'Sun');
  const sunLon = sun?.siderealLongitude ?? 0;
  const ascSignIdx = chart.ascendant.signIndex;

  // Varga input for D9 and D10
  const vargaInput = {
    ascendantSiderealLon: chart.ascendant.longitude ?? chart.ascendant.siderealLongitude ?? 0,
    planets: chart.planets.map(p => ({
      name: (p.name || p.planet) as any,
      siderealLongitude: p.siderealLongitude,
      symbol: '',
      sanskrit: '',
      d1Rashi: (p.sign || p.zodiacSignEnglish || 'Aries') as any,
      nakshatra: p.nakshatra,
      pada: p.pada,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
    })),
  };
  const d9Chart = computeVargaChart('D9', vargaInput);
  const d10Chart = computeVargaChart('D10', vargaInput);

  const facts: Partial<Record<TraditionalGraha, PlanetSynthesisFact>> = {};

  for (const p of chart.planets) {
    const rawPlanet = (p.planet || p.name) as string;
    const planet = TO_ENGLISH_GRAHA[rawPlanet] || (p.planet as TraditionalGraha);
    const signIdx = p.signIndex ?? (p.rashiNumber ? p.rashiNumber - 1 : 0);
    const house = p.house;

    // Find owned houses
    const ownedHouses: number[] = [];
    if (planet !== 'Rahu' && planet !== 'Ketu') {
      for (let h = 1; h <= 12; h++) {
        const signOfH = (ascSignIdx + (h - 1)) % 12;
        if (SIGN_LORDS[signOfH] === planet) {
          ownedHouses.push(h);
        }
      }
    }

    // Sign lord and compound friendship
    const signLord = SIGN_LORDS[signIdx];
    const compoundRel = calculatePanchadhaMaitri(planet, signLord, signIdx, chart.planets.find(pl => pl.planet === signLord)?.signIndex ?? signIdx);

    // Combustion
    let isCombust = false;
    let combustionDiff = 360;
    if (planet !== 'Sun' && planet !== 'Rahu' && planet !== 'Ketu' && sun) {
      let diff = Math.abs(p.siderealLongitude - sunLon);
      if (diff > 180) diff = 360 - diff;
      combustionDiff = diff;
      const orbDef = COMBUSTION_ORBS[planet];
      const orb = orbDef ? (p.isRetrograde ? orbDef.retro : orbDef.direct) : 10;
      isCombust = diff <= orb;
    }

    // Conjunctions with other planets in the same sign
    const conjunctions: PlanetSynthesisFact['conjunctions'] = [];
    for (const other of chart.planets) {
      if (other.planet !== planet && other.signIndex === signIdx) {
        let dist = Math.abs(p.siderealLongitude - other.siderealLongitude);
        if (dist > 180) dist = 360 - dist;
        conjunctions.push({
          otherPlanet: other.planet,
          angularDistanceDeg: Math.round(dist * 100) / 100,
          isTight: dist <= 5,
          isExact: dist <= 1,
        });
      }
    }

    // Aspects received from other planets
    const aspectsReceived: PlanetSynthesisFact['aspectsReceived'] = [];
    for (const other of chart.planets) {
      if (other.planet !== planet) {
        const aspectedHouses = getHousesAspectedByPlanet(other.planet, other.house);
        if (aspectedHouses.includes(house)) {
          let dist = Math.abs(p.siderealLongitude - other.siderealLongitude);
          if (dist > 180) dist = 360 - dist;
          aspectsReceived.push({
            aspectingPlanet: other.planet,
            aspectType: 'Full Vedic Drishti',
            distanceDeg: Math.round(dist * 100) / 100,
          });
        }
      }
    }

    // Aspects cast by this planet
    const aspectsCastOnHouses = getHousesAspectedByPlanet(planet, house);

    // D9 and Vargottama
    const d9Pos = d9Chart.positions[planet];
    const d9Sign = d9Pos?.vargaRashiEnglish || d9Pos?.vargaRashi || 'Aries';
    const d9House = d9Pos?.house ?? 1;
    const isVargottama = !!d9Pos?.isVargottama;

    // D10
    const d10Pos = d10Chart.positions[planet];
    const d10Sign = d10Pos?.vargaRashiEnglish || d10Pos?.vargaRashi || 'Aries';
    const d10House = d10Pos?.house ?? 1;

    // Dignities
    const isExalted = Boolean(p.dignity === 'Exalted' || p.dignity?.includes('Uccha'));
    const isDebilitated = Boolean(p.dignity === 'Debilitated' || p.dignity?.includes('Neecha'));
    const isOwnSign = Boolean(p.dignity === 'Own Sign' || p.dignity?.includes('Swakshetra'));
    const isMoolatrikona = Boolean(p.dignity?.includes('Moolatrikona'));

    const factObj: PlanetSynthesisFact = {
      planet,
      sign: p.sign || p.zodiacSignEnglish || p.zodiacSign || 'Aries',
      signIndex: signIdx ?? (p.rashiNumber ? p.rashiNumber - 1 : 0),
      degree: p.degree,
      minute: p.minute ?? p.minutes ?? 0,
      degreeFormatted: `${p.degree}° ${p.minute ?? p.minutes ?? 0}'`,
      house,
      ownedHouses,
      nakshatra: p.nakshatra || '',
      nakshatraLord: p.nakshatraLord || '',
      pada: p.pada || 1,
      dignity: p.dignity || 'Neutral',
      isMoolatrikona,
      isExalted,
      isDebilitated,
      isOwnSign,
      compoundRelationshipToSignLord: compoundRel,
      isRetrograde: !!p.isRetrograde,
      isCombust,
      combustionDegreesFromSun: combustionDiff <= 30 ? Math.round(combustionDiff * 100) / 100 : undefined,
      isVargottama,
      d9Sign,
      d9House,
      d10Sign,
      d10House,
      conjunctions,
      aspectsReceived,
      aspectsCastOnHouses,
    };

    facts[planet] = factObj;
    if (p.name) facts[p.name as TraditionalGraha] = factObj;
    if (rawPlanet) facts[rawPlanet as TraditionalGraha] = factObj;
  }

  return facts as Record<TraditionalGraha, PlanetSynthesisFact>;
}

/**
 * Synthesizes all house facts from ChartData
 */
export function synthesizeHouseFacts(
  chart: ChartData,
  planetFacts: Record<TraditionalGraha, PlanetSynthesisFact>
): Record<number, HouseSynthesisFact> {
  const houseFacts: Partial<Record<number, HouseSynthesisFact>> = {};
  const ascSignIdx = chart.ascendant.signIndex;

  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSignIdx + (h - 1)) % 12;
    const signName = chart.houses[h - 1]?.sign || 'Aries';
    const cuspLon = chart.houses[h - 1]?.cuspLongitude ?? 0;
    const lord = SIGN_LORDS[signIdx];
    const lordFact = planetFacts[lord];

    const occupyingPlanets = chart.planets.filter(p => p.house === h).map(p => p.planet);
    const aspectingPlanets: TraditionalGraha[] = [];
    for (const p of chart.planets) {
      const cast = getHousesAspectedByPlanet(p.planet, p.house);
      if (cast.includes(h) && p.house !== h) {
        aspectingPlanets.push(p.planet);
      }
    }

    const isKendra = [1, 4, 7, 10].includes(h);
    const isTrikona = [1, 5, 9].includes(h);
    const isDusthana = [6, 8, 12].includes(h);
    const isUpachaya = [3, 6, 10, 11].includes(h);
    const isMaraka = [2, 7].includes(h);

    // Compute empirical strength score (100 baseline)
    let strengthScore = 100;
    if (lordFact?.isExalted) strengthScore += 30;
    if (lordFact?.isOwnSign) strengthScore += 20;
    if (lordFact?.isDebilitated) strengthScore -= 30;
    if (lordFact?.isCombust) strengthScore -= 15;
    if (lordFact?.isVargottama) strengthScore += 20;
    if ([1, 4, 5, 7, 9, 10, 11].includes(lordFact?.house ?? 1)) strengthScore += 15;
    else if ([6, 8, 12].includes(lordFact?.house ?? 1)) strengthScore -= 15;

    // Occupant influence
    for (const occ of occupyingPlanets) {
      const occFact = planetFacts[occ];
      if (['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(occ)) strengthScore += 10;
      else strengthScore -= 5;
      if (occFact?.isExalted) strengthScore += 15;
      if (occFact?.isDebilitated) strengthScore -= 15;
    }

    houseFacts[h] = {
      houseNumber: h,
      sign: signName,
      signIndex: signIdx,
      cuspLongitude: cuspLon,
      lord,
      lordPlacementHouse: lordFact?.house ?? 1,
      lordPlacementSign: lordFact?.sign ?? signName,
      occupyingPlanets,
      aspectingPlanets,
      naturalKarakas: HOUSE_KARAKAS[h] || [],
      strengthScore: Math.max(30, Math.min(180, strengthScore)),
      isKendra,
      isTrikona,
      isDusthana,
      isUpachaya,
      isMaraka,
    };
  }

  return houseFacts as Record<number, HouseSynthesisFact>;
}
