import { ChartData, PlanetPosition, TraditionalGraha } from '@/types/astrology';
import { ActiveDashaState } from './precision-vimshottari';
import { computeVargaChart } from '../varga/engine';

export interface DashaLordConnection {
  planet: TraditionalGraha;
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha';
  d1: {
    sign: string;
    signIndex: number;
    degreeFormatted: string;
    house: number;
    houseLordOf: number[];
    isRetrograde: boolean;
    isCombust: boolean;
    dignity: string;
  };
  d9: {
    sign: string;
    signIndex: number;
    house: number;
    isVargottama: boolean;
    dignity: string;
  };
  d10: {
    sign: string;
    signIndex: number;
    house: number;
    dignity: string;
    careerSignificance: string;
  };
  functionalRole: {
    isYogakaraka: boolean;
    isTrikonaLord: boolean;
    isKendraLord: boolean;
    isDusthanaLord: boolean;
    isMarakaLord: boolean;
    summary: string;
  };
  synthesisNotes: string;
}

export interface ConnectedDashaReport {
  targetDate: string;
  activeState: ActiveDashaState;
  mdLordConnection: DashaLordConnection;
  adLordConnection: DashaLordConnection;
  pdLordConnection: DashaLordConnection;
  periodTheme: string;
  astrologicalFocus: string[];
}

/**
 * Natural planetary ownership of zodiac signs (0-indexed: 0=Aries, 1=Taurus, ..., 11=Pisces)
 */
const SIGN_LORDS: Record<number, TraditionalGraha> = {
  0: 'Mars',     // Aries
  1: 'Venus',    // Taurus
  2: 'Mercury',  // Gemini
  3: 'Moon',     // Cancer
  4: 'Sun',      // Leo
  5: 'Mercury',  // Virgo
  6: 'Venus',    // Libra
  7: 'Mars',     // Scorpio
  8: 'Jupiter',  // Sagittarius
  9: 'Saturn',   // Capricorn
  10: 'Saturn',  // Aquarius
  11: 'Jupiter', // Pisces
};

/**
 * Exaltation signs (0-indexed)
 */
const EXALTATION_SIGNS: Partial<Record<TraditionalGraha, number>> = {
  Sun: 0,     // Aries
  Moon: 1,    // Taurus
  Mars: 9,    // Capricorn
  Mercury: 5, // Virgo
  Jupiter: 3, // Cancer
  Venus: 11,  // Pisces
  Saturn: 6,  // Libra
  Rahu: 1,    // Taurus (classical)
  Ketu: 7,    // Scorpio (classical)
};

/**
 * Debilitation signs (0-indexed)
 */
const DEBILITATION_SIGNS: Partial<Record<TraditionalGraha, number>> = {
  Sun: 6,     // Libra
  Moon: 7,    // Scorpio
  Mars: 3,    // Cancer
  Mercury: 11,// Pisces
  Jupiter: 9, // Capricorn
  Venus: 5,   // Virgo
  Saturn: 0,  // Aries
  Rahu: 7,    // Scorpio
  Ketu: 1,    // Taurus
};

function getDignity(planet: TraditionalGraha, signIndex: number): string {
  if (EXALTATION_SIGNS[planet] === signIndex) return 'Exalted (Uccha)';
  if (DEBILITATION_SIGNS[planet] === signIndex) return 'Debilitated (Neecha)';
  if (SIGN_LORDS[signIndex] === planet) return 'Own Sign (Swakshetra)';
  return 'Neutral / Friendly';
}

function findOwnedHouses(planet: TraditionalGraha, ascendantSignIndex: number): number[] {
  const owned: number[] = [];
  if (planet === 'Rahu' || planet === 'Ketu') return []; // Nodes co-rule or do not possess natural sign lordship

  for (let house = 1; house <= 12; house++) {
    const signOfHouse = (ascendantSignIndex + (house - 1)) % 12;
    if (SIGN_LORDS[signOfHouse] === planet) {
      owned.push(house);
    }
  }
  return owned;
}

function evaluateFunctionalRole(ownedHouses: number[], ascendantSignIndex: number): {
  isYogakaraka: boolean;
  isTrikonaLord: boolean;
  isKendraLord: boolean;
  isDusthanaLord: boolean;
  isMarakaLord: boolean;
  summary: string;
} {
  const isKendra = ownedHouses.some(h => [1, 4, 7, 10].includes(h));
  const isTrikona = ownedHouses.some(h => [1, 5, 9].includes(h));
  const isDusthana = ownedHouses.some(h => [6, 8, 12].includes(h));
  const isMaraka = ownedHouses.some(h => [2, 7].includes(h));
  const isYogakaraka = (ownedHouses.includes(4) || ownedHouses.includes(10)) && (ownedHouses.includes(5) || ownedHouses.includes(9));

  let summary = 'Neutral Operative';
  if (isYogakaraka) {
    summary = 'Supreme Yogakaraka (Kendra + Trikona dual lordship)';
  } else if (isTrikona && !isDusthana) {
    summary = 'Functional Benefic (Trikona ruler)';
  } else if (isDusthana && !isTrikona) {
    summary = 'Functional Malefic / Challenge Lord (Dusthana ruler)';
  } else if (isMaraka) {
    summary = 'Maraka Significator (2nd/7th house lordship)';
  }

  return {
    isYogakaraka,
    isTrikonaLord: isTrikona,
    isKendraLord: isKendra,
    isDusthanaLord: isDusthana,
    isMarakaLord: isMaraka,
    summary,
  };
}

/**
 * Evaluates full cross-harmonic connection for a Dasha Lord
 */
