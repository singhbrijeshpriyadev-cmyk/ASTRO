import { describe, it, expect } from 'vitest';
import { calculateD1RashiChart } from '../lib/astrology/d1-engine';
import { calculationService } from '../server/calculation-service';
import { RawBirthInput, CalculationSettings } from '../types/astrology';

describe('D1 Rashi Chart Astronomical Engine', () => {
  const settings: CalculationSettings = {
    zodiac: 'sidereal',
    ayanamsha: 'Lahiri',
    nodeType: 'true',
    houseSystem: 'whole-sign',
    ephemeris: 'VSOP87/ELP2000 (Swiss Ephemeris precision)',
    calculationVersion: '1.0.0',
  };

  const rawInput: RawBirthInput = {
    name: 'Reproducibility Benchmark',
    birthLocalDate: '1995-10-24',
    birthLocalTime: '08:30:00',
    birthPlace: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
  };

  it('calculates full D1 Rashi chart with Ascendant, MC, and 9 Navagrahas', () => {
    const normalized = calculationService.normalizeBirthData(rawInput);
    const d1 = calculateD1RashiChart(normalized, settings);

    expect(d1.chartId).toBe('D1');
    expect(d1.ascendant).toBeDefined();
    expect(d1.ascendant.zodiacSign).toBeTruthy();
    expect(d1.ascendant.dms).toMatch(/^\d+° \d{2}' \d{2}"$/);
    expect(d1.ascendant.nakshatra).toBeTruthy();
    expect(d1.ascendant.pada).toBeGreaterThanOrEqual(1);
    expect(d1.ascendant.pada).toBeLessThanOrEqual(4);

    // MC must exist
    expect(d1.mc).toBeDefined();
    expect(d1.mc?.zodiacSign).toBeTruthy();

    // 9 Planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
    const expectedGrahas = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'];
    expectedGrahas.forEach(name => {
      const p = d1.planets.find(pl => pl.name === name);
      expect(p).toBeDefined();
      expect(p?.tropicalLongitude).toBeGreaterThanOrEqual(0);
      expect(p?.tropicalLongitude).toBeLessThan(360);
      expect(p?.siderealLongitude).toBeGreaterThanOrEqual(0);
      expect(p?.siderealLongitude).toBeLessThan(360);
      expect(p?.zodiacSign).toBeTruthy();
      expect(p?.degree).toBeGreaterThanOrEqual(0);
      expect(p?.degree).toBeLessThan(30);
      expect(p?.minutes).toBeGreaterThanOrEqual(0);
      expect(p?.minutes).toBeLessThan(60);
      expect(p?.seconds).toBeGreaterThanOrEqual(0);
      expect(p?.seconds).toBeLessThan(60);
      expect(p?.house).toBeGreaterThanOrEqual(1);
      expect(p?.house).toBeLessThanOrEqual(12);
      expect(typeof p?.isRetrograde).toBe('boolean');
      expect(typeof p?.isCombust).toBe('boolean');
      expect(p?.nakshatra).toBeTruthy();
      expect(p?.pada).toBeGreaterThanOrEqual(1);
      expect(p?.pada).toBeLessThanOrEqual(4);
      expect(p?.nakshatraLord).toBeTruthy();
    });

    // 12 Houses
    expect(d1.houses.length).toBe(12);
    for (let h = 1; h <= 12; h++) {
      const house = d1.houses.find(hs => hs.houseNumber === h);
      expect(house).toBeDefined();
      expect(house?.lord).toBeTruthy();
    }
  });

  it('guarantees deterministic reproducibility: identical inputs produce exact same positions', () => {
    const norm1 = calculationService.normalizeBirthData(rawInput);
    const chart1 = calculateD1RashiChart(norm1, settings);

    const norm2 = calculationService.normalizeBirthData(rawInput);
    const chart2 = calculateD1RashiChart(norm2, settings);

    expect(chart1.ascendant.siderealLongitude).toBe(chart2.ascendant.siderealLongitude);
    expect(chart1.ascendant.dms).toBe(chart2.ascendant.dms);

    chart1.planets.forEach((p1, idx) => {
      const p2 = chart2.planets[idx];
      expect(p1.name).toBe(p2.name);
      expect(p1.siderealLongitude).toBe(p2.siderealLongitude);
      expect(p1.degree).toBe(p2.degree);
      expect(p1.minutes).toBe(p2.minutes);
      expect(p1.seconds).toBe(p2.seconds);
      expect(p1.house).toBe(p2.house);
      expect(p1.isRetrograde).toBe(p2.isRetrograde);
      expect(p1.isCombust).toBe(p2.isCombust);
    });
  });
});
