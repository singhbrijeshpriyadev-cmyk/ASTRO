import * as Astronomy from 'astronomy-engine';
import { 
  ChartData, 
  PlanetPosition, 
  HousePosition, 
  Ascendant, 
  NormalizedBirthData, 
  CalculationSettings,
  GrahaName,
  TraditionalGraha,
  RashiName,
  WesternZodiac,
  NakshatraName
} from '@/types/astrology';
import { RASHIS, NAKSHATRAS, GRAHA_METADATA } from './constants';
import { normalizeDegrees, calculateDignity, formatDMS } from './coordinates';
import { getAyanamsha } from '../ephemeris/ayanamsha';

const BHAVA_SIGNIFICANCES: Record<number, string[]> = {
  1: ['Lagna / Self', 'Physical Constitution', 'Vitality', 'Complexion', 'Inherent Nature'],
  2: ['Dhana / Wealth', 'Family Lineage', 'Speech (Vak)', 'Accumulated Assets', 'Nourishment'],
  3: ['Sahaja / Courage', 'Younger Siblings', 'Vital Initiative', 'Manual Arts', 'Short Journeys'],
  4: ['Sukha / Inner Peace', 'Mother (Matri)', 'Vehicles (Vahana)', 'Real Estate', 'Education'],
  5: ['Putra / Intellect', 'Purva Punya (Past Karma)', 'Progeny', 'Creative Genius', 'Mantras'],
  6: ['Ari / Adversaries', 'Debts (Rina)', 'Diseases (Roga)', 'Service', 'Litigation'],
  7: ['Yuvati / Partnerships', 'Spouse (Kalatra)', 'Public Alliances', 'Trade & Commerce'],
  8: ['Randhra / Longevity (Ayur)', 'Transformation', 'Occult Secrets', 'Inheritance', 'Unearned Gains'],
  9: ['Dharma / Divine Grace', 'Higher Wisdom', 'Guru / Father', 'Pilgrimages', 'Virtue'],
  10: ['Karma / Profession', 'Public Status', 'Authority', 'Fame', 'Sovereignty'],
  11: ['Labha / Gains', 'Elder Siblings', 'Aspirations', 'Social Influence', 'Prosperity'],
  12: ['Vyaya / Dissolution (Moksha)', 'Losses', 'Foreign Enclaves', 'Subconscious', 'Spiritual Liberation'],
};

export const COMBUSTION_THRESHOLDS: Partial<Record<GrahaName, number>> = {
  Chandra: 12.0,
  Mangala: 17.0,
  Budha: 14.0, // 12 when retrograde
  Guru: 11.0,
  Shukra: 10.0, // 8 when retrograde
  Shani: 15.0,
};

/**
 * Extracts integer degrees, minutes, and seconds from decimal degree [0, 30).
 */
