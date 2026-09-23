import { z } from 'zod';

/**
 * Checks whether a given Gregorian year is a leap year.
 * Century years (ending in 00) must be divisible by 400 to be leap years.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the exact number of days in a given Gregorian month and year.
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return 31;
}

/**
 * Validates whether a calendar date actually exists.
 */
export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (year < 1800 || year > 2200) return false;
  if (month < 1 || month > 12) return false;
  const maxDays = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDays;
}

/**
 * Validates 24-hour time including midnight (00:00:00), noon (12:00:00), and seconds.
 */
export function isValidTime(hour: number, minute: number, second = 0): boolean {
  if (hour < 0 || hour > 23) return false;
  if (minute < 0 || minute > 59) return false;
  if (second < 0 || second > 59) return false;
  return true;
}

export const StrictBirthInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name too long'),
  birthLocalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  birthLocalTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Time must be formatted as HH:MM or HH:MM:SS (24-hour)'),
  birthPlace: z.string().trim().min(1, 'Birth place is required').max(150),
  latitude: z.number().min(-90, 'Latitude must be between -90 and +90').max(90, 'Latitude must be between -90 and +90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and +180').max(180, 'Longitude must be between -180 and +180'),
  timezone: z.string().min(1, 'Timezone identifier is required'),
  manualUtcOffset: z.number().min(-14).max(14).optional(),
  ayanamshaSystem: z.enum(['Lahiri', 'Krishnamurti', 'Raman']).default('Lahiri'),
  houseSystem: z.enum(['whole-sign', 'equal-house', 'sripati', 'placidus']).default('whole-sign'),
  nodeType: z.enum(['true', 'mean']).default('true'),
}).refine(data => {
  const [yStr, mStr, dStr] = data.birthLocalDate.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  return isValidCalendarDate(y, m, d);
}, {
  message: 'Invalid calendar date (e.g. Feb 29 in non-leap year or invalid month day)',
  path: ['birthLocalDate'],
}).refine(data => {
  const parts = data.birthLocalTime.split(':').map(p => parseInt(p, 10));
  const h = parts[0];
  const m = parts[1];
  const s = parts[2] !== undefined ? parts[2] : 0;
  return isValidTime(h, m, s);
}, {
  message: 'Invalid time (must be valid 24h format: HH 0-23, MM 0-59, SS 0-59)',
  path: ['birthLocalTime'],
});

export type ValidatedRawBirthInput = z.infer<typeof StrictBirthInputSchema>;
