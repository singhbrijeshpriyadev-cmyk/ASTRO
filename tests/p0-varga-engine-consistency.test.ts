import { describe, it, expect } from 'vitest';
import { computeVargaChart, VargaEngineInput } from '../lib/varga/engine';
import { ALL_VARGAS } from '../lib/varga/registry';
import { calculateKundali } from '../lib/astrology/kundali';

describe('Regression BUG-RC05 & BUG-RC08: Varga Engine Consistency & Precision Ascendant', () => {
  const testInput: VargaEngineInput = {
    ascendantSiderealLon: 298.54321, // Makara ~28° 32' 35.5"
    planets: [
      { name: 'Surya', siderealLongitude: 14.25, symbol: '☉', sanskrit: 'सूर्य', d1Rashi: 'Mesha' },
      { name: 'Chandra', siderealLongitude: 183.45, symbol: '☽', sanskrit: 'चन्द्र', d1Rashi: 'Tula' },
      { name: 'Mangala', siderealLongitude: 135.2, symbol: '♂', sanskrit: 'मङ्गल', d1Rashi: 'Simha' },
      { name: 'Budha', siderealLongitude: 24.8, symbol: '☿', sanskrit: 'बुध', d1Rashi: 'Mesha' },
      { name: 'Guru', siderealLongitude: 245.6, symbol: '♃', sanskrit: 'गुरु', d1Rashi: 'Dhanu' },
      { name: 'Shukra', siderealLongitude: 45.1, symbol: '♀', sanskrit: 'शुक्र', d1Rashi: 'Vrishabha' },
      { name: 'Shani', siderealLongitude: 312.9, symbol: '♄', sanskrit: 'शनि', d1Rashi: 'Kumbha' },
      { name: 'Rahu', siderealLongitude: 195.4, symbol: '☊', sanskrit: 'राहु', d1Rashi: 'Tula' },
      { name: 'Ketu', siderealLongitude: 15.4, symbol: '☋', sanskrit: 'केतु', d1Rashi: 'Mesha' },
    ],
  };

  it('BUG-RC05: All 18 classical Vargas calculate valid ascendants and 9 planetary placements', () => {
    const vargaIds = Object.keys(ALL_VARGAS);
    expect(vargaIds.length).toBe(18);

    vargaIds.forEach(vId => {
      const result = computeVargaChart(vId, testInput);

      expect(result.ascendant.rashiNumber).toBeGreaterThanOrEqual(1);
      expect(result.ascendant.rashiNumber).toBeLessThanOrEqual(12);

      testInput.planets.forEach(p => {
        const pos = result.positions[p.name];
        expect(pos).toBeDefined();
        expect(pos.vargaRashiNumber).toBeGreaterThanOrEqual(1);
        expect(pos.vargaRashiNumber).toBeLessThanOrEqual(12);
        expect(pos.house).toBeGreaterThanOrEqual(1);
        expect(pos.house).toBeLessThanOrEqual(12);

        // House must be relative to the varga ascendant
        const expectedHouse = ((pos.vargaRashiNumber - result.ascendant.rashiNumber + 12) % 12) + 1;
        expect(pos.house).toBe(expectedHouse);
      });
    });
  });

  it('BUG-RC08: D60 and D45 high sensitivity does not truncate sub-second precision', () => {
    // 0.499° vs 0.501° in Aries (Mesha)
    // In D60 (0.5° per division), 0.499° is division 0 (Aries) while 0.501° is division 1 (Taurus)
    const d60Def = ALL_VARGAS['D60'];
    const p1 = d60Def.calculate(0.499);
    const p2 = d60Def.calculate(0.501);

    expect(p1.rashi).toBe('Mesha');
    expect(p1.rashiNumber).toBe(1);

    expect(p2.rashi).toBe('Vrishabha');
    expect(p2.rashiNumber).toBe(2);

    // Verify Kundali ascendant carries exact siderealLongitude
    const kundali = calculateKundali({
      name: 'Precision Test',
      year: 1995,
      month: 10,
      day: 24,
      hour: 8,
      minute: 30,
      second: 15,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5,
      locationName: 'New Delhi',
      ayanamshaSystem: 'Lahiri',
    });

    expect(kundali.ascendant.siderealLongitude).toBeDefined();
    expect(typeof kundali.ascendant.siderealLongitude).toBe('number');
    // Ensure fractional seconds are not truncated in kundali.ascendant.siderealLongitude
    const reconstructed = (kundali.ascendant.rashiNumber - 1) * 30 + kundali.ascendant.degree + kundali.ascendant.minutes / 60 + kundali.ascendant.seconds / 3600;
    expect(kundali.ascendant.siderealLongitude).toBeCloseTo(reconstructed, 2);
  });
});
