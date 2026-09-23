# Ephemeris & Astronomical Calculation Configuration

**Project**: ASTRA / Kaalika — Precision Vedic Astrology & Astronomical Observatory  
**Audit Date**: September 2026  
**Document Version**: 1.0.0  
**Status**: Root-Cause Analysis Specification

---

## 1. Executive Summary

This document specifies the exact ephemeris engine, coordinate systems, precession algorithms, lunar node calculations, and house systems implemented in the codebase. 

A critical finding of this audit is that **the project does NOT currently link to or execute the native C/WASM Swiss Ephemeris (`swisseph`) binary**. Instead, it uses **`astronomy-engine` (v2.1.19)** by Don Cross (implementing VSOP87 for planetary heliocentric/geocentric orbits and ELP2000-82B for lunar positions), augmented by custom analytical perturbations for lunar nodes and custom polynomial approximations for ayanamshas.

---

## 2. Ephemeris Provider & Library Architecture

### 2.1 Primary Astronomical Library
- **Library**: `astronomy-engine`
- **Version**: `^2.1.19`
- **Underlying Theories**:
  - **Sun & Planets (Mercury through Saturn)**: VSOP87 (Variations Séculaires des Orbites Planétaires).
  - **Moon**: ELP2000-82B (Éphéméride Lunaire Parisienne).
  - **Precession/Nutations**: IAU 2000 / 2006 precession model with nutation series.
- **Precision Level**:
  - Inner & outer planets: Typically within **0.0001° to 0.001°** (~0.36 to 3.6 arcseconds) of JPL DE405/DE431.
  - Moon: Typically within **0.001° to 0.003°** (~3.6 to 10.8 arcseconds) over the era 1800–2100.
  - Comparison to Swiss Ephemeris: Swiss Ephemeris (`swe_calc_ut`) with compressed ephemeris files (`se1`) achieves < 0.0001 arcseconds. While `astronomy-engine` has sufficient accuracy for Rashi, Navamsha, and standard divisional charts, high-harmonic Vargas like **D60 (Shashtiamsha, 0.5° per division)** and **D150 (Nadi amsha, 0.2° per division)** are extremely sensitive to sub-arcminute perturbations near sign boundaries.

### 2.2 Absence of Swiss Ephemeris C / WebAssembly
- While comments and requirements mention Swiss Ephemeris, `package.json` contains no `@swisseph/swisseph` or `swisseph-v2` native bindings.
- All planetary positions are computed purely in TypeScript via `astronomy-engine` in `lib/ephemeris/astronomical.ts`.
- **Finding**: Any claim in UI or API that "Swiss Ephemeris v2.10 is active" is factually incorrect and misrepresents the runtime engine.

---

## 3. Coordinate Systems & Calculation Modes

| Parameter | Configuration in Code | Traditional Jyotish Standard | Audit Assessment & Discrepancies |
| :--- | :--- | :--- | :--- |
| **Coordinate Mode** | **Geocentric Apparent** (`Astronomy.GeoVector`, `Astronomy.Ecliptic`) | Geocentric Apparent | **Compliant**: Accounts for light-time delay and aberration. Topocentric parallax is NOT applied to Moon by default (standard for D1 Jyotish, though Sripathi/some traditions dispute lunar parallax). |
| **Equinox of Date** | True Equinox of Date (with nutation) | True Equinox of Date | **Compliant**: Tropical ecliptic longitude $\lambda_{trop}$ includes nutation in longitude $\Delta\psi$. |
| **Zodiac Mode** | Sidereal (Nirayana) | Sidereal (Nirayana) | **Compliant**: Derived via $\lambda_{sidereal} = (\lambda_{tropical} - \text{Ayanamsha}) \pmod{360}$. |
| **Lunar Node Mode** | Dual: Mean Node (default in `astronomical.ts`) vs Perturbed True Node (in `d1-engine.ts`) | Mean Node (Surya Siddhanta) or True Node (Modern Eph) | **Divergence**: `lib/ephemeris/astronomical.ts` only computes Mean Node. `lib/astrology/d1-engine.ts` conditionally adds solar perturbation. When `nodeType='true'` is requested, `kundali.planets` returns Mean Node while `d1Chart.planets` returns True Node! |
| **House System** | Configurable: Whole Sign (default), Equal, Placidus, Koch, Sripathi, Bhava Chalit | Whole Sign (default in Parashari) / Sripati for Bhava Chalit | **Issue**: `calculateKundali()` in `lib/astrology/kundali.ts` hardcodes Whole Sign and ignores user-specified `settings.houseSystem`. |

---

## 4. Ayanamsha Mathematical Formulations

All ayanamsha formulations reside in `lib/ephemeris/ayanamsha.ts`. Time $T$ is Julian centuries of 36,525 ephemeris days from J2000.0 (JD 2451545.0).

$$\tau = \frac{\text{JD} - 2451545.0}{36525}$$

### 4.1 Lahiri (Chitrapaksha) — Standard
- **Code formula**:
  $$\text{Ayanamsha}_{\text{Lahiri}} = 23.85 + 1.396 \cdot \tau$$
  *(With optional IAU nutation in longitude adjustment)*.
- **Reference Standard**: 
  - Lahiri ayanamsha at J2000.0 is officially **$23^\circ 51' 25.53'' \approx 23.857092^\circ$**.
  - Rate of precession: **$5028.796'' / \text{century} \approx 1.396888^\circ / \text{century}$**.
