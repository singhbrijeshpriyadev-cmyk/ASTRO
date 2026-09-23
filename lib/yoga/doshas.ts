import { PlanetaryPosition, YogaResult, GrahaName } from '@/types/astrology';

export function detectClassicalDoshas(
  planets: PlanetaryPosition[],
  lagnaRashiNumber: number
): YogaResult[] {
  const doshas: YogaResult[] = [];
  const planetMap = new Map<GrahaName, PlanetaryPosition>();
  planets.forEach(p => planetMap.set(p.name, p));

  const moon = planetMap.get('Chandra');
  const mars = planetMap.get('Mangala');
  const rahu = planetMap.get('Rahu');
  const ketu = planetMap.get('Ketu');

  // 1. Manglik / Kuja Dosha: Mars in 1st, 2nd, 4th, 7th, 8th, or 12th from Lagna or Moon
  if (mars) {
    const manglikHousesLagna = [1, 2, 4, 7, 8, 12];
    const isLagnaManglik = manglikHousesLagna.includes(mars.house);

    let isMoonManglik = false;
    let houseFromMoon = 1;
    if (moon) {
      houseFromMoon = ((mars.rashiNumber - moon.rashiNumber + 12) % 12) + 1;
      isMoonManglik = manglikHousesLagna.includes(houseFromMoon);
    }

    if (isLagnaManglik || isMoonManglik) {
      doshas.push({
        name: 'Kuja (Manglik) Dosha',
        sanskritName: 'कुज दोष',
        category: 'Dosha',
        beneficence: 'challenging',
        planetsInvolved: ['Mangala'],
        housesInvolved: [mars.house],
        description: `Mars occupies house ${mars.house} from Lagna${isMoonManglik ? ` and house ${houseFromMoon} from Moon` : ''}.`,
        effects: 'Requires conscious calibration in partnerships, channelization of emotional intensity, and mutual respect.',
      });
    }
  }

  // 2. Kemadruma Dosha: No planets in 2nd and 12th from Moon (excluding Sun, Rahu, Ketu)
  if (moon) {
    const moonRashi = moon.rashiNumber;
    const secondRashi = (moonRashi % 12) + 1;
    const twelfthRashi = ((moonRashi - 2 + 12) % 12) + 1;

    const excludedGrahas: GrahaName[] = ['Surya', 'Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto', 'Chandra'];
    const planetsInFlanks = planets.filter(
      p => !excludedGrahas.includes(p.name) && (p.rashiNumber === secondRashi || p.rashiNumber === twelfthRashi)
    );

    if (planetsInFlanks.length === 0) {
      doshas.push({
        name: 'Kemadruma Dosha',
        sanskritName: 'केमद्रुम दोष',
        category: 'Dosha',
        beneficence: 'challenging',
        planetsInvolved: ['Chandra'],
        housesInvolved: [moon.house],
        description: 'No physical planets flank the Moon in the 2nd and 12th houses.',
        effects: 'Indicates periods of solitary contemplation, emotional self-reliance, and need for internal grounding.',
      });
    }
  }

  // 3. Kala Sarpa Yoga / Dosha: All physical planets hemmed between Rahu and Ketu
  if (rahu && ketu) {
    const physicalPlanets: GrahaName[] = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
    const rLon = rahu.siderealLongitude;
    const kLon = ketu.siderealLongitude;

    // Check if all are on one side of Rahu-Ketu axis
    let allOnOneSide = true;
    let allOnOtherSide = true;

    for (const name of physicalPlanets) {
      const p = planetMap.get(name);
      if (!p) continue;
      const lon = p.siderealLongitude;
      // Distance from Rahu going counterclockwise
      const distFromRahu = (lon - rLon + 360) % 360;
      if (distFromRahu > 180) allOnOneSide = false;
      if (distFromRahu < 180) allOnOtherSide = false;
    }

    if (allOnOneSide || allOnOtherSide) {
      doshas.push({
        name: 'Kala Sarpa Pattern',
        sanskritName: 'कालसर्प योग',
        category: 'Dosha',
        beneficence: 'challenging',
        planetsInvolved: ['Rahu', 'Ketu'],
        housesInvolved: [rahu.house, ketu.house],
        description: 'All 7 classical planets are hemmed within the Rahu-Ketu nodal axis.',
        effects: 'Marked by non-linear life development, intense early hurdles yielding major philosophical depth and late elevation.',
      });
    }
  }

  return doshas;
}
