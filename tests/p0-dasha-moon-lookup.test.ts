import { describe, it, expect } from 'vitest';
import { calculateKundali } from '../lib/astrology/kundali';
import { calculateD1RashiChart } from '../lib/astrology/d1-engine';
import { calculatePrecisionVimshottari } from '../lib/dasha/precision-vimshottari';

describe('Regression BUG-RC02 & BUG-RC04: Dasha Moon Lookup & Ascendant Identity', () => {
  it('BUG-RC04: Lagna must have identity name Lagna and planet Ascendant, NOT Surya', () => {
    const kundali = calculateKundali({
      name: 'Test Native',
      year: 1995,
      month: 10,
      day: 24,
      hour: 8,
      minute: 30,
      second: 0,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5,
      locationName: 'New Delhi',
      ayanamshaSystem: 'Lahiri',
    });

    expect(kundali.ascendant.name).toBe('Lagna');
    expect(kundali.ascendant.planet).toBe('Ascendant');
    expect(kundali.ascendant.englishName).toBe('Ascendant (Lagna)');

    // Ensure Surya searches only return the Sun
    const suryaPlanets = kundali.planets.filter(p => p.name === 'Surya');
    expect(suryaPlanets.length).toBe(1);
    expect(suryaPlanets[0].planet).toBe('Sun');
  });

  it('BUG-RC02: Kundali planets must have standardized English planet keys matching d1-engine', () => {
    const kundali = calculateKundali({
      name: 'Test Native',
      year: 1995,
      month: 10,
      day: 24,
      hour: 8,
      minute: 30,
      second: 0,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5,
      locationName: 'New Delhi',
      ayanamshaSystem: 'Lahiri',
    });

    const moon = kundali.planets.find(p => p.planet === 'Moon');
    expect(moon).toBeDefined();
    expect(moon?.name).toBe('Chandra');
    expect(moon?.englishName).toBe('Moon');

    const sun = kundali.planets.find(p => p.planet === 'Sun');
    expect(sun).toBeDefined();
    expect(sun?.name).toBe('Surya');
    expect(sun?.englishName).toBe('Sun');

    const jupiter = kundali.planets.find(p => p.planet === 'Jupiter');
    expect(jupiter).toBeDefined();
    expect(jupiter?.name).toBe('Guru');
  });

  it('BUG-RC02: Dasha timeline must NEVER silently fall back to 125.5° (Magha/Ketu)', () => {
    // 1995-10-24 08:30 IST New Delhi Moon is in Swati (Libra ~186°), Lord Rahu
    const kundali = calculateKundali({
      name: 'Test Native',
      year: 1995,
      month: 10,
      day: 24,
      hour: 8,
      minute: 30,
      second: 0,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5,
      locationName: 'New Delhi',
      ayanamshaSystem: 'Lahiri',
    });

    const moonPlanet = kundali.planets.find(p => p.planet === 'Moon' || p.name === 'Chandra');
    expect(moonPlanet).toBeDefined();
    const actualMoonLon = moonPlanet!.siderealLongitude;

    // Actual Moon longitude must not be the fallback 125.5°
    expect(actualMoonLon).not.toBeCloseTo(125.5, 1);

    const birthDate = new Date('1995-10-24T03:00:00.000Z');
    const timeline = calculatePrecisionVimshottari(birthDate, actualMoonLon);

    // 1995-10-24 08:30 IST Moon is at ~183° (Chitra nakshatra, Lord: Mangala/Mars)
    expect(timeline.balanceAtBirth.startingLord).toBe('Mangala');
    expect(timeline.mahadashas[0].planet).toBe('Mangala');

    // If it had fallen back to 125.5° (Magha), it would have been Ketu!
    expect(timeline.balanceAtBirth.startingLord).not.toBe('Ketu');
  });
});
