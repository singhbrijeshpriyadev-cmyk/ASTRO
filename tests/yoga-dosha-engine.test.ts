import { describe, it, expect } from 'vitest';
import { evaluateAllYogas } from '@/lib/yoga/evaluators';
import { evaluateAllDoshas } from '@/lib/dosha/evaluators';
import { YogaEngineInput } from '@/lib/yoga/types';
import { DoshaEngineInput } from '@/lib/dosha/types';

describe('Vedic Yoga & Dosha Deterministic Engine', () => {
  it('detects Budhaditya Yoga with combustion check', () => {
    // Sun and Mercury in Aries (house 1), orb 6 degrees
    const input: YogaEngineInput = {
      lagnaRashiNumber: 1,
      planets: [
        { name: 'Surya', rashiNumber: 1, degreeInRashi: 10, house: 1, dignity: 'Exalted', isRetrograde: false, isCombust: false },
        { name: 'Budha', rashiNumber: 1, degreeInRashi: 16, house: 1, dignity: 'Friend', isRetrograde: false, isCombust: false },
      ],
    };

    const yogas = evaluateAllYogas(input);
    const budhaditya = yogas.find(y => y.id === 'budhaditya');
    expect(budhaditya).toBeDefined();
    expect(budhaditya?.strength).toBe('Dominant');
    expect(budhaditya?.satisfiedConditions.length).toBe(3);
    expect(budhaditya?.isCancelled).toBe(false);
  });

  it('detects Gaja Kesari Yoga when Jupiter is in Kendra from Moon', () => {
    // Moon in Taurus (house 2), Jupiter in Leo (house 5 -> 4th from Moon)
    const input: YogaEngineInput = {
      lagnaRashiNumber: 1,
      planets: [
        { name: 'Chandra', rashiNumber: 2, degreeInRashi: 15, house: 2, dignity: 'Exalted', isRetrograde: false, isCombust: false },
        { name: 'Guru', rashiNumber: 5, degreeInRashi: 12, house: 5, dignity: 'Friend', isRetrograde: false, isCombust: false },
      ],
    };

    const yogas = evaluateAllYogas(input);
    const gajakesari = yogas.find(y => y.id === 'gaja_kesari');
    expect(gajakesari).toBeDefined();
    expect(gajakesari?.affectedPlanets).toContain('Guru');
    expect(gajakesari?.affectedPlanets).toContain('Chandra');
    expect(gajakesari?.isCancelled).toBe(false);
  });

  it('evaluates Pancha Mahapurusha Yoga (Hamsa Yoga) with D9 validation', () => {
    // Jupiter in Cancer (Exalted) in 4th house (Kendra), non-combust
    const input: YogaEngineInput = {
      lagnaRashiNumber: 1,
      planets: [
        { name: 'Guru', rashiNumber: 4, degreeInRashi: 5, house: 4, dignity: 'Exalted', isRetrograde: false, isCombust: false, d9Dignity: 'Own Sign' },
      ],
    };

    const yogas = evaluateAllYogas(input);
    const hamsa = yogas.find(y => y.id === 'mahapurusha_guru');
    expect(hamsa).toBeDefined();
    expect(hamsa?.name).toBe('Hamsa Yoga');
    expect(hamsa?.strength).toBe('Dominant');
  });

  it('detects Vipareeta Raja Yoga and validates contamination rule', () => {
    // Mars as 8th lord (for Aries Lagna) in 6th house (Virgo), uncontaminated
    const inputUncontaminated: YogaEngineInput = {
      lagnaRashiNumber: 1,
      planets: [
        { name: 'Mangala', rashiNumber: 6, degreeInRashi: 10, house: 6, dignity: 'Enemy', isRetrograde: false, isCombust: false },
        { name: 'Surya', rashiNumber: 1, degreeInRashi: 10, house: 1, dignity: 'Exalted', isRetrograde: false, isCombust: false },
      ],
    };

    const yogas = evaluateAllYogas(inputUncontaminated);
    const sarala = yogas.find(y => y.id === 'vipareeta_8');
    expect(sarala).toBeDefined();
    expect(sarala?.isCancelled).toBe(false);
  });

  it('evaluates Manglik Dosha and detects cancellation when Mars in Aries in 1st house', () => {
    const input: DoshaEngineInput = {
      lagnaRashiNumber: 1,
      moonRashiNumber: 4,
      venusRashiNumber: 7,
      planets: [
        { name: 'Mangala', rashiNumber: 1, degreeInRashi: 15, house: 1, dignity: 'Own Sign', isRetrograde: false, isCombust: false },
      ],
    };

    const doshas = evaluateAllDoshas(input);
    const manglik = doshas.find(d => d.id === 'manglik_dosha');
    expect(manglik).toBeDefined();
    expect(manglik?.isCancelled).toBe(true);
    expect(manglik?.strength).toBe('Cancelled');
    expect(manglik?.cancellationFactors.find(c => c.factor.includes('Aries in 1st House'))?.isApplied).toBe(true);
  });

  it('evaluates Kemadruma Dosha and detects Kemadruma Bhanga', () => {
    // Moon in Gemini (house 3), no planets in Taurus (h2 from Moon) or Cancer (h12 from Moon),
    // but Jupiter in Aries in 1st house (Kendra from Lagna) -> Kemadruma Bhanga!
    const input: DoshaEngineInput = {
      lagnaRashiNumber: 1,
      moonRashiNumber: 3,
      venusRashiNumber: 5,
      planets: [
        { name: 'Chandra', rashiNumber: 3, degreeInRashi: 10, house: 3, dignity: 'Neutral', isRetrograde: false, isCombust: false },
        { name: 'Guru', rashiNumber: 1, degreeInRashi: 15, house: 1, dignity: 'Friend', isRetrograde: false, isCombust: false },
      ],
    };

    const doshas = evaluateAllDoshas(input);
    const kemadruma = doshas.find(d => d.id === 'kemadruma_dosha');
    expect(kemadruma).toBeDefined();
    expect(kemadruma?.isCancelled).toBe(true);
    expect(kemadruma?.name).toContain('Bhanga');
  });

  it('evaluates Guru Chandal Dosha with Swakshetra cancellation', () => {
    // Jupiter in Sagittarius (Own Sign) with Rahu
    const input: DoshaEngineInput = {
      lagnaRashiNumber: 1,
      moonRashiNumber: 3,
      venusRashiNumber: 5,
      planets: [
        { name: 'Guru', rashiNumber: 9, degreeInRashi: 12, house: 9, dignity: 'Own Sign', isRetrograde: false, isCombust: false },
        { name: 'Rahu', rashiNumber: 9, degreeInRashi: 22, house: 9, dignity: 'Neutral', isRetrograde: false, isCombust: false },
      ],
    };

    const doshas = evaluateAllDoshas(input);
    const chandal = doshas.find(d => d.id === 'guru_chandal_dosha');
    expect(chandal).toBeDefined();
    expect(chandal?.isCancelled).toBe(true);
    expect(chandal?.polarity).toBe('Mitigated');
  });
});