- **Audit Observation**: The hardcoded constant `23.85°` introduces an initial systematic offset of $\sim 25.5$ arcseconds ($0.007^\circ$) compared to the official Indian Astronomical Ephemeris value. For boundary planets at $29^\circ 59' 40''$, this error flips the Rashi or Navamsha!

### 4.2 Krishnamurti Paddhati (KP)
- **Code formula**:
  $$\text{Ayanamsha}_{\text{KP}} = 23.75 + 1.396 \cdot \tau$$
- **Offset from Lahiri**: KP is fixed at approximately $0^\circ 06' 00''$ lower than Lahiri ($23^\circ 45' 56''$ at J2000).

### 4.3 Raman
- **Code formula**:
  $$\text{Ayanamsha}_{\text{Raman}} = 22.46 + 1.396 \cdot \tau$$
- **Reference Standard**: Raman ayanamsha at J2000 is approximately $22^\circ 27' 38'' \approx 22.4605^\circ$.

---

## 5. Lunar Node Equations (Rahu & Ketu)

In `lib/ephemeris/astronomical.ts` (`calculateLunarNode`):

### 5.1 Mean Node (IAU / Meeus Astronomical Algorithms Ch. 22):
$$\Omega_0 = 125.04452 - 1934.136261 \cdot \tau + 0.0020708 \cdot \tau^2 + \frac{\tau^3}{450000}$$

- Ketu is computed as:
$$\text{Ketu} = (\Omega_0 + 180^\circ) \pmod{360^\circ}$$
- **Verification**: Rahu and Ketu are strictly invariant at $180^\circ 00' 00''$ separation in both modules.

### 5.2 True Node Perturbation (in `d1-engine.ts`):
$$\Omega_{\text{True}} = \Omega_0 - 1.26^\circ \sin(2(\lambda_{\text{Sun}} - \Omega_0))$$
- **Audit Finding**: This is a 1-term truncated lunar node inequality. A full true node calculation requires over 20 harmonic terms from the ELP theory. More critically, this formula is only applied in `d1-engine.ts` and NOT in `lib/ephemeris/astronomical.ts`, causing Rahu to have two different values depending on which route is called.

---

## 6. Ascendant (Lagna) & MC Calculation

In `lib/ephemeris/astronomical.ts` (`calculateAscendant`):
1. **Greenwich Apparent Sidereal Time (GAST)** is calculated using `Astronomy.SiderealTime(date)`.
2. **Local Sidereal Time (LST / RAMC)**:
   $$\theta = (\text{GAST} \cdot 15^\circ + \text{geoLongitude}) \pmod{360}$$
3. **Obliquity of the Ecliptic ($\varepsilon$)**:
   Computed dynamically from `Astronomy.e_tilt(date).tobl` (true obliquity including nutation).
4. **Ascendant Formula**:
   $$\tan(\lambda_{\text{Asc, trop}}) = \frac{\cos(\theta)}{-\sin(\theta)\cos(\varepsilon) - \tan(\phi)\sin(\varepsilon)}$$
   Solved via `atan2` with quadrant resolution:
   $$\text{Asc}_{\text{trop}} = (\text{atan2}(y, x) + 360^\circ) \pmod{360^\circ}$$
5. **Sidereal Ascendant**:
   $$\text{Asc}_{\text{sidereal}} = (\text{Asc}_{\text{trop}} - \text{Ayanamsha}) \pmod{360^\circ}$$

- **Verification**: Mathematically rigorous and handles polar/latitude singularities up to $\pm 66^\circ$. Beyond the Arctic/Antarctic circles ($\phi > 66.5^\circ$), ecliptic-horizon non-intersection is handled via fallback to RAMC.

---

## 7. House Systems

In `lib/ephemeris/astronomical.ts` (`calculateHouseCusps`):

1. **Whole Sign (Vedic Parashari default)**:
   - House 1 cusp = Start of the Rashi containing the Ascendant: $\lfloor \text{Asc} / 30 \rfloor \cdot 30^\circ$.
   - Each successive house is exactly $((\text{House 1} + 30 \cdot (i-1)) \pmod{360})$.
2. **Equal House**:
   - House 1 cusp = Exact degree of Ascendant.
   - House $i$ cusp = $(\text{Asc} + 30 \cdot (i-1)) \pmod{360}$.
3. **Bhava Chalit / Sripathi**:
   - Trisection of quadrant arcs between Ascendant and Midheaven (MC).
4. **Placidus / Koch**:
   - Semi-arc time trisection methods.

---

## 8. Ephemeris Configuration Export Schema

The calculation engine exposes the following diagnostic metadata on every calculation:

```typescript
export interface EphemerisConfiguration {
  engine: "astronomy-engine" | "swiss-ephemeris";
  engineVersion: string; // "2.1.19"
  ayanamshaSystem: "lahiri" | "raman" | "krishnamurti";
  ayanamshaValue: number; // e.g. 24.12458
  nodeCalculation: "mean" | "true";
  coordinateSystem: "geocentric-apparent";
  houseSystem: "whole-sign" | "equal" | "sripathi" | "placidus" | "koch";
  obliquity: number; // e.g. 23.4365
  nutationLongitude: number;
  julianDayUT: number;
  deltaT: number; // seconds
}
```
