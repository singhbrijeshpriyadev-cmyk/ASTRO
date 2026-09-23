export interface HistoricalOffsetResult {
  utcOffsetHours: number;
  offsetFormatted: string; // e.g. "+05:30"
  timezoneName: string;   // e.g. "IST", "Indian War Time (DST)", "Local Mean Time (LMT)"
  isHistoricalDeviation: boolean;
  notes?: string;
}

/**
 * Resolves the deterministic astronomical and historical UTC offset for any Indian birth coordinate and date.
 * Rejects simplistic assumption that all historical Indian births were UTC+05:30.
 *
 * Historical Periods:
 * 1. Pre-1906: Local Mean Time (LMT) based on geographic longitude (LMT = lon / 15).
 * 2. 1 Jan 1906: Indian Standard Time (IST = +05:30) established at 82.5°E.
 * 3. 1 Sept 1942 - 15 Oct 1945: Indian War Time (WWII Daylight Saving Time = +06:30).
 * 4. 15 Oct 1945 onwards: Standard IST (+05:30).
 * 5. Calcutta historical: Calcutta officially observed Calcutta Time (+05:53:21) until 1948.
 */
export function resolveIndianHistoricalUtcOffset(
  year: number,
  month: number, // 1-12
  day: number,   // 1-31
  longitude: number,
  locationName?: string
): HistoricalOffsetResult {
  // Format target date for comparison
  const dateStr = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isCalcutta = locationName && (
    locationName.toLowerCase().includes('kolkata') || 
    locationName.toLowerCase().includes('calcutta')
  );

  // 1. Pre-1906: Local Mean Time (LMT)
  if (year < 1906) {
    const lmtHours = longitude / 15.0;
    const sign = lmtHours >= 0 ? '+' : '-';
    const absHours = Math.abs(lmtHours);
    const h = Math.floor(absHours);
    const m = Math.floor((absHours - h) * 60);
    const s = Math.round(((absHours - h) * 60 - m) * 60);
    const formatted = `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    return {
      utcOffsetHours: lmtHours,
      offsetFormatted: formatted,
      timezoneName: 'Local Mean Time (LMT)',
      isHistoricalDeviation: true,
      notes: `Pre-1906 birth prior to official adoption of Indian Standard Time. Astronomical Local Mean Time (${formatted}) derived from longitude ${longitude.toFixed(4)}°E.`,
    };
  }

  // 2. Special Calcutta Local Time (1906 - 1948)
  if (isCalcutta && dateStr < '1948-09-01') {
    // Calcutta Time: UTC +05:53:21 = +5.889167 hours
    const calcuttaOffset = 5 + 53 / 60 + 21 / 3600;
    return {
      utcOffsetHours: calcuttaOffset,
      offsetFormatted: '+05:53:21',
      timezoneName: 'Calcutta Time',
      isHistoricalDeviation: true,
      notes: 'Calcutta officially observed Calcutta Time (+05:53:21) independently until 1948.',
    };
  }

  // 3. WWII Indian War Time (Daylight Saving Time): 1 Sept 1942 to 15 Oct 1945
  if (dateStr >= '1942-09-01' && dateStr <= '1945-10-15') {
    return {
      utcOffsetHours: 6.5,
      offsetFormatted: '+06:30',
      timezoneName: 'Indian War Time (DST)',
      isHistoricalDeviation: true,
      notes: 'British India observed mandatory War Time (Daylight Saving Time) of UTC+06:30 during World War II.',
    };
  }

  // 4. Standard Indian Standard Time (IST): 1906 onwards (except 1942-1945 War Time)
  return {
    utcOffsetHours: 5.5,
    offsetFormatted: '+05:30',
    timezoneName: 'Indian Standard Time (IST)',
    isHistoricalDeviation: false,
    notes: 'Standard Indian Standard Time (UTC+05:30) based on 82.5°E longitude meridian.',
  };
}
