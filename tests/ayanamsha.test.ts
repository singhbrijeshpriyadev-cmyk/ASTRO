import { describe, it, expect } from 'vitest';
import { calculateLahiriAyanamsha, calculateKPAyanamsha, calculateRamanAyanamsha } from '../lib/ephemeris/ayanamsha';

describe('Ayanamsha Engine', () => {
  it('calculates Lahiri Ayanamsha for epoch J2000.0 with high precision', () => {
    const jd2000 = 2451545.0; // 2000 Jan 1.5
    const lahiri = calculateLahiriAyanamsha(jd2000);
    // Standard J2000 Lahiri is 23° 51' 25.53" = 23.85709167°
    expect(lahiri).toBeCloseTo(23.8571, 3);
  });

  it('calculates precession delta over 20 years correctly (~16 arcminutes)', () => {
    const jd2000 = 2451545.0;
    const jd2020 = jd2000 + 20 * 365.25;
    const lahiri2000 = calculateLahiriAyanamsha(jd2000);
    const lahiri2020 = calculateLahiriAyanamsha(jd2020);
    
    // In 20 years precession is ~ 20 * 50.29" = 1005.8" = ~0.2794°
    const diff = lahiri2020 - lahiri2000;
    expect(diff).toBeGreaterThan(0.27);
    expect(diff).toBeLessThan(0.29);
  });

  it('verifies KP and Raman relative offsets', () => {
    const jd = 2451545.0;
    const lahiri = calculateLahiriAyanamsha(jd);
    const kp = calculateKPAyanamsha(jd);
    const raman = calculateRamanAyanamsha(jd);

    expect(kp).toBeLessThan(lahiri);
    expect(raman).toBeLessThan(lahiri);
  });
});
