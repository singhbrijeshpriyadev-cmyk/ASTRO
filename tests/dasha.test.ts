import { describe, it, expect } from 'vitest';
import { calculateVimshottariDasha } from '../lib/dasha/vimshottari';

describe('Vimshottari Dasha Engine', () => {
  it('correctly maps starting lord and calculates consecutive periods', () => {
    // Moon in Ashwini nakshatra (0° to 13° 20') -> lord is Ketu (7 years)
    const birthDate = new Date('1995-06-15T00:00:00Z');
    const moonLon = 5.0; // In Ashwini (0 to 13.333), partway through Ketu dasha

    const dashas = calculateVimshottariDasha(birthDate, moonLon);
    expect(dashas.length).toBeGreaterThan(0);
    expect(dashas[0].planet).toBe('Ketu');
    
    // For the birth Mahadasha, elapsed subperiods before birth are clipped,
    // leaving remaining active subperiods from birth onwards
    expect(dashas[0].subPeriods?.length).toBeGreaterThan(0);

    // Second Mahadasha lord must be Venus (Shukra) with full 9 subperiods
    expect(dashas[1].planet).toBe('Shukra');
    expect(dashas[1].durationYears).toBe(20);
    expect(dashas[1].subPeriods?.length).toBe(9);
  });
});
