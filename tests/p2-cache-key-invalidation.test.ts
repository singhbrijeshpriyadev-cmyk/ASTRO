import { describe, it, expect, beforeEach } from 'vitest';
import { calculationService } from '../server/calculation-service';

describe('Regression BUG-RC07: Settings-Aware Cache Invalidation', () => {
  beforeEach(() => {
    calculationService.clearCache();
  });

  const baseInput = {
    name: 'Cache Test Native',
    birthLocalDate: '1988-08-18',
    birthLocalTime: '12:00:00',
    birthPlace: 'Ujjain',
    latitude: 23.1765,
    longitude: 75.7885,
    timezone: 'Asia/Kolkata',
  };

  it('generates distinct cache keys when calculation settings change', () => {
    const key1 = calculationService.getCacheKey(baseInput, {
      zodiac: 'sidereal',
      ayanamsha: 'Lahiri',
      nodeType: 'true',
      houseSystem: 'whole-sign',
      ephemeris: 'VSOP87',
    });

    const keyNodeChange = calculationService.getCacheKey(baseInput, {
      zodiac: 'sidereal',
      ayanamsha: 'Lahiri',
      nodeType: 'mean',
      houseSystem: 'whole-sign',
      ephemeris: 'VSOP87',
    });

    const keyHouseChange = calculationService.getCacheKey(baseInput, {
      zodiac: 'sidereal',
      ayanamsha: 'Lahiri',
      nodeType: 'true',
      houseSystem: 'equal-house',
      ephemeris: 'VSOP87',
    });

    const keyAyanamshaChange = calculationService.getCacheKey(baseInput, {
      zodiac: 'sidereal',
      ayanamsha: 'Raman',
      nodeType: 'true',
      houseSystem: 'whole-sign',
      ephemeris: 'VSOP87',
    });

    expect(key1).not.toBe(keyNodeChange);
    expect(key1).not.toBe(keyHouseChange);
    expect(key1).not.toBe(keyAyanamshaChange);
  });

  it('serves fresh results when nodeType or houseSystem is toggled', async () => {
    const res1 = await calculationService.computeKundali({
      ...baseInput,
      nodeType: 'true',
      houseSystem: 'whole-sign',
    });

    const res2 = await calculationService.computeKundali({
      ...baseInput,
      nodeType: 'mean',
      houseSystem: 'whole-sign',
    });

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
    if (!res1.success || !res1.data || !res2.success || !res2.data) throw new Error('Calculation failed');

    const rahu1 = res1.data.planets.find(p => p.planet === 'Rahu')!;
    const rahu2 = res2.data.planets.find(p => p.planet === 'Rahu')!;

    // True vs Mean must not return the exact same cached floating point value
    expect(rahu1.siderealLongitude).not.toEqual(rahu2.siderealLongitude);
  });
});
