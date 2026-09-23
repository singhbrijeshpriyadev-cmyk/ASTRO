import { describe, it, expect } from 'vitest';
import { ALL_VARGAS, VARGA_ORDER } from '../lib/varga/registry';
import { computeVargaChart } from '../lib/varga/engine';
import { D1Definition } from '../lib/varga/d1';
import { D2Definition } from '../lib/varga/d2';
import { D3Definition } from '../lib/varga/d3';
import { D4Definition } from '../lib/varga/d4';
import { D5Definition } from '../lib/varga/d5';
import { D6Definition } from '../lib/varga/d6';
import { D7Definition } from '../lib/varga/d7';
import { D9Definition } from '../lib/varga/d9';
import { D10Definition } from '../lib/varga/d10';
import { D12Definition } from '../lib/varga/d12';
import { D16Definition } from '../lib/varga/d16';
import { D20Definition } from '../lib/varga/d20';
import { D24Definition } from '../lib/varga/d24';
import { D27Definition } from '../lib/varga/d27';
import { D30Definition } from '../lib/varga/d30';
import { D40Definition } from '../lib/varga/d40';
import { D45Definition } from '../lib/varga/d45';
import { D60Definition } from '../lib/varga/d60';

describe('Vedic Divisional Charts (Shodashavarga) Engine', () => {
  // Test 1: Registry Completeness
  it('registers all 18 classical Vargas with complete metadata', () => {
    expect(VARGA_ORDER.length).toBe(18);
    VARGA_ORDER.forEach(vId => {
      const def = ALL_VARGAS[vId];
      expect(def).toBeDefined();
      expect(def.id).toBe(vId);
      expect(def.name).toBeTruthy();
      expect(def.sanskritName).toBeTruthy();
      expect(def.purpose).toBeTruthy();
      expect(def.calculationMethod).toBeTruthy();
      expect(def.signMapping).toBeTruthy();
      expect(def.planetMapping).toBeTruthy();
      expect(def.boundaryRules).toBeTruthy();
      expect(def.traditionalNotes).toBeTruthy();
      expect(typeof def.calculate).toBe('function');
    });
  });

  // Test 2: D1 Rashi
  it('D1 Rashi maps directly to longitude sign', () => {
    expect(D1Definition.calculate(15.0).rashiNumber).toBe(1); // Mesha
    expect(D1Definition.calculate(45.0).rashiNumber).toBe(2); // Vrishabha
  });

  // Test 3: D2 Hora (15° halves in Sun/Leo and Moon/Cancer)
  it('D2 Hora strictly obeys odd/even Parashari solar and lunar halves', () => {
    // Odd sign (Mesha): 0-15° Leo (5), 15-30° Cancer (4)
    expect(D2Definition.calculate(10.0).rashiNumber).toBe(5); // Leo
    expect(D2Definition.calculate(20.0).rashiNumber).toBe(4); // Cancer

    // Even sign (Vrishabha): 0-15° Cancer (4), 15-30° Leo (5)
    expect(D2Definition.calculate(40.0).rashiNumber).toBe(4); // Cancer
    expect(D2Definition.calculate(50.0).rashiNumber).toBe(5); // Leo
  });

  // Test 4: D3 Drekkana (1st, 5th, 9th trinal signs)
  it('D3 Drekkana correctly maps to 1st, 5th, and 9th trinal signs', () => {
    expect(D3Definition.calculate(5.0).rashiNumber).toBe(1); // Mesha (1st)
    expect(D3Definition.calculate(15.0).rashiNumber).toBe(5); // Simha (5th from Mesha)
    expect(D3Definition.calculate(25.0).rashiNumber).toBe(9); // Dhanu (9th from Mesha)
  });

  // Test 5: D4 Chaturthamsha (1st, 4th, 7th, 10th Kendra signs)
  it('D4 Chaturthamsha maps to Kendra signs from source sign', () => {
    expect(D4Definition.calculate(2.0).rashiNumber).toBe(1); // Mesha (1st)
    expect(D4Definition.calculate(8.0).rashiNumber).toBe(4); // Karka (4th)
    expect(D4Definition.calculate(16.0).rashiNumber).toBe(7); // Tula (7th)
    expect(D4Definition.calculate(24.0).rashiNumber).toBe(10); // Makara (10th)
  });

  // Test 6: D5 Panchamsha & D6 Shashtamsha
  it('D5 and D6 calculate odd/even starting polarity accurately', () => {
    // D5: Odd from Aries, Even from Libra
    expect(D5Definition.calculate(3.0).rashiNumber).toBe(1); // Aries
    expect(D5Definition.calculate(33.0).rashiNumber).toBe(7); // Libra

    // D6: Odd from Aries, Even from Libra
    expect(D6Definition.calculate(2.0).rashiNumber).toBe(1); // Aries
    expect(D6Definition.calculate(32.0).rashiNumber).toBe(7); // Libra
  });

  // Test 7: D7 Saptamsha (Odd: same sign; Even: 7th sign)
  it('D7 Saptamsha maps odd from sign itself and even from 7th sign', () => {
    expect(D7Definition.calculate(2.0).rashiNumber).toBe(1); // Mesha
    expect(D7Definition.calculate(32.0).rashiNumber).toBe(8); // 7th from Vrishabha = Vrishchika
  });

  // Test 8: D9 Navamsha (Movable: same, Fixed: 9th, Dual: 5th)
  it('D9 Navamsha accurately maps according to sign modality', () => {
    // Mesha (Movable) starts from Mesha
    expect(D9Definition.calculate(2.0).rashiNumber).toBe(1); // Mesha
    // Vrishabha (Fixed) starts from 9th = Makara (10)
    expect(D9Definition.calculate(32.0).rashiNumber).toBe(10); // Makara
    // Mithuna (Dual) starts from 5th = Tula (7)
    expect(D9Definition.calculate(62.0).rashiNumber).toBe(7); // Tula
  });

  // Test 9: D10 Dashamsha (Odd: same; Even: 9th)
  it('D10 Dashamsha maps odd from sign itself and even from 9th sign', () => {
    expect(D10Definition.calculate(2.0).rashiNumber).toBe(1); // Mesha
    expect(D10Definition.calculate(32.0).rashiNumber).toBe(10); // Makara (9th from Vrishabha)
  });

  // Test 10: D12 Dwadashamsha (Sequential)
  it('D12 Dwadashamsha maps sequentially from source sign', () => {
    expect(D12Definition.calculate(1.0).rashiNumber).toBe(1); // Mesha
    expect(D12Definition.calculate(3.0).rashiNumber).toBe(2); // Vrishabha
  });

  // Test 11: D16, D20, D24, D27
  it('Higher harmonics D16, D20, D24, and D27 map correctly', () => {
    // D16: Movable from Aries, Fixed from Leo, Dual from Sagittarius
    expect(D16Definition.calculate(1.0).rashiNumber).toBe(1); // Aries
    expect(D16Definition.calculate(31.0).rashiNumber).toBe(5); // Leo
    expect(D16Definition.calculate(61.0).rashiNumber).toBe(9); // Sagittarius

    // D20: Movable from Aries, Fixed from Sagittarius, Dual from Leo
    expect(D20Definition.calculate(1.0).rashiNumber).toBe(1); // Aries
    expect(D20Definition.calculate(31.0).rashiNumber).toBe(9); // Sagittarius
    expect(D20Definition.calculate(61.0).rashiNumber).toBe(5); // Leo

    // D24: Odd from Leo (5), Even from Cancer (4)
    expect(D24Definition.calculate(1.0).rashiNumber).toBe(5); // Leo
    expect(D24Definition.calculate(31.0).rashiNumber).toBe(4); // Cancer

    // D27: Fire -> Aries, Earth -> Cancer, Air -> Libra, Water -> Capricorn
    expect(D27Definition.calculate(1.0).rashiNumber).toBe(1); // Aries
    expect(D27Definition.calculate(31.0).rashiNumber).toBe(4); // Cancer
    expect(D27Definition.calculate(61.0).rashiNumber).toBe(7); // Libra
    expect(D27Definition.calculate(91.0).rashiNumber).toBe(10); // Capricorn
  });

  // Test 12: D30 Trimshamsha (Unequal degree partitions)
  it('D30 Trimshamsha strictly obeys traditional unequal planetary boundaries', () => {
    // Odd sign (Mesha):
    // 0-5° Mars (Aries, 1)
    expect(D30Definition.calculate(2.0).rashiNumber).toBe(1);
    expect(D30Definition.calculate(2.0).deity).toContain('Agni');

    // 5-10° Saturn (Aquarius, 11)
    expect(D30Definition.calculate(7.0).rashiNumber).toBe(11);
    expect(D30Definition.calculate(7.0).deity).toContain('Vayu');

    // 10-18° Jupiter (Sagittarius, 9)
    expect(D30Definition.calculate(14.0).rashiNumber).toBe(9);
    expect(D30Definition.calculate(14.0).deity).toContain('Indra');

    // 18-25° Mercury (Gemini, 3)
    expect(D30Definition.calculate(20.0).rashiNumber).toBe(3);
    expect(D30Definition.calculate(20.0).deity).toContain('Varuna');

    // 25-30° Venus (Taurus, 2)
    expect(D30Definition.calculate(27.0).rashiNumber).toBe(2);
    expect(D30Definition.calculate(27.0).deity).toContain('Yama');

    // Even sign (Vrishabha): reversed order
    // 0-5° Venus (Taurus, 2)
    expect(D30Definition.calculate(32.0).rashiNumber).toBe(2);

    // 5-12° Mercury (Virgo, 6)
    expect(D30Definition.calculate(37.0).rashiNumber).toBe(6);

    // 12-20° Jupiter (Pisces, 12)
    expect(D30Definition.calculate(45.0).rashiNumber).toBe(12);

    // 20-25° Saturn (Capricorn, 10)
    expect(D30Definition.calculate(52.0).rashiNumber).toBe(10);

    // 25-30° Mars (Scorpio, 8)
    expect(D30Definition.calculate(57.0).rashiNumber).toBe(8);
  });

  // Test 13: D40, D45, and D60 with 60 Deities
  it('D40, D45, and D60 with 60 classical deities calculate accurately', () => {
    // D40: Odd from Aries, Even from Libra
    expect(D40Definition.calculate(0.5).rashiNumber).toBe(1);
    expect(D40Definition.calculate(30.5).rashiNumber).toBe(7);

    // D45: Movable from Aries, Fixed from Leo, Dual from Sagittarius
    expect(D45Definition.calculate(0.5).rashiNumber).toBe(1);
    expect(D45Definition.calculate(30.5).rashiNumber).toBe(5);
    expect(D45Definition.calculate(60.5).rashiNumber).toBe(9);

    // D60: 0.5° intervals with specific deities
    const d60Part0 = D60Definition.calculate(0.25);
    expect(d60Part0.rashiNumber).toBe(1); // Mesha
    expect(d60Part0.deity).toContain('Ghora');

    const d60Part1 = D60Definition.calculate(0.75);
    expect(d60Part1.rashiNumber).toBe(2); // Vrishabha
    expect(d60Part1.deity).toContain('Rakshasa');

    const d60Part2 = D60Definition.calculate(1.25);
    expect(d60Part2.rashiNumber).toBe(3); // Mithuna
    expect(d60Part2.deity).toContain('Deva');
  });

  // Test 14: Master Engine Integration
  it('master computeVargaChart generates complete VargaChartResult with observations', () => {
    const result = computeVargaChart('D9', {
      ascendantSiderealLon: 15.0, // Mesha 15°
      planets: [
        { name: 'Surya', siderealLongitude: 15.0, symbol: '☉', sanskrit: 'सूर्य', d1Rashi: 'Mesha' },
        { name: 'Guru', siderealLongitude: 95.0, symbol: '♃', sanskrit: 'गुरु', d1Rashi: 'Karka' },
      ],
    });

    expect(result.definition.id).toBe('D9');
    expect(result.ascendant.rashi).toBeTruthy();
    expect(result.positions['Surya']).toBeDefined();
    expect(result.keyObservations.length).toBeGreaterThan(0);
    expect(result.interpretation).toContain('Navamsha');
  });
});