export function splitDMS(deg: number): { degree: number; minutes: number; seconds: number; dms: string } {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  let s = Math.round((minFloat - m) * 60);
  let finalD = d;
  let finalM = m;

  if (s >= 60) {
    s = 0;
    finalM += 1;
  }
  if (finalM >= 60) {
    finalM = 0;
    finalD += 1;
  }

  const dms = `${finalD}° ${String(finalM).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
  return { degree: finalD, minutes: finalM, seconds: s, dms };
}

/**
 * Maps continuous sidereal longitude [0, 360) to Rashi and Nakshatra metrics.
 */
export function mapLongitudeToVedicCoordinates(siderealLon: number) {
  const norm = normalizeDegrees(siderealLon);
  const rashiIndex = Math.floor(norm / 30);
  const degreeInRashi = norm - (rashiIndex * 30);
  const rashi = RASHIS[rashiIndex];

  const nakshatraSpan = 360 / 27; // 13.333333°
  const nakshatraIndex = Math.floor(norm / nakshatraSpan);
  const degInNak = norm - (nakshatraIndex * nakshatraSpan);
  const padaSpan = nakshatraSpan / 4; // 3.333333°
  const pada = Math.min(4, Math.floor(degInNak / padaSpan) + 1);
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const dmsDetails = splitDMS(degreeInRashi);

  return {
    zodiacSign: rashi.name as RashiName,
    zodiacSignEnglish: rashi.english as WesternZodiac,
    rashiNumber: rashi.number,
    degreeDecimal: degreeInRashi,
    ...dmsDetails,
    nakshatra: nakshatra.name as NakshatraName,
    nakshatraNumber: nakshatra.number,
    pada,
    nakshatraLord: nakshatra.lord as TraditionalGraha,
  };
}

/**
 * Deterministic D1 Rashi Chart Engine.
 * Calculates positions from high-precision VSOP87/ELP2000 ephemeris and selected ayanamsha.
 */
export function calculateD1RashiChart(
  normalized: NormalizedBirthData,
  settings: CalculationSettings
): ChartData {
  const utcDate = new Date(normalized.birthUTC);
  const time = Astronomy.MakeTime(utcDate);
  const jd = normalized.julianDay;

  // 1. Calculate Ayanamsha
  const ayanamshaDeg = settings.zodiac === 'tropical' 
    ? 0.0 
    : getAyanamsha(jd, settings.ayanamsha as any);

  // 2. Greenwich & Local Sidereal Time
  const gmst = Astronomy.SiderealTime(time);
  const lstHours = (((gmst + normalized.longitude / 15.0) % 24) + 24) % 24;
  const ramcDeg = lstHours * 15.0;

  // 3. Obliquity of Ecliptic
  const rad = Math.PI / 180;
  const T = time.tt / 36525.0;
  const eps = (23.4392911 - 0.0130042 * T) * rad;
  const theta = ramcDeg * rad;
  const phi = normalized.latitude * rad;

  // 4. Tropical Ascendant (Lagna)
  const yAsc = Math.cos(theta);
  const xAsc = -Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  const tropicalAsc = normalizeDegrees(Math.atan2(yAsc, xAsc) / rad);
  const siderealAsc = normalizeDegrees(tropicalAsc - ayanamshaDeg);
  const ascCoords = mapLongitudeToVedicCoordinates(siderealAsc);

  const ascendant: Ascendant = {
    tropicalLongitude: tropicalAsc,
    siderealLongitude: siderealAsc,
    longitude: siderealAsc,
    zodiacSign: ascCoords.zodiacSign,
    zodiacSignEnglish: ascCoords.zodiacSignEnglish,
    sign: ascCoords.zodiacSignEnglish,
    signIndex: ascCoords.rashiNumber - 1,
    rashiNumber: ascCoords.rashiNumber,
    degree: ascCoords.degree,
    minutes: ascCoords.minutes,
    minute: ascCoords.minutes,
    seconds: ascCoords.seconds,
    second: ascCoords.seconds,
    degreeDecimal: ascCoords.degreeDecimal,
    dms: ascCoords.dms,
    formatted: `${ascCoords.zodiacSignEnglish} ${ascCoords.degree}°${ascCoords.minutes}'`,
    nakshatra: ascCoords.nakshatra,
    nakshatraNumber: ascCoords.nakshatraNumber,
    pada: ascCoords.pada,
    nakshatraLord: ascCoords.nakshatraLord,
  };

  // 5. Midheaven (MC / Medium Coeli)
  const yMC = Math.sin(theta);
  const xMC = Math.cos(theta) * Math.cos(eps);
  const tropicalMC = normalizeDegrees(Math.atan2(yMC, xMC) / rad);
  const siderealMC = normalizeDegrees(tropicalMC - ayanamshaDeg);
  const mcCoords = mapLongitudeToVedicCoordinates(siderealMC);

  // 6. Planetary Bodies
  const bodies: { name: GrahaName; body: Astronomy.Body | 'Rahu' | 'Ketu' }[] = [
    { name: 'Surya', body: Astronomy.Body.Sun },
    { name: 'Chandra', body: Astronomy.Body.Moon },
    { name: 'Mangala', body: Astronomy.Body.Mars },
    { name: 'Budha', body: Astronomy.Body.Mercury },
    { name: 'Guru', body: Astronomy.Body.Jupiter },
    { name: 'Shukra', body: Astronomy.Body.Venus },
    { name: 'Shani', body: Astronomy.Body.Saturn },
    { name: 'Rahu', body: 'Rahu' },
    { name: 'Ketu', body: 'Ketu' },
  ];

  const deltaHours = 1;
  const timeDelta = Astronomy.MakeTime(new Date(utcDate.getTime() + deltaHours * 3600000));
  const rawCoords: { name: GrahaName; tropicalLon: number; speed: number; isRetrograde: boolean }[] = [];

  for (const b of bodies) {
    if (b.body === 'Rahu' || b.body === 'Ketu') {
      // Lunar Node calculation based on nodeType setting
      let nodeLon = 125.04452 - 1934.136261 * T + 0.0020708 * T * T;
      if (settings.nodeType === 'true') {
        // High-precision true node adjustment with solar perturbation
        const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, time, true);
        const sunEcl = Astronomy.Ecliptic(sunVec);
        const perturbation = -1.26 * Math.sin(2 * (sunEcl.elon - nodeLon) * rad);
        nodeLon += perturbation;
      }
      nodeLon = normalizeDegrees(nodeLon);
      const isRahu = b.name === 'Rahu';
      const finalTropLon = isRahu ? nodeLon : normalizeDegrees(nodeLon + 180);

      rawCoords.push({
        name: b.name,
        tropicalLon: finalTropLon,
        speed: -0.05295,
        isRetrograde: true, // Lunar nodes are always retrograde in Vedic convention
      });
    } else {
      const vec = Astronomy.GeoVector(b.body, time, true);
      const ecl = Astronomy.Ecliptic(vec);
      const vecNext = Astronomy.GeoVector(b.body, timeDelta, true);
      const eclNext = Astronomy.Ecliptic(vecNext);

      let lonDiff = eclNext.elon - ecl.elon;
      if (lonDiff < -180) lonDiff += 360;
      if (lonDiff > 180) lonDiff -= 360;
      const speed = (lonDiff / deltaHours) * 24.0;

      rawCoords.push({
        name: b.name,
        tropicalLon: normalizeDegrees(ecl.elon),
        speed,
        isRetrograde: speed < 0,
      });
    }
  }

  // Find Sun's sidereal position for combustion testing
  const sunRaw = rawCoords.find(c => c.name === 'Surya')!;
  const sunSidereal = normalizeDegrees(sunRaw.tropicalLon - ayanamshaDeg);

  // 7. Calculate 12 House Cusps according to house system
  const houseCusps: number[] = [];
  if (settings.houseSystem === 'equal-house') {
    for (let h = 0; h < 12; h++) {
      houseCusps.push(normalizeDegrees(siderealAsc + h * 30));
    }
  } else if (settings.houseSystem === 'sripati') {
    // Sripati / Porphyry: trisection between Asc and MC
    const arc1 = normalizeDegrees(siderealAsc - siderealMC) / 3.0;
    const arc2 = normalizeDegrees(siderealMC + 180 - siderealAsc) / 3.0;
    // House 10 is MC
    houseCusps[9] = siderealMC;
    houseCusps[10] = normalizeDegrees(siderealMC + arc1);
    houseCusps[11] = normalizeDegrees(siderealMC + 2 * arc1);
    houseCusps[0] = siderealAsc;
    houseCusps[1] = normalizeDegrees(siderealAsc + arc2);
    houseCusps[2] = normalizeDegrees(siderealAsc + 2 * arc2);
    for (let i = 0; i < 6; i++) {
      houseCusps[i + 6] = normalizeDegrees(houseCusps[i] + 180);
    }
  } else {
    // Default: 'whole-sign'
    const ascRashiIdx = ascCoords.rashiNumber - 1;
    for (let h = 0; h < 12; h++) {
      const rIdx = (ascRashiIdx + h) % 12;
      houseCusps.push(normalizeDegrees(rIdx * 30 + ascCoords.degreeDecimal));
    }
  }

  // 8. Map Planets into Houses & Dignities
  const planets: PlanetPosition[] = rawCoords.map(c => {
    const siderealLon = normalizeDegrees(c.tropicalLon - ayanamshaDeg);
    const coords = mapLongitudeToVedicCoordinates(siderealLon);

    // House calculation based on system
    let houseNumber = 1;
    if (settings.houseSystem === 'whole-sign') {
      houseNumber = ((coords.rashiNumber - ascCoords.rashiNumber + 12) % 12) + 1;
    } else {
      // Find cusp interval
      for (let h = 0; h < 12; h++) {
        const cuspCurrent = houseCusps[h];
        const cuspNext = houseCusps[(h + 1) % 12];
        const dist = normalizeDegrees(siderealLon - cuspCurrent);
        const span = normalizeDegrees(cuspNext - cuspCurrent);
        if (dist >= 0 && dist < span) {
          houseNumber = h + 1;
          break;
        }
      }
    }

    // Combustion
    let isCombust = false;
    if (c.name !== 'Surya' && c.name !== 'Rahu' && c.name !== 'Ketu') {
      let threshold = COMBUSTION_THRESHOLDS[c.name] || 10;
      if (c.isRetrograde && (c.name === 'Budha' || c.name === 'Shukra')) {
        threshold -= 2;
      }
      let diff = Math.abs(siderealLon - sunSidereal);
      if (diff > 180) diff = 360 - diff;
      isCombust = diff <= threshold;
    }

    const meta = GRAHA_METADATA[c.name as TraditionalGraha];
    const dignity = meta 
      ? calculateDignity(c.name as TraditionalGraha, coords.zodiacSign, coords.degreeDecimal)
      : 'Neutral';

    const planetEnglish = (c.name === 'Rahu' || c.name === 'Ketu' ? c.name : (meta?.english || c.name)) as TraditionalGraha;

    return {
      name: c.name,
      planet: planetEnglish,
      englishName: meta?.english || c.name,
      sanskrit: meta?.sanskrit || c.name,
      symbol: meta?.symbol || '•',
      tropicalLongitude: c.tropicalLon,
      siderealLongitude: siderealLon,
      zodiacSign: coords.zodiacSign,
      zodiacSignEnglish: coords.zodiacSignEnglish,
      sign: coords.zodiacSignEnglish,
      signIndex: coords.rashiNumber - 1,
      rashiNumber: coords.rashiNumber,
      degree: coords.degree,
      minutes: coords.minutes,
      minute: coords.minutes,
      seconds: coords.seconds,
      second: coords.seconds,
      degreeDecimal: coords.degreeDecimal,
      dms: coords.dms,
      house: houseNumber,
      isRetrograde: c.isRetrograde,
      isCombust,
      speed: c.speed,
      nakshatra: coords.nakshatra,
      nakshatraNumber: coords.nakshatraNumber,
      pada: coords.pada,
      nakshatraLord: coords.nakshatraLord,
      dignity,
    };
  });

  // 9. Build 12 HousePosition objects
  const houses: HousePosition[] = [];
  for (let h = 1; h <= 12; h++) {
    const cuspLon = houseCusps[h - 1];
    const coords = mapLongitudeToVedicCoordinates(cuspLon);
    const occupants = planets.filter(p => p.house === h).map(p => p.name);
    const rashiInfo = RASHIS[coords.rashiNumber - 1];

    houses.push({
      houseNumber: h,
      zodiacSign: coords.zodiacSign,
      sign: coords.zodiacSignEnglish,
      signIndex: coords.rashiNumber - 1,
      rashiNumber: coords.rashiNumber,
      cuspLongitude: cuspLon,
      degree: coords.degree,
      minutes: coords.minutes,
      minute: coords.minutes,
      seconds: coords.seconds,
      second: coords.seconds,
      dms: coords.dms,
      lord: rashiInfo.lord,
      occupants,
      significances: BHAVA_SIGNIFICANCES[h] || [],
    });
  }

  return {
    chartId: 'D1',
    name: 'Rashi (Natal Kundali)',
    sanskritName: 'लग्न कुंडली',
    ascendant,
    mc: {
      tropicalLongitude: tropicalMC,
      siderealLongitude: siderealMC,
      zodiacSign: mcCoords.zodiacSign,
      degreeDecimal: mcCoords.degreeDecimal,
      dms: mcCoords.dms,
    },
    planets,
    houses,
    calculationSettings: settings,
    normalizedBirthData: normalized,
  };
}
