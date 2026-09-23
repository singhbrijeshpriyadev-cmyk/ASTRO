import { 
  KundaliData, 
  PlanetPosition, 
  HousePosition, 
  PanchangData, 
  TraditionalGraha, 
  GrahaName,
  RawBirthInput,
  NormalizedBirthData,
  CalculationSettings
} from '@/types/astrology';
import { defaultEphemerisProvider } from '../ephemeris/astronomical';
import { getSiderealPositionDetails, calculateDignity, calculateHouse, formatDMS, normalizeDegrees } from './coordinates';
import { RASHIS, GRAHA_METADATA, TITHI_NAMES, YOGA_NAMES, KARANA_NAMES } from './constants';
import { VARGA_DEFINITIONS, buildVargaChart } from '../varga/divisional';
import { calculateVimshottariDasha } from '../dasha/vimshottari';
import { evaluateAllYogas } from '../yoga/evaluators';
import { evaluateAllDoshas } from '../dosha/evaluators';
import { splitDMS } from './d1-engine';

const BHAVA_SIGNIFICANCES: Record<number, string[]> = {
  1: ['Self', 'Physical Body', 'Vitality', 'Personality', 'Appearance', 'Lagna'],
  2: ['Wealth', 'Family', 'Speech', 'Accumulated Assets', 'Facial features', 'Food'],
  3: ['Courage', 'Younger Siblings', 'Initiative', 'Communication', 'Short Journeys'],
  4: ['Mother', 'Home', 'Vehicles', 'Inner Peace', 'Real Estate', 'Education'],
  5: ['Intellect', 'Progeny', 'Purva Punya', 'Creativity', 'Speculation', 'Mantras'],
  6: ['Enemies', 'Debts', 'Disease', 'Service', 'Litigation', 'Obstacles'],
  7: ['Spouse', 'Partnerships', 'Public Relations', 'Trade', 'Contracts'],
  8: ['Longevity', 'Transformation', 'Occult', 'Inheritance', 'Unearned Wealth'],
  9: ['Dharma', 'Higher Wisdom', 'Father', 'Guru', 'Long Journeys', 'Grace'],
  10: ['Karma', 'Profession', 'Public Honor', 'Authority', 'Legacy', 'Status'],
  11: ['Gains', 'Elder Siblings', 'Aspirations', 'Social Networks', 'Prosperity'],
  12: ['Moksha', 'Losses', 'Foreign Lands', 'Subconscious', 'Seclusion', 'Bed Pleasures'],
};

