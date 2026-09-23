import { describe, it, expect } from 'vitest';
import { calculateKundali } from '../lib/astrology/kundali';
import { evaluateAllYogas } from '../lib/yoga/evaluators';
import { evaluateAllDoshas } from '../lib/dosha/evaluators';

describe('Regression BUG-RC06: Yoga & Dosha Count Synchronization', () => {
  it('kundali.yogas matches evaluateAllYogas and evaluateAllDoshas output', () => {
    const kundali = calculateKundali({
      name: 'Yoga Test Native',
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

    const yogaInput = {
      planets: kundali.planets,
      lagnaRashiNumber: kundali.ascendant.rashiNumber,
      houses: kundali.bhavas,
    };

    const directYogas = evaluateAllYogas(yogaInput);
    const directDoshas = evaluateAllDoshas(yogaInput);

    expect(kundali.yogas.length).toBe(directYogas.length + directDoshas.length);

    directYogas.forEach(dy => {
      const match = kundali.yogas.find(y => y.name === dy.name);
      expect(match).toBeDefined();
      expect(match?.sanskritName).toBe(dy.sanskritName);
      expect(match?.planetsInvolved).toEqual(dy.affectedPlanets);
    });

    directDoshas.forEach(dd => {
      const match = kundali.yogas.find(y => y.name === dd.name);
      expect(match).toBeDefined();
      expect(match?.sanskritName).toBe(dd.sanskritName);
      expect(match?.category).toBe('Dosha');
    });
  });
});
