import { describe, it, expect } from 'vitest';
import { generateCompleteCalculationAudit } from '../lib/audit/calculation-audit';
import { calculateD1RashiChart } from '../lib/astrology/d1-engine';
import { NormalizedBirthData, CalculationSettings } from '@/types/astrology';

describe('Complete 35-Step Astrology Calculation Audit Suite', () => {
  const mockNormalized: NormalizedBirthData = {
    rawInput: {
      name: 'Audit Test Subject',
      birthLocalDate: '1995-10-24',
      birthLocalTime: '08:30:00',
      birthPlace: 'Ujjain, Madhya Pradesh, India',
      latitude: 23.1765,
      longitude: 75.7885,
      timezone: 'Asia/Kolkata',
    },
    resolvedPlace: {
      name: 'Ujjain, Madhya Pradesh',
      country: 'India',
      latitude: 23.1765,
      longitude: 75.7885,
    },
    birthLocalDate: '1995-10-24',
    birthLocalTime: '08:30:00',
    latitude: 23.1765,
    longitude: 75.7885,
    timezone: 'Asia/Kolkata',
    utcOffset: 5.5,
    birthUTC: '1995-10-24T03:00:00.000Z',
    julianDay: 2450014.625,
    isHistoricalOffsetApplied: false,
  };

  const mockSettings: CalculationSettings = {
    ayanamsha: 'Lahiri',
    houseSystem: 'whole-sign',
    nodeType: 'true',
    zodiac: 'sidereal',
    ephemeris: 'VSOP87 / ELP2000 Analytic Series',
    calculationVersion: '1.0.0',
  };

  const chart = calculateD1RashiChart(mockNormalized, mockSettings);
  const auditReport = generateCompleteCalculationAudit(chart, mockNormalized, mockSettings);

  it('should generate all 35 calculation steps without omissions', () => {
    expect(auditReport.steps.length).toBe(35);
    for (let i = 1; i <= 35; i++) {
      const step = auditReport.steps.find(s => s.stepNumber === i);
      expect(step).toBeDefined();
      expect(step?.name).toBeTruthy();
      expect(step?.input).toBeTruthy();
      expect(step?.formulaOrRule).toBeTruthy();
      expect(step?.output).toBeTruthy();
      expect(step?.traditionOrStandard).toBeTruthy();
    }
  });

  it('should verify Step 1 to Step 3: Timezone, UTC, and Julian Day conversion', () => {
    const s1 = auditReport.steps.find(s => s.stepNumber === 1)!;
    expect(s1.output).toContain('+5.5h');

    const s2 = auditReport.steps.find(s => s.stepNumber === 2)!;
    expect(s2.output).toContain('1995-10-24T03:00:00.000Z');

    const s3 = auditReport.steps.find(s => s.stepNumber === 3)!;
    expect(s3.output).toContain('JD: 2450014.625000');
  });

  it('should verify Step 4 to Step 6: Ephemeris, Sidereal conversion, and Ayanamsha', () => {
    const s4 = auditReport.steps.find(s => s.stepNumber === 4)!;
    expect(s4.output).toContain('VSOP87/ELP2000');

    const s5 = auditReport.steps.find(s => s.stepNumber === 5)!;
    expect(s5.formulaOrRule).toContain('λ_sidereal = (λ_tropical - Ayanamsha) mod 360°');

    const s6 = auditReport.steps.find(s => s.stepNumber === 6)!;
    expect(s6.output).toContain('Lahiri Ayanamsha');
    expect(s6.formulaOrRule).toContain('23.85709167');
  });

  it('should verify Step 7 to Step 13: Celestial coordinates, Retrograde, Rahu/Ketu, Lagna, Houses, Nakshatra, Pada', () => {
    const s7 = auditReport.steps.find(s => s.stepNumber === 7)!;
    expect(s7.output).toContain('Calculated for all 9 Grahas');

    const s8 = auditReport.steps.find(s => s.stepNumber === 8)!;
    expect(s8.formulaOrRule).toContain('Speed (dλ/dt)');

    const s9 = auditReport.steps.find(s => s.stepNumber === 9)!;
    expect(s9.input).toContain('TRUE Node');
    expect(s9.formulaOrRule).toContain('Rahu');

    const s10 = auditReport.steps.find(s => s.stepNumber === 10)!;
    expect(s10.name).toBe('Ascendant');
    expect(s10.output).toContain('Lagna in');

    const s11 = auditReport.steps.find(s => s.stepNumber === 11)!;
    expect(s11.name).toBe('Houses');
    expect(s11.input).toContain('whole-sign');

    const s12 = auditReport.steps.find(s => s.stepNumber === 12)!;
    expect(s12.name).toBe('Nakshatra');
    expect(s12.formulaOrRule).toContain('13° 20\'');

    const s13 = auditReport.steps.find(s => s.stepNumber === 13)!;
    expect(s13.name).toBe('Pada');
    expect(s13.formulaOrRule).toContain('3.333333°');
  });

  it('should verify Step 14 to Step 31: All 18 Divisional Charts (D1 through D60)', () => {
    const vargaSteps = auditReport.steps.filter(s => s.category === 'Divisional Harmonics (Vargas)');
    expect(vargaSteps.length).toBe(18); // D1, D2, D3, D4, D5, D6, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60

    const d9 = vargaSteps.find(s => s.name === 'D9 (Navamsha)')!;
    expect(d9.output).toContain('Computed D9 chart');
    expect(d9.formulaOrRule).toContain('Fire signs start Aries');

    const d10 = vargaSteps.find(s => s.name === 'D10 (Dasamsha)')!;
    expect(d10.output).toContain('Computed D10 chart');

    const d60 = vargaSteps.find(s => s.name === 'D60 (Shashtiamsha)')!;
    expect(d60.output).toContain('Computed D60 chart');
  });

  it('should verify Step 32 to Step 35: Vimshottari Dasha, Yogas, Doshas, and Planetary Strength', () => {
    const s32 = auditReport.steps.find(s => s.stepNumber === 32)!;
    expect(s32.name).toBe('Vimshottari Dasha');
    expect(s32.output).toContain('Active Period');

    const s33 = auditReport.steps.find(s => s.stepNumber === 33)!;
    expect(s33.name).toBe('Yoga rules');
    expect(s33.output).toContain('classical yogas detected');

    const s34 = auditReport.steps.find(s => s.stepNumber === 34)!;
    expect(s34.name).toBe('Dosha rules');
    expect(s34.formulaOrRule).toContain('8 Manglik cancellations');

    const s35 = auditReport.steps.find(s => s.stepNumber === 35)!;
    expect(s35.name).toBe('Planetary strength');
    expect(s35.formulaOrRule).toContain('Compound Relationship = Natural Friendship');
  });

  it('should generate detailed per-planet calculation audits matching the requested expert inspector fields', () => {
    expect(auditReport.planetAudits.length).toBe(chart.planets.length);

    const jupiter = auditReport.planetAudits.find(p => p.planet === 'Jupiter' || p.planet === 'Guru')!;
    expect(jupiter).toBeDefined();

    // Verify all requested inspector fields are populated
    expect(jupiter.utcDate).toBe('1995-10-24T03:00:00.000Z');
    expect(jupiter.julianDay).toBe('2450014.625000');
    expect(jupiter.tropicalLongitude).toBeTruthy();
    expect(jupiter.ayanamshaValue).toBeTruthy();
    expect(jupiter.siderealLongitude).toBeTruthy();
    expect(jupiter.rashi).toBeTruthy();
    expect(jupiter.degreeInRashi).toBeTruthy();
    expect(jupiter.nakshatra).toBeTruthy();
    expect(jupiter.pada).toBeGreaterThanOrEqual(1);
    expect(jupiter.pada).toBeLessThanOrEqual(4);
    expect(jupiter.house).toBeGreaterThanOrEqual(1);
    expect(jupiter.house).toBeLessThanOrEqual(12);
    expect(jupiter.d9Placement).toBeTruthy();
    expect(jupiter.d10Placement).toBeTruthy();

    // Verify traceable mathematical formulas
    expect(jupiter.traceableFormulas.tropicalFormula).toContain('VSOP87');
    expect(jupiter.traceableFormulas.siderealFormula).toContain('mod 360°');
    expect(jupiter.traceableFormulas.rashiFormula).toContain('Sign #');
    expect(jupiter.traceableFormulas.nakshatraFormula).toContain('Nakshatra #');
    expect(jupiter.traceableFormulas.padaFormula).toContain('Pada');
  });

  it('should transparently document configurable traditions and discrepancies', () => {
    expect(auditReport.traditionVariations.length).toBeGreaterThanOrEqual(5);
    const ayanVar = auditReport.traditionVariations.find(v => v.parameter.includes('Ayanamsha'))!;
    expect(ayanVar.alternativeTraditions).toContain('Krishnamurti (KP)');
    expect(ayanVar.technicalRationale).toContain('Spica');
  });
});
