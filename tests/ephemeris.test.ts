import { describe, it, expect } from 'vitest';
import { defaultEphemerisProvider } from '../lib/ephemeris/astronomical';
import { calculateKundali } from '../lib/astrology/kundali';

describe('Astronomical Ephemeris & Kundali Engine', () => {
  it('calculates astronomical coordinates for benchmark birth chart', () => {
    // Benchmark: 2000-01-01, 12:00 UTC at Greenwich (lat 51.4769, lon 0.0)
    const result = defaultEphemerisProvider.calculate(
      new Date('2000-01-01T12:00:00Z'),
      51.4769,
      0.0,
      'Lahiri'
    );

    expect(result.julianDay).toBeCloseTo(2451545.0, 1);
    
    // Tropical Sun should be at approx 280° (Capricorn ~10°)
    const sun = result.coordinates.find(c => c.name === 'Surya')!;
    expect(sun.tropicalLongitude).toBeGreaterThan(279);
    expect(sun.tropicalLongitude).toBeLessThan(282);

    // Rahu & Ketu should be exactly 180° apart
    const rahu = result.coordinates.find(c => c.name === 'Rahu')!;
    const ketu = result.coordinates.find(c => c.name === 'Ketu')!;
    const diff = Math.abs((rahu.tropicalLongitude - ketu.tropicalLongitude + 360) % 360);
    expect(diff).toBeCloseTo(180, 4);
  });

  it('computes complete Kundali with all 12 bhavas, 9 planets, vargas, and panchang', () => {
    const kundali = calculateKundali({
      name: 'Benchmark Chart',
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5,
      locationName: 'New Delhi, India',
    });

    expect(kundali.bhavas.length).toBe(12);
    expect(kundali.planets.length).toBe(12); // 9 Vedic + 3 Outer
    expect(kundali.panchang.tithi.name).toBeTruthy();
    expect(kundali.panchang.nakshatra.name).toBeTruthy();
    expect(kundali.vargas['D9']).toBeDefined();
    expect(kundali.vargas['D10']).toBeDefined();
    expect(kundali.dashas.length).toBeGreaterThan(0);
  });
});
