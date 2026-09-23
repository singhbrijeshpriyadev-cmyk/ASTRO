/**
 * High-precision Ayanamsha computation module.
 * Implements official N.C. Lahiri (Chitra Paksha), Krishnamurti (KP), and B.V. Raman Ayanamshas.
 */

export type AyanamshaSystem = 'Lahiri' | 'Krishnamurti' | 'Raman';

/**
 * Calculates Julian Day number from a JavaScript UTC Date.
 */
export function getJulianDay(date: Date): number {
  return (date.getTime() / 86400000) + 2440587.5;
}

/**
 * Calculates Julian Centuries since J2000.0 (JD 2451545.0)
 */
export function getJulianCenturiesJ2000(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * High-precision N.C. Lahiri (Chitra Paksha) Ayanamsha.
 * Reference: Indian Astronomical Ephemeris standard.
 * At J2000.0 (JD 2451545.0), Lahiri is 23° 51' 25.53" = 23.85709167°
 * Annual precession rate: ~50.290966" / year
 */
export function calculateLahiriAyanamsha(jd: number): number {
  const T = getJulianCenturiesJ2000(jd);
  // High order polynomial matching Indian Astronomical Ephemeris
  const ayanamsha = 23.85709167 + 1.3969713 * T + 0.0003086 * T * T;
  return ayanamsha;
}

/**
 * Krishnamurti (KP) Ayanamsha
 */
export function calculateKPAyanamsha(jd: number): number {
  const T = getJulianCenturiesJ2000(jd);
  // KP is slightly offset from Lahiri (~ 6 arcminutes)
  const ayanamsha = 23.852444 + 1.3969713 * T + 0.0003086 * T * T;
  return ayanamsha;
}

/**
 * B.V. Raman Ayanamsha
 */
export function calculateRamanAyanamsha(jd: number): number {
  const T = getJulianCenturiesJ2000(jd);
  const ayanamsha = 22.408333 + 1.3969713 * T + 0.0003086 * T * T;
  return ayanamsha;
}

export function getAyanamsha(jd: number, system: AyanamshaSystem = 'Lahiri'): number {
  switch (system) {
    case 'Krishnamurti':
      return calculateKPAyanamsha(jd);
    case 'Raman':
      return calculateRamanAyanamsha(jd);
    case 'Lahiri':
    default:
      return calculateLahiriAyanamsha(jd);
  }
}
