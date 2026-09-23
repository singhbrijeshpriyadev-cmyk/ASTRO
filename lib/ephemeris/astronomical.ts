import * as Astronomy from 'astronomy-engine';
import { IEphemerisProvider, EphemerisCalculationResult, RawPlanetaryCoordinate } from './interface';
import { getJulianDay, getAyanamsha, AyanamshaSystem } from './ayanamsha';
import { normalizeDegrees } from '../astrology/coordinates';
import { GrahaName } from '@/types/astrology';

export class HighPrecisionEphemerisProvider implements IEphemerisProvider {
  /**
   * Calculates high-precision planetary coordinates and Ascendant using VSOP87/ELP2000 theory.
   */
  calculate(
    utcDate: Date,
    latitude: number,
    longitude: number,
    ayanamshaSystem: AyanamshaSystem = 'Lahiri',
    nodeType: 'mean' | 'true' = 'mean'
  ): EphemerisCalculationResult {
    const time = Astronomy.MakeTime(utcDate);
    const jd = getJulianDay(utcDate);
    const ayanamsha = getAyanamsha(jd, ayanamshaSystem);

    // Greenwich Mean Sidereal Time in hours
    const gmst = Astronomy.SiderealTime(time);
    // Local Sidereal Time in hours: LST = (GMST + lon/15) % 24
    const lstHours = (((gmst + longitude / 15) % 24) + 24) % 24;

    // Ascendant Calculation
    const ramcDeg = lstHours * 15;
    const tropicalAsc = this.calculateAscendant(ramcDeg, latitude, time);
    const siderealAsc = normalizeDegrees(tropicalAsc - ayanamsha);

    // Planetary Bodies
    const bodies: { name: GrahaName; body: Astronomy.Body | 'Rahu' | 'Ketu' }[] = [
      { name: 'Surya', body: Astronomy.Body.Sun },
      { name: 'Chandra', body: Astronomy.Body.Moon },
      { name: 'Mangala', body: Astronomy.Body.Mars },
      { name: 'Budha', body: Astronomy.Body.Mercury },
      { name: 'Guru', body: Astronomy.Body.Jupiter },
      { name: 'Shukra', body: Astronomy.Body.Venus },
      { name: 'Shani', body: Astronomy.Body.Saturn },
      { name: 'Rahu', body: 'Rahu' },
      { name: 'Ketu', body: 'Ketu' },
      { name: 'Uranus', body: Astronomy.Body.Uranus },
      { name: 'Neptune', body: Astronomy.Body.Neptune },
      { name: 'Pluto', body: Astronomy.Body.Pluto },
    ];

    // Compute coordinates for each body with daily speed for retrograde status
    const deltaHours = 1;
    const timeDelta = Astronomy.MakeTime(new Date(utcDate.getTime() + deltaHours * 3600000));

    const coordinates: RawPlanetaryCoordinate[] = bodies.map(({ name, body }) => {
      if (body === 'Rahu' || body === 'Ketu') {
        return this.calculateLunarNode(name as 'Rahu' | 'Ketu', time, timeDelta, deltaHours, nodeType);
      }

      const vec = Astronomy.GeoVector(body, time, true);
      const ecl = Astronomy.Ecliptic(vec);

      const vecNext = Astronomy.GeoVector(body, timeDelta, true);
      const eclNext = Astronomy.Ecliptic(vecNext);

      let lonDiff = eclNext.elon - ecl.elon;
      if (lonDiff < -180) lonDiff += 360;
      if (lonDiff > 180) lonDiff -= 360;
      const speedDegPerDay = (lonDiff / deltaHours) * 24;

      return {
        name,
        tropicalLongitude: normalizeDegrees(ecl.elon),
        latitude: ecl.elat,
        speed: speedDegPerDay,
        isRetrograde: speedDegPerDay < 0,
      };
    });

    return {
      julianDay: jd,
      greenwichSiderealTimeHours: gmst,
      localSiderealTimeHours: lstHours,
      ayanamshaDegrees: ayanamsha,
      tropicalAscendant: tropicalAsc,
      siderealAscendant: siderealAsc,
      coordinates,
    };
  }

  /**
   * Ascendant (Lagna) equation:
   * λ_asc = atan2(cos(RAMC), -sin(RAMC)*cos(ε) - tan(φ)*sin(ε))
   */
  private calculateAscendant(ramcDeg: number, latitudeDeg: number, time: Astronomy.AstroTime): number {
    const rad = Math.PI / 180;
    const theta = ramcDeg * rad;
    const phi = latitudeDeg * rad;

    // True obliquity of ecliptic
    const T = time.tt / 36525.0;
    const eps = (23.4392911 - 0.0130042 * T) * rad;

    const y = Math.cos(theta);
    const x = -Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);

    let asc = Math.atan2(y, x) / rad;
    return normalizeDegrees(asc);
  }

  /**
   * Mean Lunar Node (Rahu / Ketu) calculation.
   * In traditional Vedic astrology, Rahu and Ketu are always retrograde nodes.
   */
  private calculateLunarNode(
    name: 'Rahu' | 'Ketu',
    time: Astronomy.AstroTime,
    timeDelta: Astronomy.AstroTime,
    deltaHours: number,
    nodeType: 'mean' | 'true' = 'mean'
  ): RawPlanetaryCoordinate {
    const T = time.tt / 36525.0;
    const rad = Math.PI / 180;
    // Mean longitude of ascending node of the Moon (J2000.0)
    let nodeLon = 125.04452 - 1934.136261 * T + 0.0020708 * T * T;
    if (nodeType === 'true') {
      const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, time, true);
      const sunEcl = Astronomy.Ecliptic(sunVec);
      const perturbation = -1.26 * Math.sin(2 * (sunEcl.elon - nodeLon) * rad);
      nodeLon += perturbation;
    }
    nodeLon = normalizeDegrees(nodeLon);

    const TDelta = timeDelta.tt / 36525.0;
    let nodeLonNext = 125.04452 - 1934.136261 * TDelta + 0.0020708 * TDelta * TDelta;
    if (nodeType === 'true') {
      const sunVecNext = Astronomy.GeoVector(Astronomy.Body.Sun, timeDelta, true);
      const sunEclNext = Astronomy.Ecliptic(sunVecNext);
      const perturbationNext = -1.26 * Math.sin(2 * (sunEclNext.elon - nodeLonNext) * rad);
      nodeLonNext += perturbationNext;
    }
    nodeLonNext = normalizeDegrees(nodeLonNext);

    let diff = nodeLonNext - nodeLon;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    const speed = (diff / deltaHours) * 24;

    if (name === 'Rahu') {
      return {
        name: 'Rahu',
        tropicalLongitude: nodeLon,
        latitude: 0,
        speed,
        isRetrograde: true,
      };
    } else {
      const ketuLon = normalizeDegrees(nodeLon + 180);
      return {
        name: 'Ketu',
        tropicalLongitude: ketuLon,
        latitude: 0,
        speed,
        isRetrograde: true,
      };
    }
  }
}

export const defaultEphemerisProvider = new HighPrecisionEphemerisProvider();
