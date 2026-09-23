import { describe, it, expect } from 'vitest';
import { generateAstroTarotSynthesis } from '../lib/synthesis/astro-tarot-engine';
import { drawSpread } from '../lib/tarot/engine';
import { ChartData } from '@/types/astrology';

describe('Combined Astrology + Tarot Synthesis Engine', () => {
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

  it('should generate structured Astro + Tarot synthesis without altering underlying facts', () => {
    const tarotSnapshot = drawSpread('three_card', 'What is the highest path for career growth?');
    const synthesis = generateAstroTarotSynthesis({
      chart: mockChart,
      tarotSnapshot,
      birthDate: new Date('1990-01-15T08:30:00Z'),
      userQuestion: 'What is the highest path for career growth?',
    });

    expect(synthesis.overallTheme).toBeTruthy();
    expect(synthesis.astrologicalFactors.length).toBeGreaterThan(0);
    expect(synthesis.tarotFactors.length).toBeGreaterThan(0);
    expect(synthesis.convergingThemes.length).toBeGreaterThan(0);
    expect(synthesis.practicalReflection.length).toBeGreaterThan(0);
    expect(synthesis.questionsForReflection.length).toBeGreaterThan(0);

    // Astro data fidelity
    expect(synthesis.astroAnalysis.lagnaSign).toBe('Aquarius');
    expect(synthesis.astroAnalysis.moonSign).toBe('Leo');

    // Tarot data fidelity
    expect(synthesis.tarotAnalysis.totalCards).toBe(3);
    expect(synthesis.epistemicDemarcation.statement).toContain('interpretive aid');
  });
});
