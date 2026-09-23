import { GrahaName } from '@/types/astrology';

export interface RawPlanetaryCoordinate {
  name: GrahaName;
  tropicalLongitude: number;
  latitude: number;
  speed: number;
  isRetrograde: boolean;
}

export interface EphemerisCalculationResult {
  julianDay: number;
  greenwichSiderealTimeHours: number;
  localSiderealTimeHours: number;
  ayanamshaDegrees: number;
  tropicalAscendant: number;
  siderealAscendant: number;
  coordinates: RawPlanetaryCoordinate[];
}

/**
 * Pluggable Ephemeris Provider interface.
 * Allows transparent switching between pure astronomical algorithms (VSOP87/ELP2000),
 * Swiss Ephemeris C-library (libswe), or remote astronomical microservices.
 */
export interface IEphemerisProvider {
  calculate(
    utcDate: Date,
    latitude: number,
    longitude: number,
    ayanamshaSystem?: 'Lahiri' | 'Krishnamurti' | 'Raman',
    nodeType?: 'mean' | 'true'
  ): Promise<EphemerisCalculationResult> | EphemerisCalculationResult;
}
