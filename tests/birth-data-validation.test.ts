import { describe, it, expect } from 'vitest';
import { 
  isLeapYear, 
  getDaysInMonth, 
  isValidCalendarDate, 
  isValidTime, 
  StrictBirthInputSchema 
} from '../lib/validation/birth-schema';
import { resolveIndianHistoricalUtcOffset } from '../lib/location/timezone-history';
import { calculationService } from '../server/calculation-service';
import { RawBirthInput, CalculationSettings } from '../types/astrology';

describe('Birth Data Validation & Historical Timezones', () => {
  // Test 1: Leap-year dates validation
  it('correctly handles leap-year dates and rejects invalid days', () => {
    // 2000 was a century leap year (divisible by 400)
    expect(isLeapYear(2000)).toBe(true);
    expect(isValidCalendarDate(2000, 2, 29)).toBe(true);

    // 2024 is a regular leap year
    expect(isLeapYear(2024)).toBe(true);
    expect(isValidCalendarDate(2024, 2, 29)).toBe(true);

    // 1900 was NOT a leap year (divisible by 100 but not 400)
    expect(isLeapYear(1900)).toBe(false);
    expect(isValidCalendarDate(1900, 2, 29)).toBe(false);

    // 2023 was not a leap year
    expect(isLeapYear(2023)).toBe(false);
    expect(isValidCalendarDate(2023, 2, 29)).toBe(false);

    // 30-day months cannot have 31 days
    expect(isValidCalendarDate(2023, 4, 31)).toBe(false); // April
    expect(isValidCalendarDate(2023, 6, 31)).toBe(false); // June
    expect(isValidCalendarDate(2023, 9, 31)).toBe(false); // September
    expect(isValidCalendarDate(2023, 11, 31)).toBe(false); // November

    // Valid 31-day month
    expect(isValidCalendarDate(2023, 1, 31)).toBe(true);
  });

  // Test 2: Midnight (00:00:00), Near Midnight, and Noon (12:00:00)
  it('handles midnight, near midnight, and noon times correctly', () => {
    // Midnight
    expect(isValidTime(0, 0, 0)).toBe(true);

    // Near midnight (23:59:59 and 00:00:01)
    expect(isValidTime(23, 59, 59)).toBe(true);
    expect(isValidTime(0, 0, 1)).toBe(true);

    // Noon
    expect(isValidTime(12, 0, 0)).toBe(true);

    // Invalid times
    expect(isValidTime(24, 0, 0)).toBe(false);
    expect(isValidTime(12, 60, 0)).toBe(false);
    expect(isValidTime(12, 0, 60)).toBe(false);
    expect(isValidTime(-1, 0, 0)).toBe(false);
  });

  // Test 3: Benchmark Epochs: 1 January 2000 00:00 and 1 January 2000 12:00
  it('normalizes benchmark dates 1 Jan 2000 00:00 and 1 Jan 2000 12:00 without browser clock', () => {
    const rawMidnight: RawBirthInput = {
      name: 'Y2K Midnight',
      birthLocalDate: '2000-01-01',
      birthLocalTime: '00:00:00',
      birthPlace: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 'Asia/Kolkata',
    };

    const normMidnight = calculationService.normalizeBirthData(rawMidnight);
    expect(normMidnight.utcOffset).toBe(5.5);
    // Local 00:00 - 5.5 hours = Dec 31, 1999 18:30:00 UTC
    expect(normMidnight.birthUTC).toBe('1999-12-31T18:30:00.000Z');

    const rawNoon: RawBirthInput = {
      name: 'Y2K Noon',
      birthLocalDate: '2000-01-01',
      birthLocalTime: '12:00:00',
      birthPlace: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 'Asia/Kolkata',
    };

    const normNoon = calculationService.normalizeBirthData(rawNoon);
    // Local 12:00 - 5.5 hours = Jan 1, 2000 06:30:00 UTC
    expect(normNoon.birthUTC).toBe('2000-01-01T06:30:00.000Z');
    expect(normNoon.julianDay).toBeGreaterThan(2451544);
  });

  // Test 4: Historical Indian Timezone Offset Variations
  it('accurately resolves historical UTC offsets for different Indian locations and eras', () => {
    // A. Post-1945: Standard IST (+05:30)
    const modern = resolveIndianHistoricalUtcOffset(1995, 10, 24, 77.2090, 'Delhi');
    expect(modern.utcOffsetHours).toBe(5.5);
    expect(modern.isHistoricalDeviation).toBe(false);

    // B. WWII War Time (1942-09-01 to 1945-10-15): UTC +06:30
    const warTime = resolveIndianHistoricalUtcOffset(1943, 6, 15, 77.2090, 'Delhi');
    expect(warTime.utcOffsetHours).toBe(6.5);
    expect(warTime.isHistoricalDeviation).toBe(true);
    expect(warTime.timezoneName).toBe('Indian War Time (DST)');

    // C. Pre-1906: Local Mean Time for Varanasi (lon 82.9739°E)
    // LMT = 82.9739 / 15 = 5.531593 hours = ~5h 31m 54s
    const pre1906Varanasi = resolveIndianHistoricalUtcOffset(1900, 1, 1, 82.9739, 'Varanasi');
    expect(pre1906Varanasi.isHistoricalDeviation).toBe(true);
    expect(pre1906Varanasi.utcOffsetHours).toBeCloseTo(5.5316, 2);

    // D. Calcutta special historical time prior to 1948
    const calcuttaHist = resolveIndianHistoricalUtcOffset(1930, 5, 1, 88.3639, 'Kolkata');
    expect(calcuttaHist.isHistoricalDeviation).toBe(true);
    expect(calcuttaHist.offsetFormatted).toBe('+05:53:21');
  });

  // Test 5: Strict schema rejection
  it('rejects impossible dates and invalid coordinates in schema validation', () => {
    const invalidDate = {
      name: 'Test',
      birthLocalDate: '2023-02-29', // Non-leap year Feb 29
      birthLocalTime: '12:00:00',
      birthPlace: 'Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 'Asia/Kolkata',
    };
    const res1 = StrictBirthInputSchema.safeParse(invalidDate);
    expect(res1.success).toBe(false);

    const invalidHour = {
      name: 'Test',
      birthLocalDate: '2024-01-01',
      birthLocalTime: '24:00:00', // 24 is invalid in 24-hr time
      birthPlace: 'Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 'Asia/Kolkata',
    };
    const res2 = StrictBirthInputSchema.safeParse(invalidHour);
    expect(res2.success).toBe(false);
  });
});
