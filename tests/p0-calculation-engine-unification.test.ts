import { describe, it, expect } from 'vitest';
import { calculationService } from '../server/calculation-service';

describe('Regression BUG-RC01 & BUG-RC03: Dual Engine Unification & Lunar Node', () => {
  it('BUG-RC01: data.planets and data.chartData.planets must be identical', async () => {
    const payload = {
      name: 'Unification Test',
      birthLocalDate: '1990-05-15',
      birthLocalTime: '14:30:00',
      birthPlace: 'Varanasi',
      latitude: 25.3176,
      longitude: 82.9739,
      timezone: 'Asia/Kolkata',
      ayanamshaSystem: 'Lahiri',
      nodeType: 'true',
      houseSystem: 'whole-sign',
    };

    const res = await calculationService.computeKundali(payload);
    expect(res.success).toBe(true);
    if (!res.success || !res.data) throw new Error('Calculation failed');

    const data = res.data;
    expect(data.planets.length).toBe(data.chartData.planets.length);

    data.planets.forEach((p, idx) => {
      const chartP = data.chartData.planets[idx];
      expect(p.planet).toBe(chartP.planet);
      expect(p.name).toBe(chartP.name);
      expect(p.siderealLongitude).toBeCloseTo(chartP.siderealLongitude, 5);
      expect(p.rashiNumber).toBe(chartP.rashiNumber);
      expect(p.degree).toBe(chartP.degree);
      expect(p.minutes).toBe(chartP.minutes);
      expect(p.seconds).toBe(chartP.seconds);
      expect(p.house).toBe(chartP.house);
    });

    // Ascendant identity
    expect(data.ascendant.name).toBe('Lagna');
    expect(data.ascendant.planet).toBe('Ascendant');
    expect(data.ascendant.siderealLongitude).toBeCloseTo(data.chartData.ascendant.siderealLongitude || data.chartData.ascendant.longitude, 5);

    // House cusps
    expect(data.bhavas.length).toBe(12);
    expect(data.chartData.houses.length).toBe(12);
    data.bhavas.forEach((b, idx) => {
      const chartH = data.chartData.houses[idx];
      expect(b.houseNumber).toBe(chartH.houseNumber);
      expect(b.cuspLongitude).toBeCloseTo(chartH.cuspLongitude, 5);
      expect(b.rashiNumber).toBe(chartH.rashiNumber);
    });
  });

  it('BUG-RC03: True Node vs Mean Node produces consistent perturbation in both data.planets and chartData.planets', async () => {
    const basePayload = {
      name: 'Node Test',
      birthLocalDate: '1990-05-15',
      birthLocalTime: '14:30:00',
      birthPlace: 'Varanasi',
      latitude: 25.3176,
      longitude: 82.9739,
      timezone: 'Asia/Kolkata',
      ayanamshaSystem: 'Lahiri',
      houseSystem: 'whole-sign',
    };

    const resMean = await calculationService.computeKundali({ ...basePayload, nodeType: 'mean' });
    const resTrue = await calculationService.computeKundali({ ...basePayload, nodeType: 'true' });

    expect(resMean.success).toBe(true);
    expect(resTrue.success).toBe(true);
    if (!resMean.success || !resMean.data || !resTrue.success || !resTrue.data) throw new Error('Calculation failed');

    const rahuMean = resMean.data.planets.find(p => p.planet === 'Rahu')!;
    const rahuTrue = resTrue.data.planets.find(p => p.planet === 'Rahu')!;

    const rahuChartMean = resMean.data.chartData.planets.find(p => p.planet === 'Rahu')!;
    const rahuChartTrue = resTrue.data.chartData.planets.find(p => p.planet === 'Rahu')!;

    // In both representations, True and Mean Rahu must match their respective counterparts
    expect(rahuMean.siderealLongitude).toBeCloseTo(rahuChartMean.siderealLongitude, 5);
    expect(rahuTrue.siderealLongitude).toBeCloseTo(rahuChartTrue.siderealLongitude, 5);

    // True vs Mean must differ by solar perturbation (up to ~1.26°)
    const nodeDiff = Math.abs(rahuTrue.siderealLongitude - rahuMean.siderealLongitude);
    expect(nodeDiff).toBeGreaterThan(0.01);
    expect(nodeDiff).toBeLessThan(1.5);
  });
});