export function buildDashaLordConnection(
  planet: TraditionalGraha,
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha',
  d1Chart: ChartData
): DashaLordConnection {
  const d1Planet = d1Chart.planets.find(p => p.planet === planet);
  const ascSignIdx = d1Chart.ascendant.signIndex;

  // D1 data
  const d1Sign = d1Planet?.sign || 'Aries';
  const d1SignIdx = d1Planet?.signIndex ?? 0;
  const d1House = d1Planet?.house ?? 1;
  const d1DegreeFormatted = d1Planet ? `${d1Planet.degree}° ${d1Planet.minute}'` : '0°';
  const isRetro = !!d1Planet?.isRetrograde;
  const isCombust = !!d1Planet?.isCombust;
  const d1Dignity = getDignity(planet, d1SignIdx);
  const ownedHouses = findOwnedHouses(planet, ascSignIdx);
  const functionalRole = evaluateFunctionalRole(ownedHouses, ascSignIdx);

  // Convert D1 chart to VargaEngineInput
  const vargaInput = {
    ascendantSiderealLon: d1Chart.ascendant.longitude,
    planets: d1Chart.planets.map(p => ({
      name: p.planet,
      siderealLongitude: p.siderealLongitude,
      symbol: '',
      sanskrit: '',
      d1Rashi: p.sign as any,
      nakshatra: p.nakshatra,
      pada: p.pada,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
    })),
  };

  // D9 (Navamsha)
  const d9Chart = computeVargaChart('D9', vargaInput);
  const d9Pos = d9Chart.positions[planet];
  const d9Sign = d9Pos?.vargaRashiEnglish || d9Pos?.vargaRashi || 'Aries';
  const d9SignIdx = (d9Pos?.vargaRashiNumber ?? 1) - 1;
  const d9House = d9Pos?.house ?? 1;
  const isVargottama = !!d9Pos?.isVargottama;
  const d9Dignity = d9Pos?.dignity || getDignity(planet, d9SignIdx);

  // D10 (Dasamsha)
  const d10Chart = computeVargaChart('D10', vargaInput);
  const d10Pos = d10Chart.positions[planet];
  const d10Sign = d10Pos?.vargaRashiEnglish || d10Pos?.vargaRashi || 'Aries';
  const d10SignIdx = (d10Pos?.vargaRashiNumber ?? 1) - 1;
  const d10House = d10Pos?.house ?? 1;
  const d10Dignity = d10Pos?.dignity || getDignity(planet, d10SignIdx);

  const careerSignificance = d10House === 10
    ? 'Occupies the 10th house of vocation in D10 (Supreme vocational authority)'
    : [1, 5, 9].includes(d10House)
    ? 'Occupies a supportive Trikona dharma house in D10'
    : [6, 8, 12].includes(d10House)
    ? 'Occupies a transformation/service sector in D10'
    : `Placed in House ${d10House} in D10`;

  const synthesisNotes = `${planet} (${level}) operates as ${functionalRole.summary}. In D1 it activates House ${d1House} and rules Houses ${ownedHouses.join(', ') || 'none'}. In D9 it is placed in ${d9Sign}${isVargottama ? ' [Vargottama]' : ''}, indicating ${d9Dignity.toLowerCase()} inner strength.`;

  return {
    planet,
    level,
    d1: {
      sign: d1Sign,
      signIndex: d1SignIdx,
      degreeFormatted: d1DegreeFormatted,
      house: d1House,
      houseLordOf: ownedHouses,
      isRetrograde: isRetro,
      isCombust,
      dignity: d1Dignity,
    },
    d9: {
      sign: d9Sign,
      signIndex: d9SignIdx,
      house: d9House,
      isVargottama,
      dignity: d9Dignity,
    },
    d10: {
      sign: d10Sign,
      signIndex: d10SignIdx,
      house: d10House,
      dignity: d10Dignity,
      careerSignificance,
    },
    functionalRole,
    synthesisNotes,
  };
}

/**
 * Connects full active Dasha state to D1, D9, D10 and produces a synthesis report
 */
export function connectActiveDasha(
  activeState: ActiveDashaState,
  d1Chart: ChartData
): ConnectedDashaReport {
  const mdConnection = buildDashaLordConnection(activeState.mahadasha.planet, 'Mahadasha', d1Chart);
  const adConnection = buildDashaLordConnection(activeState.antardasha.planet, 'Antardasha', d1Chart);
  const pdConnection = buildDashaLordConnection(activeState.pratyantardasha.planet, 'Pratyantardasha', d1Chart);

  const theme = `Active Period: ${activeState.mahadasha.planet} - ${activeState.antardasha.planet} - ${activeState.pratyantardasha.planet}`;
  
  const focuses = [
    `Mahadasha Lord ${activeState.mahadasha.planet} sets the overarching generational chapter: activates Houses ${mdConnection.d1.houseLordOf.join(', ') || 'N/A'} through House ${mdConnection.d1.house}.`,
    `Antardasha Lord ${activeState.antardasha.planet} filters current executive events through House ${adConnection.d1.house} with ${adConnection.d1.dignity}.`,
    `Pratyantardasha Lord ${activeState.pratyantardasha.planet} governs day-to-day psychic tempo and immediate breakthroughs in House ${pdConnection.d1.house}.`,
  ];

  if (mdConnection.d9.isVargottama || adConnection.d9.isVargottama) {
    focuses.push('Vargottama enhancement detected: Enhanced soul resilience and unshakeable core conviction.');
  }

  return {
    targetDate: activeState.targetDate,
    activeState,
    mdLordConnection: mdConnection,
    adLordConnection: adConnection,
    pdLordConnection: pdConnection,
    periodTheme: theme,
    astrologicalFocus: focuses,
  };
}