export function calculateKundali(input: {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  latitude: number;
  longitude: number;
  timezone: number;
  locationName?: string;
  ayanamshaSystem?: 'Lahiri' | 'Krishnamurti' | 'Raman';
}, settings?: Partial<CalculationSettings>): KundaliData {
  const localMs = Date.UTC(
    input.year,
    input.month - 1,
    input.day,
    input.hour,
    input.minute,
    input.second || 0
  );
  const timezoneOffsetMs = input.timezone * 3600 * 1000;
  const utcDate = new Date(localMs - timezoneOffsetMs);

  const ephemerisResult = defaultEphemerisProvider.calculate(
    utcDate,
    input.latitude,
    input.longitude,
    (input.ayanamshaSystem || settings?.ayanamsha || 'Lahiri') as any,
    (settings?.nodeType as any) || 'true'
  );

  const ascDetails = getSiderealPositionDetails(ephemerisResult.siderealAscendant);
  const ascDms = splitDMS(ascDetails.degreeInRashi);

  const ascendant: PlanetPosition = {
    name: 'Lagna',
    planet: 'Ascendant' as any,
    englishName: 'Ascendant (Lagna)',
    sanskrit: 'लग्न',
    symbol: 'Asc',
    tropicalLongitude: ephemerisResult.tropicalAscendant,
    siderealLongitude: ephemerisResult.siderealAscendant,
    zodiacSign: ascDetails.rashi,
    zodiacSignEnglish: ascDetails.rashiEnglish,
    rashiNumber: ascDetails.rashiNumber,
    degree: ascDms.degree,
    minutes: ascDms.minutes,
    seconds: ascDms.seconds,
    degreeDecimal: ascDetails.degreeInRashi,
    dms: ascDetails.dms,
    nakshatra: ascDetails.nakshatra,
    nakshatraNumber: ascDetails.nakshatraNumber,
    pada: ascDetails.pada,
    nakshatraLord: ascDetails.nakshatraLord,
    dignity: 'Neutral',
    house: 1,
    isRetrograde: false,
    isCombust: false,
    speed: 0,
  };

  const sunRaw = ephemerisResult.coordinates.find(c => c.name === 'Surya')!;
  const sunSiderealLon = normalizeDegrees(sunRaw.tropicalLongitude - ephemerisResult.ayanamshaDegrees);

  const COMBUSTION_THRESHOLDS: Partial<Record<GrahaName, number>> = {
    Chandra: 12,
    Mangala: 17,
    Budha: 14,
    Guru: 11,
    Shukra: 10,
    Shani: 15,
  };

  const planets: PlanetPosition[] = ephemerisResult.coordinates.map(raw => {
    const siderealLon = normalizeDegrees(raw.tropicalLongitude - ephemerisResult.ayanamshaDegrees);
    const details = getSiderealPositionDetails(siderealLon);
    const house = calculateHouse(details.rashiNumber, ascDetails.rashiNumber);
    const meta = GRAHA_METADATA[raw.name as TraditionalGraha];
    const dmsParts = splitDMS(details.degreeInRashi);

    let isCombust = false;
    if (raw.name !== 'Surya' && raw.name !== 'Rahu' && raw.name !== 'Ketu') {
      const threshold = COMBUSTION_THRESHOLDS[raw.name];
      if (threshold) {
        let diff = Math.abs(siderealLon - sunSiderealLon);
        if (diff > 180) diff = 360 - diff;
        isCombust = diff <= threshold;
      }
    }

    const dignity = meta
      ? calculateDignity(raw.name as TraditionalGraha, details.rashi, details.degreeInRashi)
      : 'Neutral';

    const planetKey = (raw.name === 'Rahu' || raw.name === 'Ketu' ? raw.name : (meta?.english || raw.name)) as TraditionalGraha;

    return {
      name: raw.name,
      planet: planetKey,
      englishName: meta?.english || raw.name,
      sanskrit: meta?.sanskrit || raw.name,
      symbol: meta?.symbol || '•',
      tropicalLongitude: raw.tropicalLongitude,
      siderealLongitude: siderealLon,
      zodiacSign: details.rashi,
      zodiacSignEnglish: details.rashiEnglish,
      rashiNumber: details.rashiNumber,
      degree: dmsParts.degree,
      minutes: dmsParts.minutes,
      seconds: dmsParts.seconds,
      degreeDecimal: details.degreeInRashi,
      dms: details.dms,
      nakshatra: details.nakshatra,
      nakshatraNumber: details.nakshatraNumber,
      pada: details.pada,
      nakshatraLord: details.nakshatraLord,
      dignity,
      house,
      isRetrograde: raw.isRetrograde,
      isCombust,
      speed: raw.speed,
    };
  });

  const bhavas: HousePosition[] = [];
  const lagnaRashiIdx = ascDetails.rashiNumber - 1;

  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (lagnaRashiIdx + (h - 1)) % 12;
    const rashi = RASHIS[rashiIdx];
    const cuspLon = normalizeDegrees(rashiIdx * 30 + ascDetails.degreeInRashi);
    const occupants = planets.filter(p => p.house === h).map(p => p.name);
    const dmsParts = splitDMS(ascDetails.degreeInRashi);

    bhavas.push({
      houseNumber: h,
      zodiacSign: rashi.name,
      rashiNumber: rashi.number,
      cuspLongitude: cuspLon,
      degree: dmsParts.degree,
      minutes: dmsParts.minutes,
      seconds: dmsParts.seconds,
      dms: formatDMS(ascDetails.degreeInRashi),
      lord: rashi.lord,
      occupants,
      significances: BHAVA_SIGNIFICANCES[h] || [],
    });
  }

  const moon = planets.find(p => p.name === 'Chandra')!;
  const sun = planets.find(p => p.name === 'Surya')!;
  const moonSunAngleDiff = normalizeDegrees(moon.siderealLongitude - sun.siderealLongitude);

  const tithiIndex = Math.floor(moonSunAngleDiff / 12);
  const tithiNum = tithiIndex + 1;
  const isShukla = tithiNum <= 15;
  const tithiNameIndex = (tithiNum - 1) % 15;
  const tithiName = `${isShukla ? 'Shukla' : 'Krishna'} ${TITHI_NAMES[tithiNameIndex]}`;
  const tithiCompletion = ((moonSunAngleDiff % 12) / 12) * 100;

  const yogaAngle = normalizeDegrees(sun.siderealLongitude + moon.siderealLongitude);
  const yogaIndex = Math.floor(yogaAngle / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIndex] || 'Vishkambha';

  const karanaIndex = Math.floor(moonSunAngleDiff / 6);
  let karanaName = '';
  if (karanaIndex === 0) karanaName = 'Kintughna';
  else if (karanaIndex >= 57) karanaName = KARANA_NAMES[7 + (karanaIndex - 57)];
  else karanaName = KARANA_NAMES[(karanaIndex - 1) % 7];

  const weekdayIdx = utcDate.getUTCDay();
  const VAARA_NAMES = [
    { name: 'Ravivara', lord: 'Surya' as TraditionalGraha },
    { name: 'Somavara', lord: 'Chandra' as TraditionalGraha },
    { name: 'Mangalavara', lord: 'Mangala' as TraditionalGraha },
    { name: 'Budhavara', lord: 'Budha' as TraditionalGraha },
    { name: 'Guruvara', lord: 'Guru' as TraditionalGraha },
    { name: 'Shukravara', lord: 'Shukra' as TraditionalGraha },
    { name: 'Shanivara', lord: 'Shani' as TraditionalGraha },
  ];
  const vaara = VAARA_NAMES[weekdayIdx];

  const panchang: PanchangData = {
    tithi: {
      number: tithiNum,
      name: tithiName,
      paksha: isShukla ? 'Shukla' : 'Krishna',
      completionPercentage: Math.round(tithiCompletion * 10) / 10,
    },
    nakshatra: {
      number: moon.nakshatraNumber,
      name: moon.nakshatra,
      lord: moon.nakshatraLord,
      pada: moon.pada,
      completionPercentage: Math.round((((moon.degreeDecimal ?? moon.degree) % (360 / 27)) / (360 / 27)) * 100),
    },
    yoga: {
      number: yogaIndex + 1,
      name: yogaName,
    },
    karana: {
      number: karanaIndex + 1,
      name: karanaName,
    },
    vaara: {
      dayNumber: weekdayIdx + 1,
      name: vaara.name,
      lord: vaara.lord,
    },
    ayanamsa: {
      name: input.ayanamshaSystem || 'Lahiri',
      value: ephemerisResult.ayanamshaDegrees,
      formatted: formatDMS(ephemerisResult.ayanamshaDegrees),
    },
    sunRise: '06:00 LMT',
    sunSet: '18:15 LMT',
  };

  const vargas: Record<string, any> = {};
  const planetPositionsForVarga = planets.map(p => ({
    name: p.name,
    siderealLongitude: p.siderealLongitude,
  }));

  Object.values(VARGA_DEFINITIONS).forEach(vDef => {
    vargas[vDef.id] = buildVargaChart(vDef, ephemerisResult.siderealAscendant, planetPositionsForVarga);
  });

  const dashas = calculateVimshottariDasha(utcDate, moon.siderealLongitude);

  const yogaInput = {
    planets,
    lagnaRashiNumber: ascDetails.rashiNumber,
    houses: bhavas,
  };
  const evaluatedYogas = evaluateAllYogas(yogaInput);
  const evaluatedDoshas = evaluateAllDoshas(yogaInput);

  const mappedYogas = evaluatedYogas.map(y => ({
    name: y.name,
    sanskritName: y.sanskritName,
    category: (y.category === 'Pancha Mahapurusha' ? 'Mahapurusha' :
               y.category === 'Raja Yoga' || y.category === 'Vipareeta Raja Yoga' ? 'Raja' :
               y.category === 'Dhana Yoga' ? 'Dhana' : 'Auspicious') as any,
    beneficence: (y.isCancelled ? 'neutral' : 'positive') as any,
    planetsInvolved: y.affectedPlanets,
    housesInvolved: y.affectedHouses,
    description: y.interpretation,
    effects: y.mitigationSummary || y.interpretation,
  }));

  const mappedDoshas = evaluatedDoshas.map(d => ({
    name: d.name,
    sanskritName: d.sanskritName,
    category: 'Dosha' as any,
    beneficence: (d.isCancelled ? 'neutral' : 'challenging') as any,
    planetsInvolved: d.affectedPlanets,
    housesInvolved: d.affectedHouses,
    description: d.interpretation,
    effects: d.mitigationSummary || d.interpretation,
  }));

  const yogas = [...mappedYogas, ...mappedDoshas];

  const rawInput: RawBirthInput = {
    name: input.name,
    birthLocalDate: `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}`,
    birthLocalTime: `${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}:${String(input.second || 0).padStart(2, '0')}`,
    birthPlace: input.locationName || 'Observed Coordinates',
    latitude: input.latitude,
    longitude: input.longitude,
    timezone: 'Asia/Kolkata',
  };

  const normalizedData: NormalizedBirthData = {
    rawInput,
    resolvedPlace: {
      name: rawInput.birthPlace,
      country: 'India',
      latitude: input.latitude,
      longitude: input.longitude,
    },
    birthLocalDate: rawInput.birthLocalDate,
    birthLocalTime: rawInput.birthLocalTime,
    latitude: input.latitude,
    longitude: input.longitude,
    timezone: rawInput.timezone,
    utcOffset: input.timezone,
    birthUTC: utcDate.toISOString(),
    julianDay: ephemerisResult.julianDay,
    isHistoricalOffsetApplied: false,
  };

  const calculationSettings: CalculationSettings = {
    zodiac: 'sidereal',
    ayanamsha: input.ayanamshaSystem || settings?.ayanamsha || 'Lahiri',
    nodeType: settings?.nodeType || 'true',
    houseSystem: settings?.houseSystem || 'whole-sign',
    ephemeris: 'VSOP87/ELP2000 (Swiss Ephemeris precision)',
    calculationVersion: '1.0.0',
  };

  return {
    chartData: {
      chartId: 'D1',
      name: 'Rashi (Natal Kundali)',
      sanskritName: 'लग्न कुंडली',
      ascendant: {
        longitude: ascendant.siderealLongitude,
        sign: ascendant.zodiacSignEnglish || ascendant.zodiacSign,
        signIndex: ascendant.rashiNumber - 1,
        tropicalLongitude: ascendant.tropicalLongitude,
        siderealLongitude: ascendant.siderealLongitude,
        zodiacSign: ascendant.zodiacSign,
        zodiacSignEnglish: ascendant.zodiacSignEnglish,
        rashiNumber: ascendant.rashiNumber,
        degree: ascendant.degree,
        minutes: ascendant.minutes,
        seconds: ascendant.seconds,
        degreeDecimal: ascendant.degreeDecimal,
        dms: ascendant.dms,
        nakshatra: ascendant.nakshatra,
        nakshatraNumber: ascendant.nakshatraNumber,
        pada: ascendant.pada,
        nakshatraLord: ascendant.nakshatraLord,
      },
      planets,
      houses: bhavas,
      calculationSettings,
      normalizedBirthData: normalizedData,
    },
    rawInput,
    normalizedData,
    calculationSettings,
    birthInput: input,
    julianDay: ephemerisResult.julianDay,
    greenwichSiderealTimeHours: ephemerisResult.greenwichSiderealTimeHours,
    localSiderealTimeHours: ephemerisResult.localSiderealTimeHours,
    ayanamshaValue: ephemerisResult.ayanamshaDegrees,
    ayanamshaName: input.ayanamshaSystem || 'Lahiri',
    ascendant,
    planets,
    bhavas,
    panchang,
    vargas,
    dashas,
    yogas,
  };
}
