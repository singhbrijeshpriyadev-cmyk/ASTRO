import { describe, it, expect } from 'vitest';
import { generateDeterministicInterpretation } from '../lib/interpretation/interpretation-engine';
import { synthesizePlanetaryFacts, synthesizeHouseFacts, calculatePanchadhaMaitri } from '../lib/interpretation/fact-synthesizer';
import { ChartData } from '@/types/astrology';

describe('Deterministic Vedic Interpretation Engine', () => {
  const mockChart = {
    ascendant: {
      longitude: 320,
      sign: 'Aquarius',
      signIndex: 10,
      degree: 20,
      minute: 0,
      second: 0,
      formatted: 'Aquarius 20°00\'',
    },
    planets: [
      {
        planet: 'Sun',
        tropicalLongitude: 300,
        siderealLongitude: 276,
        sign: 'Capricorn',
        signIndex: 9,
        degree: 6,
        minute: 0,
        second: 0,
        house: 12,
        isRetrograde: false,
        isCombust: false,
        nakshatra: 'Uttara Ashadha',
        nakshatraLord: 'Sun',
        pada: 3,
        dignity: 'Enemy Sign',
      },
      {
        planet: 'Moon',
        tropicalLongitude: 149,
        siderealLongitude: 125.5,
        sign: 'Leo',
        signIndex: 4,
        degree: 5,
        minute: 30,
        second: 0,
        house: 7,
        isRetrograde: false,
        isCombust: false,
        nakshatra: 'Magha',
        nakshatraLord: 'Ketu',
        pada: 2,
        dignity: 'Friendly Sign',
      },
      {
        planet: 'Mars',
        tropicalLongitude: 270,
        siderealLongitude: 246,
        sign: 'Sagittarius',
        signIndex: 8,
        degree: 6,
        minute: 0,
        second: 0,
        house: 11,
        isRetrograde: false,
        isCombust: false,
        nakshatra: 'Mula',
        nakshatraLord: 'Ketu',
        pada: 2,
        dignity: 'Friendly Sign',
      },
      {
        planet: 'Mercury',
        tropicalLongitude: 310,
        siderealLongitude: 286,
        sign: 'Capricorn',
        signIndex: 9,
        degree: 16,
        minute: 0,
        second: 0,
        house: 12,
        isRetrograde: false,
        isCombust: false,
        nakshatra: 'Shravana',
        nakshatraLord: 'Moon',
        pada: 2,
        dignity: 'Neutral Sign',
      },
      {
        planet: 'Jupiter',
        tropicalLongitude: 110,
        siderealLongitude: 86,
        sign: 'Gemini',
        signIndex: 2,
        degree: 26,
        minute: 0,
        second: 0,
        house: 5,
        isRetrograde: true,
        isCombust: false,
        nakshatra: 'Punarvasu',
        nakshatraLord: 'Jupiter',
        pada: 2,
        dignity: 'Enemy Sign',
      },
      {
        planet: 'Venus',
        tropicalLongitude: 330,
        siderealLongitude: 306,
        sign: 'Aquarius',
        signIndex: 10,
        degree: 6,
        minute: 0,
        second: 0,
        house: 1,
        isRetrograde: false,
        isCombust: false,
        nakshatra: 'Shatabhisha',
        nakshatraLord: 'Rahu',
        pada: 1,
        dignity: 'Friendly Sign',
      },
      {
        planet: 'Saturn',
        tropicalLongitude: 315,
        siderealLongitude: 291,
        sign: 'Capricorn',
        signIndex: 9,
        degree: 21,
        minute: 0,
        second: 0,
        house: 12,
        isRetrograde: false,
        isCombust: false,
        nakshatra: 'Shravana',
        nakshatraLord: 'Moon',
        pada: 4,
        dignity: 'Own Sign',
      },
      {
        planet: 'Rahu',
        tropicalLongitude: 340,
        siderealLongitude: 316,
        sign: 'Aquarius',
        signIndex: 10,
        degree: 16,
        minute: 0,
        second: 0,
        house: 1,
        isRetrograde: true,
        isCombust: false,
        nakshatra: 'Shatabhisha',
        nakshatraLord: 'Rahu',
        pada: 3,
        dignity: 'Exalted',
      },
      {
        planet: 'Ketu',
        tropicalLongitude: 160,
        siderealLongitude: 136,
        sign: 'Leo',
        signIndex: 4,
        degree: 16,
        minute: 0,
        second: 0,
        house: 7,
        isRetrograde: true,
        isCombust: false,
        nakshatra: 'Purva Phalguni',
        nakshatraLord: 'Venus',
        pada: 1,
        dignity: 'Debilitated',
      },
    ],
    houses: [
      { houseNumber: 1, cuspLongitude: 320, sign: 'Aquarius', signIndex: 10 },
      { houseNumber: 2, cuspLongitude: 350, sign: 'Pisces', signIndex: 11 },
      { houseNumber: 3, cuspLongitude: 20, sign: 'Aries', signIndex: 0 },
      { houseNumber: 4, cuspLongitude: 50, sign: 'Taurus', signIndex: 1 },
      { houseNumber: 5, cuspLongitude: 80, sign: 'Gemini', signIndex: 2 },
      { houseNumber: 6, cuspLongitude: 110, sign: 'Cancer', signIndex: 3 },
      { houseNumber: 7, cuspLongitude: 140, sign: 'Leo', signIndex: 4 },
      { houseNumber: 8, cuspLongitude: 170, sign: 'Virgo', signIndex: 5 },
      { houseNumber: 9, cuspLongitude: 200, sign: 'Libra', signIndex: 6 },
      { houseNumber: 10, cuspLongitude: 230, sign: 'Scorpio', signIndex: 7 },
      { houseNumber: 11, cuspLongitude: 260, sign: 'Sagittarius', signIndex: 8 },
      { houseNumber: 12, cuspLongitude: 290, sign: 'Capricorn', signIndex: 9 },
    ],
    calculationSettings: {
      ayanamsha: 'Lahiri',
      houseSystem: 'Whole Sign',
      nodeType: 'True',
      zodiac: 'Sidereal',
      ephemeris: 'Astronomical High Precision',
    },
  } as unknown as ChartData;

  it('should calculate Panchadha Maitri 5-fold compound friendship accurately', () => {
    // Sun in Capricorn (ruled by Saturn). Natural: Enemy (-1).
    // Distance from Sun to Saturn: Sun is in Cap, Sat is in Cap (1st house).
    // 1st house is temporal enemy (-1). Compounded: -2 = Great Enemy (Adhi Shatru)
    const rel = calculatePanchadhaMaitri('Sun', 'Saturn', 9, 9);
    expect(rel).toBe('Great Enemy (Adhi Shatru)');
  });

  it('should synthesize all planetary and house facts with aspects and conjunctions', () => {
    const pFacts = synthesizePlanetaryFacts(mockChart);
    expect(pFacts['Sun']).toBeDefined();
    expect(pFacts['Moon']).toBeDefined();
    expect(pFacts['Saturn'].isOwnSign).toBe(true);
    // Sun, Mercury, Saturn are all in Capricorn (house 12)
    expect(pFacts['Sun'].conjunctions.length).toBe(2);

    const hFacts = synthesizeHouseFacts(mockChart, pFacts);
    expect(Object.keys(hFacts).length).toBe(12);
    expect(hFacts[1].sign).toBe('Aquarius');
    expect(hFacts[12].occupyingPlanets).toContain('Sun');
    expect(hFacts[12].occupyingPlanets).toContain('Mercury');
    expect(hFacts[12].occupyingPlanets).toContain('Saturn');
  });

  it('should generate all 13 layers of structured analysis with epistemic triad demarcation', () => {
    const interp = generateDeterministicInterpretation(mockChart, {
      querentName: 'Test Querent',
      birthDate: new Date('1990-01-15T08:30:00Z'),
    });

    expect(interp.layer1_chartSummary).toBeDefined();
    expect(interp.layer2_lagnaAnalysis).toBeDefined();
    expect(interp.layer3_moonAnalysis).toBeDefined();
    expect(interp.layer4_sunAnalysis).toBeDefined();
    expect(Object.keys(interp.layer5_planetAnalysis).length).toBe(9);
    expect(Object.keys(interp.layer6_houseAnalysis).length).toBe(12);
    expect(interp.layer7_importantYogas).toBeDefined();
    expect(interp.layer8_strengths).toBeDefined();
    expect(interp.layer9_challenges).toBeDefined();
    expect(interp.layer10_dashaAnalysis).toBeDefined();
    expect(interp.layer11_transitAnalysis).toBeDefined();
    expect(interp.layer12_vargaComparison).toBeDefined();
    expect(interp.layer13_topicSpecific.dharma).toBeDefined();

    // Verify epistemic statements exist and have valid tags
    expect(interp.layer1_chartSummary.facts.length).toBeGreaterThan(0);
    for (const fact of interp.layer1_chartSummary.facts) {
      expect(fact.tag).toBe('[CALCULATED FACT]');
    }
    for (const item of interp.layer1_chartSummary.interpretations) {
      expect(item.tag).toBe('[TRADITIONAL INTERPRETATION]');
    }
    for (const item of interp.layer1_chartSummary.guidance) {
      expect(item.tag).toBe('[INTERPRETIVE GUIDANCE]');
    }
  });
});
