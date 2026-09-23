import { describe, it, expect } from 'vitest';
import { calculatePrecisionVimshottari, resolveActiveDasha } from '../lib/dasha/precision-vimshottari';
import { connectActiveDasha } from '../lib/dasha/dasha-connector';
import { ChartData } from '@/types/astrology';

describe('Vimshottari Precision Engine & Connector', () => {
  // Birth: 1990-01-15T08:30:00Z, Moon at 125.5° (Leo, Magha Nakshatra, Ketu lord)
  const birthDate = new Date('1990-01-15T08:30:00Z');
  // Magha starts at 120° and ends at 133°20' (133.3333°). 125.5° is inside Magha.
  const moonLon = 125.5;

  it('should calculate accurate birth balance from Moon nakshatra', () => {
    const timeline = calculatePrecisionVimshottari(birthDate, moonLon);
    expect(timeline.balanceAtBirth.startingLord).toBe('Ketu');
    expect(timeline.balanceAtBirth.nakshatraName).toBe('Magha');
    expect(timeline.balanceAtBirth.nakshatraLord).toBe('Ketu');
    expect(timeline.balanceAtBirth.fractionElapsed).toBeGreaterThan(0);
    expect(timeline.balanceAtBirth.fractionElapsed).toBeLessThan(1);
    expect(timeline.balanceAtBirth.balanceYears).toBeGreaterThanOrEqual(0);
    expect(timeline.balanceAtBirth.balanceYears).toBeLessThanOrEqual(7); // Ketu total is 7 years
  });

  it('should generate 3-tier hierarchy (MD -> AD -> PD)', () => {
    const timeline = calculatePrecisionVimshottari(birthDate, moonLon);
    expect(timeline.mahadashas.length).toBeGreaterThanOrEqual(6);

    const firstMd = timeline.mahadashas[0];
    expect(firstMd.antardashas.length).toBeGreaterThan(0);

    const firstAd = firstMd.antardashas[0];
    expect(firstAd.pratyantardashas.length).toBeGreaterThan(0);
    expect(firstAd.pratyantardashas[0].level).toBe('Pratyantardasha');
  });

  it('should resolve active MD, AD, and PD for any arbitrary target date', () => {
    const timeline = calculatePrecisionVimshottari(birthDate, moonLon);
    const targetDate = new Date('2024-06-01T12:00:00Z');
    const active = resolveActiveDasha(timeline, targetDate);

    expect(active).not.toBeNull();
    if (active) {
      expect(active.targetDate).toBe('2024-06-01');
      expect(active.mahadasha).toBeDefined();
      expect(active.antardasha).toBeDefined();
      expect(active.pratyantardasha).toBeDefined();
      expect(active.mdProgressPercent).toBeGreaterThanOrEqual(0);
      expect(active.mdProgressPercent).toBeLessThanOrEqual(100);
    }
  });

  it('should connect active dasha lords to D1, D9, and D10 harmonic positions', () => {
    const timeline = calculatePrecisionVimshottari(birthDate, moonLon);
    const active = resolveActiveDasha(timeline, new Date('2024-06-01T12:00:00Z'))!;

    // Mock minimal ChartData for connector verification
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
          siderealLongitude: moonLon,
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

    const report = connectActiveDasha(active, mockChart);
    expect(report.periodTheme).toContain('Active Period');
    expect(report.mdLordConnection.d1.sign).toBeTruthy();
    expect(report.mdLordConnection.d9.sign).toBeTruthy();
    expect(report.mdLordConnection.d10.sign).toBeTruthy();
    expect(report.mdLordConnection.functionalRole.summary).toBeTruthy();
    expect(report.astrologicalFocus.length).toBeGreaterThanOrEqual(3);
  });
});
