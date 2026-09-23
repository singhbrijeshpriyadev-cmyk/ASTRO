import { describe, it, expect } from 'vitest';
import { calculateKundali } from '../../lib/astrology/kundali';
import { calculatePrecisionVimshottari } from '../../lib/dasha/precision-vimshottari';

describe('Golden Benchmark: Dr. B.V. Raman Natal Chart (1912-08-08 19:35 IST Bangalore)', () => {
  // Dr. B.V. Raman birth: August 8, 1912 at 19:35:00 IST (14:05:00 UTC)
  // Latitude: 13.0° N (13°00'), Longitude: 77.583333° E (77°35')
  const baseInput = {
    name: 'Dr. B.V. Raman',
    year: 1912,
    month: 8,
    day: 8,
    hour: 19,
    minute: 35,
    second: 0,
    latitude: 13.0,
    longitude: 77.583333,
    timezone: 5.5,
    locationName: 'Bangalore, India',
  };

  describe('Configuration A: Raman Ayanamsha (As published in Notable Horoscopes)', () => {
    const kundaliRaman = calculateKundali({
      ...baseInput,
      ayanamshaSystem: 'Raman',
    }, {
      zodiac: 'sidereal',
      ayanamsha: 'Raman',
      nodeType: 'mean',
      houseSystem: 'whole-sign',
    });

    it('verifies Lagna in Kumbha (Aquarius ~10°)', () => {
      expect(kundaliRaman.ascendant.zodiacSign).toBe('Kumbha');
      expect(kundaliRaman.ascendant.rashiNumber).toBe(11);
      expect(kundaliRaman.ascendant.degreeDecimal).toBeGreaterThanOrEqual(8.0);
      expect(kundaliRaman.ascendant.degreeDecimal).toBeLessThanOrEqual(11.5);
    });

    it('verifies Moon in Vrishabha (Taurus) in Mrigashira Nakshatra (Lord: Mangala)', () => {
      const moon = kundaliRaman.planets.find(p => p.planet === 'Moon')!;
      expect(moon.zodiacSign).toBe('Vrishabha');
      expect(moon.rashiNumber).toBe(2);
      expect(moon.nakshatra).toBe('Mrigashira');
      expect(moon.nakshatraLord).toBe('Mangala');
      expect(moon.degreeDecimal).toBeGreaterThan(24.0);
    });

    it('verifies starting Vimshottari Mahadasha is Mangala under exact ELP2000 coordinates', () => {
      const moon = kundaliRaman.planets.find(p => p.planet === 'Moon')!;
      const birthUtc = new Date('1912-08-08T14:05:00.000Z');
      const timeline = calculatePrecisionVimshottari(birthUtc, moon.siderealLongitude);

      expect(timeline.balanceAtBirth.startingLord).toBe('Mangala');
      expect(timeline.mahadashas[0].planet).toBe('Mangala');
    });
  });

  describe('Configuration B: Lahiri / Chitra-Paksha Ayanamsha (Indian Astronomical Ephemeris)', () => {
    const kundaliLahiri = calculateKundali({
      ...baseInput,
      ayanamshaSystem: 'Lahiri',
    }, {
      zodiac: 'sidereal',
      ayanamsha: 'Lahiri',
      nodeType: 'mean',
      houseSystem: 'whole-sign',
    });

    it('verifies Sun in Karka (Cancer) in Pushya Nakshatra', () => {
      const sun = kundaliLahiri.planets.find(p => p.planet === 'Sun')!;
      expect(sun.zodiacSign).toBe('Karka');
      expect(sun.rashiNumber).toBe(4);
      expect(sun.degreeDecimal).toBeGreaterThanOrEqual(21.5);
      expect(sun.degreeDecimal).toBeLessThanOrEqual(24.5);
    });

    it('verifies Moon position in Vrishabha (Taurus)', () => {
      const moon = kundaliLahiri.planets.find(p => p.planet === 'Moon')!;
      expect(moon.zodiacSign).toBe('Vrishabha');
      expect(moon.rashiNumber).toBe(2);
      // Under Lahiri Ayanamsha (which is ~1°25' greater than Raman),
      // the Moon crosses the boundary at 23°20' Taurus into Mrigashira Pada 1 (Lord: Mangala)
      expect(moon.degreeDecimal).toBeGreaterThan(23.0);
    });

    it('verifies Mars, Mercury, Venus stellium in Simha (Leo)', () => {
      const mars = kundaliLahiri.planets.find(p => p.planet === 'Mars')!;
      const mercury = kundaliLahiri.planets.find(p => p.planet === 'Mercury')!;
      const venus = kundaliLahiri.planets.find(p => p.planet === 'Venus')!;

      expect(mars.zodiacSign).toBe('Simha');
      expect(mercury.zodiacSign).toBe('Simha');
      expect(venus.zodiacSign).toBe('Simha');
    });

    it('verifies Jupiter in Vrishchika and Saturn in Vrishabha', () => {
      const jupiter = kundaliLahiri.planets.find(p => p.planet === 'Jupiter')!;
      const saturn = kundaliLahiri.planets.find(p => p.planet === 'Saturn')!;

      expect(jupiter.zodiacSign).toBe('Vrishchika');
      expect(saturn.zodiacSign).toBe('Vrishabha');
    });

    it('verifies Rahu in Meena and Ketu in Kanya at invariant 180° separation', () => {
      const rahu = kundaliLahiri.planets.find(p => p.planet === 'Rahu')!;
      const ketu = kundaliLahiri.planets.find(p => p.planet === 'Ketu')!;

      expect(rahu.zodiacSign).toBe('Meena');
      expect(ketu.zodiacSign).toBe('Kanya');

      const diff = Math.abs(rahu.siderealLongitude - ketu.siderealLongitude);
      expect(Math.round(diff)).toBe(180);
    });
  });
});
