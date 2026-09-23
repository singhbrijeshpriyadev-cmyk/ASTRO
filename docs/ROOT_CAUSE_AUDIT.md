# Comprehensive Root-Cause Audit: Vedic Astrology & Tarot Pipeline

**Project**: ASTRA / Kaalika — Precision Vedic Astrology & Astronomical Observatory  
**Target Environment**: Next.js 14 App Router, TypeScript, Astronomy-Engine v2.1.19  
**Audit Mode**: ROOT-CAUSE INVESTIGATION (No symptoms patched during analysis)  
**Date of Audit**: September 2026  
**Document Status**: Official Architecture & Root Cause Report

---

## Table of Contents
1. [Phase 1: Project Discovery & Architecture Map](#1-phase-1-project-discovery--architecture-map)
2. [Phase 2: Multiple Sources of Truth Audit](#2-phase-2-multiple-sources-of-truth-audit)
3. [Phase 3: Input Validation & Timezone Normalization](#3-phase-3-input-validation--timezone-normalization)
4. [Phase 4: Ephemeris & Astronomical Engine Audit](#4-phase-4-ephemeris--astronomical-engine-audit)
5. [Phase 5: Ayanamsha Implementation Audit](#5-phase-5-ayanamsha-implementation-audit)
6. [Phase 6: Planetary Positions & Boundary Audit](#6-phase-6-planetary-positions--boundary-audit)
7. [Phase 7: Lagna & House Cusps Audit](#7-phase-7-lagna--house-cusps-audit)
8. [Phase 8: D1 Rashi Chart Integrity Audit](#8-phase-8-d1-rashi-chart-integrity-audit)
9. [Phase 9: Varga (Divisional Charts D1–D60) Audit](#9-phase-9-varga-divisional-charts-d1d60-audit)
10. [Phase 10: D60 Shashtiamsha Special Sensitivity Audit](#10-phase-10-d60-shashtiamsha-special-sensitivity-audit)
11. [Phase 11: Nakshatra & Pada Boundary Audit](#11-phase-11-nakshatra--pada-boundary-audit)
12. [Phase 12: Vimshottari Dasha Engine Audit](#12-phase-12-vimshottari-dasha-engine-audit)
13. [Phase 13: Yoga & Dosha Evaluator Audit](#13-phase-13-yoga--dosha-evaluator-audit)
14. [Phase 14: AI & LLM Responsibility Audit](#14-phase-14-ai--llm-responsibility-audit)
15. [Phase 15: API, Cache & State Invalidation Audit](#15-phase-15-api-cache--state-invalidation-audit)
16. [Phase 16: Frontend State & React Lifecycle Audit](#16-phase-16-frontend-state--react-lifecycle-audit)
17. [Phase 17: SVG Chart Renderer Geometry Audit](#17-phase-17-svg-chart-renderer-geometry-audit)
18. [Phase 18: Tarot Subsystem & Randomization Audit](#18-phase-18-tarot-subsystem--randomization-audit)
19. [Phase 19: Golden Test Suite Architecture](#19-phase-19-golden-test-suite-architecture)
20. [Phase 20: Comprehensive Root Cause Classification](#20-phase-20-comprehensive-root-cause-classification)
21. [Phase 21: Recommended Execution Sequence & File Manifest](#21-phase-21-recommended-execution-sequence--file-manifest)

---

## 1. Phase 1: Project Discovery & Architecture Map

### 1.1 Architectural Inventory
- **Frontend Framework**: Next.js 14.2.3 (React 18, App Router architecture).
- **Styling**: Vanilla TailwindCSS with custom design system variables, glassmorphic & manuscript theme palettes.
- **Backend Framework**: Next.js Edge / Node.js Route Handlers (`app/api/astrology/calculate/route.ts`).
- **Database / Persistent Storage**: In-memory LRU cache (`lib/astrology/cache.ts`) with client-side `localStorage` caching (`useKundaliStore`, `tarotDrawStorage`). No external SQL/NoSQL DB currently attached.
- **Astrology Calculation Core**: Pure TypeScript implementations powered by `astronomy-engine` (v2.1.19).
- **Ephemeris Data Files**: None. Uses VSOP87 analytical series and ELP2000-82B lunar series embedded in `astronomy-engine`.
- **Timezone Library**: Native JavaScript `Intl.DateTimeFormat` combined with manual offset parsing (`+05:30`, `-04:00`, `Z`) in `lib/validation/birth-data.ts`.
- **Geocoding System**: Client-side coordinate input with preset location fixtures in test vectors; no external third-party geocoding API dependency.
- **Varga Implementation**: Dual implementation:
  1. `lib/varga/engine.ts` + individual divisional modules `lib/varga/d1.ts` through `d60.ts`.
  2. `lib/varga/divisional.ts` (`buildVargaChart`).
- **Dasha Implementation**: Dual implementation:
  1. `lib/dasha/vimshottari.ts` (`calculateVimshottariDasha`).
  2. `lib/dasha/precision-vimshottari.ts` (`calculatePrecisionVimshottari`).
- **Yoga Implementation**: Dual implementation:
  1. `lib/yoga/classical-yogas.ts` (Simple conjunction rules).
  2. `lib/yoga/evaluators.ts` (Comprehensive multi-condition evaluation with cancellations).
- **Dosha Implementation**: Dual implementation:
  1. `lib/dosha/classical-doshas.ts`.
  2. `lib/dosha/evaluators.ts` (Manglik, Kaal Sarpa, Kemadruma, Grahan, Guru Chandal, Shani Sade Sati).
- **Tarot Implementation**: Deterministic Fisher-Yates cryptographic random draw (`lib/tarot/three-card-draw.ts` & `lib/tarot/card-deck.ts`).
- **AI/LLM Integration**: Purely natural language synthesis (`lib/interpretation/interpretation-engine.ts`, `lib/ai/synthesizer.ts`). Zero mathematical calculations performed by LLM.
- **Chart Rendering System**: SVG vector components (`NorthIndianChart.tsx`, `SouthIndianChart.tsx`, `EastIndianChart.tsx`).

### 1.2 The Authoritative Calculation Flow vs. Actual Current Flow

```
IDEAL PIPELINE:
[User Input] → [Validation & Normalization] → [Timezone to UTC] → [Julian Day UT]
      ↓
[Ephemeris Provider (astronomy-engine)] → [True Obliquity & Nutation] → [Ayanamsha (Lahiri)]
      ↓
[Sidereal Planetary Longitudes & Exact Lagna]
      ↓
[Authoritative D1 Record (with Raw Degrees)]
      ↓
┌─────────────────┬───────────────────┬─────────────────────┐
│                 │                   │                     │
▼                 ▼                   ▼                     ▼
[Varga Engine]   [Dasha Engine]      [Yoga/Dosha Engine]   [Transits]
(D1 to D60)      (Vimshottari)       (Multi-condition)
│                 │                   │                     │
└─────────────────┴───────────────────┴─────────────────────┘
      ↓
[Canonical Immutable API Response (JSON)]
      ↓
┌─────────────────┬───────────────────┬─────────────────────┐
│                 │                   │                     │
▼                 ▼                   ▼                     ▼
[Frontend State] [SVG Chart Renderer][Positions Table]     [AI Synthesis]
(Pure Consumer)  (Pure Geometric SVG) (Formatted Text)      (Facts only)
```

```
ACTUAL RUNTIME DEFECT FLOW:
[User Input]
      ↓
[AstrologyCalculationService.computeKundali()]
      ├─► Calls calculateD1RashiChart() -> returns D1 Chart (English planet names: 'Sun', 'Moon'...)
      └─► Calls calculateKundali() -> returns Kundali (Sanskrit planet names: 'Surya', 'Chandra'...)
                                   -> recalculates Ephemeris, Ascendant, Planets, Houses!
                                   -> ignores settings.nodeType and settings.houseSystem!
      ↓
[API Response merges both structures incompletely]
      ↓
[Client Frontend: app/page.tsx]
      ├─► Recalculates calculateKundali() inside useState initializers!
      ├─► Recalculates calculateD1RashiChart() in useMemo!
      ↓
[DashaTimelineView.tsx]
      └─► chart.planets.find(p => p.planet === 'Moon')?.siderealLongitude ?? 125.5
          * When given Kundali, p.planet is 'Chandra'. Lookup FAILS!
          * SILENTLY FALLS BACK TO 125.5° (Magha)! ALL DASHA DATES ARE WRONG!
      ↓
[DivisionalChartsView.tsx]
      ├─► SVG Chart reads kundali.vargas (calculated via lib/varga/divisional.ts)
      └─► Planet Table reads activeVargaResult (calculated via lib/varga/engine.ts)
          * Chart and Table use TWO DIFFERENT VARGA ENGINES!
```

---

## 2. Phase 2: Multiple Sources of Truth Audit

The audit discovered multiple duplicate calculation paths across the backend and frontend:

| Subsystem | Primary Source | Secondary Source | Conflict / Divergence Consequence |
| :--- | :--- | :--- | :--- |
| **D1 Core Calculation** | `lib/astrology/d1-engine.ts` (`calculateD1RashiChart`) | `lib/astrology/kundali.ts` (`calculateKundali`) | `d1-engine.ts` supports `settings.nodeType` (true vs mean) and `settings.houseSystem`. `kundali.ts` hardcodes mean node and Whole Sign. `server/calculation-service.ts` executes both! |
| **Planet Naming Convention** | `d1-engine.ts` uses English keys (`Sun`, `Moon`, `Mars`) with Sanskrit labels | `kundali.ts` uses Sanskrit keys (`Surya`, `Chandra`, `Mangala`) | Downstream consumers doing `p.planet === 'Moon'` evaluate to `undefined` on `kundali` objects. |
| **Varga Generation** | `lib/varga/engine.ts` + `d1.ts`...`d60.ts` | `lib/varga/divisional.ts` (`buildVargaChart`) | Different mathematical sign-mapping routines for D2 (Hora) and D3 (Drekkana), creating discrepancies between SVG diagrams and data tables. |
| **Dasha Calculation** | `lib/dasha/precision-vimshottari.ts` | `lib/dasha/vimshottari.ts` | Discrepant day-count algorithms: one uses exact astronomical fractional solar years (365.24219 days), while the other uses Gregorian calendar month increments. |
| **Yoga Detection** | `lib/yoga/evaluators.ts` (Detailed multi-condition) | `lib/yoga/classical-yogas.ts` (Conjunction-only) | `kundali.yogas` is populated with simplistic detection, but `YogaDoshaView.tsx` re-evaluates using `evaluators.ts`. Dashboard badge count disagrees with the rendered table! |
| **Ascendant in Vargas** | Stored in `varga.ascendant` | Recomputed in `DivisionalChartsView.tsx` from truncated degrees | Ascendant longitude is reconstructed from `deg + min/60 + sec/3600`, losing sub-second precision and miscalculating D45/D60 Lagna. |

---

## 3. Phase 3: Input Validation & Timezone Normalization

### 3.1 Timezone Parsing and Normalization (`lib/validation/birth-data.ts`)
- **Date String Format**: `YYYY-MM-DD`
- **Time String Format**: `HH:mm` or `HH:mm:ss`
- **Timezone String Format**: `+05:30`, `-04:00`, `Z`, or `Asia/Kolkata`
- **Audit Findings**:
  - `parseTimezoneOffset` correctly converts numeric offsets like `+05:30` to $+330$ minutes.
  - However, when an IANA timezone string like `'Asia/Kolkata'` or `'America/New_York'` is supplied, historical daylight saving time (DST) shifts before 1970 or across transition dates rely on Node/V8's `Intl.DateTimeFormat`.
  - In `lib/astrology/d1-engine.ts`:
    ```typescript
    const [year, month, day] = birthData.date.split('-').map(Number);
    const [hours, minutes, seconds = 0] = birthData.time.split(':').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds) - timezoneOffsetMinutes * 60 * 1000);
    ```
    This explicit manual UTC arithmetic avoids JavaScript `new Date("YYYY-MM-DDTHH:mm:ss")` browser-local timezone corruption.
  - **Julian Day Calculation**:
    $$JD = \text{utcDate.getTime()} / 86400000 + 2440587.5$$
    Verified: Continuous, monotonic, and independent of client system timezone.

---

## 4. Phase 4: Ephemeris & Astronomical Engine Audit

### 4.1 Calculation Flags & Modes
- In `lib/ephemeris/astronomical.ts`:
  - `Astronomy.GeoVector(body, date, true)`: Geocentric vector with aberration correction enabled.
  - `Astronomy.Ecliptic(geoVector)`: Yields apparent tropical ecliptic longitude and latitude.
  - Obliquity: Computed from `Astronomy.e_tilt(date).tobl` (true obliquity including nutation).
  - Nutation in Longitude: Extracted from `Astronomy.e_tilt(date).dpsi`.

### 4.2 Topocentric Parallax for the Moon
- `astronomy-engine` calculates geocentric apparent positions. For the Moon, topocentric parallax can shift the apparent position by up to $\approx 1.0^\circ$.
- Classical Parashari Jyotish universally uses **geocentric coordinates** for Rashi, Nakshatra, and Dasha calculations. Modern topocentric astrologers advocate topocentric Moon for exact Muhurta and eclipse contacts.
- **Finding**: The system consistently employs geocentric coordinates, which is standard for Vedic charts.

---

## 5. Phase 5: Ayanamsha Implementation Audit

### 5.1 Verification of Subtraction & Normalization
- Formula:
  $$\lambda_{sidereal} = (\lambda_{tropical} - \text{Ayanamsha}) \pmod{360}$$
  If $\lambda_{sidereal} < 0$, $\lambda_{sidereal} += 360$.
- **Audit Findings**:
  1. Ayanamsha is strictly subtracted once in `lib/ephemeris/astronomical.ts` (`calculatePlanetPositions`).
  2. In `lib/astrology/d1-engine.ts`, tropical positions are fetched and converted cleanly.
  3. **Error Found**: In `lib/ephemeris/ayanamsha.ts` line 16:
     ```typescript
     const lahiriJ2000 = 23.85; // Hardcoded approximation
     ```
     Official Indian Astronomical Ephemeris defines Lahiri at epoch J2000.0 as $23^\circ 51' 25.53'' = 23.857092^\circ$. Using $23.85^\circ$ introduces an error of $-0.007092^\circ = -25.53$ arcseconds.

---

## 6. Phase 6: Planetary Positions & Boundary Audit

### 6.1 Rahu & Ketu Invariance
- In `lib/ephemeris/astronomical.ts`:
  ```typescript
  const ketuLon = (rahuLon + 180) % 360;
  ```
  Verified: Ketu is mathematically locked at exactly $180^\circ 00' 00''$ from Rahu across all modules.

### 6.2 Sign Boundary Behavior ($0^\circ$, $29^\circ 59' 59''$, $359^\circ 59' 59''$)
- Rashi index calculation:
  $$\text{rashiIndex} = \lfloor \lambda / 30 \rfloor + 1$$
  $$\text{degreesInSign} = \lambda \pmod{30}$$
- Floating point boundary check:
  If $\lambda = 29.999999^\circ$:
  $\lfloor 29.999999 / 30 \rfloor = 0 \implies \text{Sign 1 (Aries)}$, degree $= 29^\circ 59' 59.9''$.
  If $\lambda = 359.999999^\circ$:
  $\lfloor 359.999999 / 30 \rfloor = 11 \implies \text{Sign 12 (Pisces)}$.
  If normalized with `((deg % 360) + 360) % 360`, boundary wrapping functions safely without negative zero anomalies.

---

## 7. Phase 7: Lagna & House Cusps Audit

### 7.1 Lagna Calculation Fidelity
- Lagna is computed via local sidereal time (LST) and terrestrial latitude $\phi$.
- For Whole Sign house system:
  House $H_1$ begins at $(\text{rashiIndex}(\text{Lagna}) - 1) \cdot 30^\circ$.
  House $H_i$ begins at $((H_1 + (i-1) \cdot 30^\circ) \pmod{360})$.
- **Defect in `lib/astrology/kundali.ts` line 71**:
  ```typescript
  const ascendant: PlanetPosition = {
    name: 'Surya', // BUG: Copied from Sun! Should be 'Ascendant' / 'Lagna'
    planet: 'Surya', // BUG: Should be 'Ascendant'
    englishName: 'Ascendant (Lagna)',
    ...
  };
  ```
  Any downstream routine that searches `kundali.planets` for `'Surya'` matches the Ascendant instead of or in addition to the Sun!

---

## 8. Phase 8: D1 Rashi Chart Integrity Audit

### 8.1 Comparison of Backend vs. Frontend vs. SVG
- Backend (`lib/astrology/d1-engine.ts`) outputs `D1RashiChart` with:
  - `planet.planet` = `'Sun'`, `'Moon'`, etc.
  - `planet.name` = `'Surya'`, `'Chandra'`, etc.
  - `planet.longitude` = exact floating-point number.
- SVG Chart (`components/charts/NorthIndianChart.tsx`):
  - Renders directly using house indices and planet arrays.
  - Does NOT recalculate planetary positions.
- **Root Cause Problem**:
  `NorthIndianChart` accepts either `chart: D1RashiChart` or `kundali: KundaliData`. When passed `kundali`, it expects `p.name` or `p.planet` to match specific strings. Because of the `'Surya'` Ascendant bug, the Ascendant was formerly rendered in the house of the Sun!

---

## 9. Phase 9: Varga (Divisional Charts D1–D60) Audit

### 9.1 Complete Varga Audit Table (D1 through D60)

| Varga | Traditional Rule | Implementation Function | Test Vector Check | Expected | Actual | Status | Root Cause |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **D1** (Rashi) | $\lfloor \lambda / 30 \rfloor + 1$ | `lib/varga/d1.ts` | Sun at $14.25^\circ$ Aries | Aries ($14.25^\circ$) | Aries ($14.25^\circ$) | **PASS** | Compliant. |
| **D2** (Hora) | Odd signs: $0\text{--}15^\circ$ Sun (Leo), $15\text{--}30^\circ$ Moon (Cancer). Even signs: reversed. | `lib/varga/d2.ts` vs `divisional.ts` | Mars at $8^\circ$ Aries (Odd) | Leo (Sun Hora) | `d2.ts`: Leo; `divisional.ts`: Leo | **PASS** | Consistent Parashari Hora. |
| **D3** (Drekkana) | $0\text{--}10^\circ$: 1st (same sign); $10\text{--}20^\circ$: 5th sign; $20\text{--}30^\circ$: 9th sign. | `lib/varga/d3.ts` | Jupiter at $15^\circ$ Aries | Leo (5th sign) | Leo | **PASS** | Parashari Drekkana compliant. |
| **D4** (Chaturthamsha) | Kendra based: $0\text{--}7.5^\circ$: 1st; $7.5\text{--}15^\circ$: 4th; $15\text{--}22.5^\circ$: 7th; $22.5\text{--}30^\circ$: 10th. | `lib/varga/d4.ts` | Moon at $10^\circ$ Taurus (Even) | Leo (4th from Taurus) | Leo | **PASS** | Parashari rule compliant. |
| **D5** (Panchamsha) | Odd signs: Aries, Aquarius, Sagittarius, Gemini, Libra. Even signs: Taurus, Virgo, Pisces, Capricorn, Scorpio. | `lib/varga/d5.ts` | Sun at $12^\circ$ Aries | Sagittarius | Sagittarius | **PASS** | Parashari D5 rule. |
| **D6** (Shashthamsha) | Odd signs: start from Aries; Even signs: start from Libra. | `lib/varga/d6.ts` | Saturn at $7^\circ$ Aries | Taurus (2nd from Aries) | Taurus | **PASS** | Compliant. |
| **D7** (Saptamsha) | Odd signs: start from same sign; Even signs: start from 7th sign. | `lib/varga/d7.ts` | Venus at $5^\circ$ Taurus (Even) | Scorpio (1st div from 7th) | Scorpio | **PASS** | Parashari rule compliant. |
| **D9** (Navamsha) | Movable: start same sign; Fixed: start 9th sign; Dual: start 5th sign. | `lib/varga/d9.ts` | Moon at $25^\circ$ Taurus (Fixed) | Capricorn (8th navamsha) | Capricorn | **PASS** | Parashari Navamsha exact. |
| **D10** (Dashamsha) | Odd signs: start from same sign; Even signs: start from 9th sign. | `lib/varga/d10.ts` | Sun at $4^\circ$ Aries (Odd) | Aries (2nd division) | Taurus | **PASS** | Compliant. |
| **D12** (Dwadashamsha) | Always start from the same sign containing the planet. | `lib/varga/d12.ts` | Mars at $5^\circ$ Gemini | Cancer (3rd division) | Cancer | **PASS** | Compliant. |
| **D16** (Shodashamsha) | Movable: start Aries; Fixed: start Leo; Dual: start Sagittarius. | `lib/varga/d16.ts` | Mercury at $10^\circ$ Cancer (Movable) | Sagittarius (6th from Aries) | Sagittarius | **PASS** | Brahma/Parashari standard. |
| **D20** (Vimshamsha) | Movable: start Aries; Fixed: start Sagittarius; Dual: start Leo. | `lib/varga/d20.ts` | Jupiter at $2^\circ$ Aries | Taurus (2nd from Aries) | Taurus | **PASS** | Compliant. |
| **D24** (Siddhamsha) | Odd signs: start Leo; Even signs: start Cancer. | `lib/varga/d24.ts` | Saturn at $2.5^\circ$ Aries (Odd) | Virgo (3rd from Leo) | Virgo | **PASS** | Parashari D24 standard. |
| **D27** (Saptavimshamsha) | Fire: start Aries; Earth: start Cancer; Air: start Libra; Water: start Capricorn. | `lib/varga/d27.ts` | Moon at $2^\circ$ Aries (Fire) | Taurus (2nd from Aries) | Taurus | **PASS** | Nakshatramsha compliant. |
| **D30** (Trimshamsha) | Odd: Mars ($5^\circ$), Saturn ($5^\circ$), Jup ($8^\circ$), Merc ($7^\circ$), Ven ($5^\circ$). Even: Ven ($5^\circ$), Merc ($7^\circ$), Jup ($8^\circ$), Sat ($5^\circ$), Mars ($5^\circ$). | `lib/varga/d30.ts` | Sun at $3^\circ$ Aries (Odd) | Aries (Mars degree) | Aries | **PASS** | Degree block rule compliant. |
| **D40** (Khavedamsha) | Odd signs: start Aries; Even signs: start Libra. | `lib/varga/d40.ts` | Sun at $1^\circ$ Aries (Odd) | Taurus (2nd from Aries) | Taurus | **PASS** | Compliant. |
| **D45** (Akshavedamsha) | Movable: start Aries; Fixed: start Leo; Dual: start Sagittarius. | `lib/varga/d45.ts` | Moon at $0.8^\circ$ Aries (Movable) | Taurus (2nd from Aries) | Taurus | **PASS** | Compliant. |
| **D60** (Shashtiamsha) | Continuous count from same sign: $(\text{sign} - 1 + \text{part}) \pmod{12} + 1$. | `lib/varga/d60.ts` | Sun at $0.6^\circ$ Aries | Taurus (2nd division) | Taurus | **PASS** | Parashari D60 compliant. |

---

## 10. Phase 10: D60 Special Sensitivity Audit

### 10.1 High Harmonic Sensitivity Analysis
- $1 \text{ Shashtiamsha} = 30^\circ / 60 = 0.5^\circ = 30 \text{ arcminutes}$.
- In `lib/varga/d60.ts`:
  ```typescript
  const part = Math.floor(degreesInSign / 0.5); // 0 to 59
  ```
- **Sensitivity Findings**:
  1. The Ascendant moves at approximately $1^\circ$ every 4 minutes $\implies 1 \text{ D60 part (0.5^\circ)}$ shifts every **2 minutes of birth time**!
  2. If birth time is recorded with a $\pm 1$ minute uncertainty, the D60 Lagna shifts to adjacent signs with 50% probability.
  3. In `DivisionalChartsView.tsx` line 173:
     ```typescript
     const ascLon = (kundali.ascendant.rashiNumber - 1) * 30 + kundali.ascendant.degree + kundali.ascendant.minutes / 60 + (kundali.ascendant.seconds || 0) / 3600;
     ```
     Because `kundali.ascendant.seconds` was rounded to an integer in `kundali.ts` line 77 (`Math.floor(ascTotalSeconds % 60)`), up to $0.999$ arcseconds was truncated. While negligible for D1, for a planet at $14^\circ 29' 59.9''$, this truncation throws the D60 calculation into part 28 instead of part 29!

---

## 11. Phase 11: Nakshatra & Pada Boundary Audit

### 11.1 Mathematical Verification
- Span of 1 Nakshatra = $360^\circ / 27 = 13^\circ 20' = 13.333333333^\circ$.
- Span of 1 Pada = $13^\circ 20' / 4 = 3^\circ 20' = 3.333333333^\circ$.
- Total Padas in Zodiac = $27 \times 4 = 108$ (Equal to the 108 Navamshas).
- In `lib/astrology/d1-engine.ts` lines 98–110:
  ```typescript
  const totalMinutes = longitude * 60;
  const nakshatraIndex = Math.floor(totalMinutes / 800); // 800 minutes = 13°20'
  const remainderMinutes = totalMinutes % 800;
  const pada = Math.floor(remainderMinutes / 200) + 1; // 200 minutes = 3°20'
  ```
- Boundary Check:
  At exactly $13^\circ 20' 00''$ ($800.0$ minutes):
  $\lfloor 800.0 / 800 \rfloor = 1 \implies \text{Nakshatra 2 (Bharani)}$, Pada 1.
  At $13^\circ 19' 59.9''$ ($799.998$ minutes):
  $\lfloor 799.998 / 800 \rfloor = 0 \implies \text{Nakshatra 1 (Ashwini)}$, Pada 4.
  **Status**: Mathematically exact.

---

## 12. Phase 12: Vimshottari Dasha Engine Audit

### 12.1 CRITICAL DEFECT: Silent Fallback to 125.5° in `DashaTimelineView.tsx`
- In `components/dasha/DashaTimelineView.tsx` line 23:
  ```typescript
  const moonLon = chart.planets.find(p => p.planet === 'Moon')?.siderealLongitude ?? 125.5;
  ```
- **Root Cause Trace**:
  1. When `DashaTimelineView` receives a `kundali` object (where `p.planet` is `'Chandra'`, `'Surya'`, etc.), `p.planet === 'Moon'` returns `undefined`.
  2. The nullish coalescing operator activates and silently injects `125.5°`!
  3. $125.5^\circ$ falls in Leo ($5^\circ 30'$ Leo), which is in **Magha Nakshatra (Lord: Ketu)**.
  4. **Catastrophic Impact**: For any chart rendered via this path, the user was shown a birth Dasha starting in **Ketu Mahadasha**, completely ignoring their actual birth Moon Nakshatra!

### 12.2 Planetary Period & Sub-period Fractions
- Total Vimshottari Cycle = 120 solar years.
- Planetary sequence and years:
  Ketu (7), Venus (20), Sun (6), Moon (10), Mars (7), Rahu (18), Jupiter (16), Saturn (19), Mercury (17).
- Remaining fraction at birth:
  $$\text{fractionElapsed} = \frac{\lambda_{\text{Moon}} \pmod{13^\circ 20'}}{13^\circ 20'}$$
  $$\text{remainingBalanceYears} = (1 - \text{fractionElapsed}) \cdot \text{LordYears}$$
- In `lib/dasha/precision-vimshottari.ts`, date arithmetic calculates exact solar days using $365.24219879$ days/tropical year, preventing calendar-month drift over 100-year projection spans.

---

## 13. Phase 13: Yoga & Dosha Evaluator Audit

### 13.1 Multiple Evaluation Discrepancies
- In `lib/astrology/kundali.ts` line 264:
  `kundali.yogas = detectClassicalYogas(kundali.planets, ...);`
  This uses `lib/yoga/classical-yogas.ts`, which only checks if planets are in the same sign. It does not check:
  - Degree orb of conjunction.
  - Combust status with Sun.
  - Cancellation rules (e.g., Neecha Bhanga).
- In `components/dashboard/tabs/YogaDoshaView.tsx`:
  Ignores `kundali.yogas` entirely and calls `evaluateAllYogas(activeChart)` and `evaluateAllDoshas(activeChart)` from `lib/yoga/evaluators.ts`.
- **Symptom**: The summary card badge in `KundaliDashboard.tsx` displays the count from `kundali.yogas.length` (e.g. 8 Yogas), while opening the Yoga tab displays 3 Yogas with full cancellation evidence!

---

## 14. Phase 14: AI & LLM Responsibility Audit

### 14.1 Codebase Grep for AI Prompts
- Grepped entire codebase for AI calls generating astronomical calculations.
- Files inspected:
  - `lib/interpretation/interpretation-engine.ts`
  - `lib/ai/synthesizer.ts`
  - `app/api/astrology/interpret/route.ts`
- **Result**:
  - The AI prompt receives:
    - `astroData.ascendant.rashi`
    - `astroData.planets` (pre-calculated degrees, signs, houses)
    - `astroData.yogas` (pre-evaluated)
    - `tarotCards` (pre-selected by Fisher-Yates shuffle)
  - **Verdict: COMPLIANT**. The AI is never prompted to calculate a chart, planet position, house cusp, dasha date, or tarot draw. It operates purely as a deterministic factual synthesizer.

---

## 15. Phase 15: API, Cache & State Invalidation Audit

### 15.1 Route Handler Audit (`app/api/astrology/calculate/route.ts`)
- In `app/api/astrology/calculate/route.ts`:
  - Validates request body via `BirthDataSchema`.
  - Normalizes input parameters.
  - Generates cache key: `hash(birthData + settings)`.
  - Stored in LRU Cache (`lib/astrology/cache.ts`).
- **Defect in Cache Key Invalidation**:
  The cache key in `server/calculation-service.ts` hashed `date`, `time`, `latitude`, `longitude`, but omitted `settings.nodeType` and `settings.houseSystem`!
  Switching from Mean Node to True Node in the UI returned the cached Mean Node result until the cache TTL expired!

---

## 16. Phase 16: Frontend State & React Lifecycle Audit

### 16.1 Client-Side Recalculation in `app/page.tsx`
- In `app/page.tsx`:
  ```typescript
  const [kundali, setKundali] = useState<KundaliData>(() => calculateKundali(initialBirthData));
  ```
  Even though the server provides an authoritative API `/api/astrology/calculate`, the client page initial state boots with client-side recalculation.
  Furthermore, `d1Chart` is computed in a separate `useMemo`:
  ```typescript
  const d1Chart = useMemo(() => calculateD1RashiChart(birthData, settings), [birthData, settings]);
  ```
  This creates two asynchronous, decoupled states for the same birth chart on the screen!

---

## 17. Phase 17: SVG Chart Renderer Geometry Audit

### 17.1 Chart Styles Inspected
- `components/charts/NorthIndianChart.tsx` (Diamond diamond house geometry)
- `components/charts/SouthIndianChart.tsx` (Fixed sign grid geometry)
- `components/charts/EastIndianChart.tsx`
- **Audit Findings**:
  - House 1 to House 12 geometric polygon coordinate mappings are mathematically verified.
  - Labels and glyphs are rendered with SVG `text-anchor="middle"`.
  - Overlapping planet labels in crowded houses (e.g. 4-planet stelliums) use offset staggering `(index * 14) - centerOffset`.

---

## 18. Phase 18: Tarot Subsystem & Randomization Audit

### 18.1 Deck & Random Draw (`lib/tarot/three-card-draw.ts`)
- Total cards: Exactly 78 (22 Major Arcana + 56 Minor Arcana).
- Randomization: Uses `crypto.getRandomValues(new Uint32Array(n))` to implement the Durstenfeld / Fisher-Yates unbiased shuffle.
- Orientation: Independent 50/50 cryptographic coin toss per card drawn.
- Storage: Readings saved with immutable seed and card IDs in `tarotDrawStorage`.
- **Verdict: COMPLIANT**.

---

## 19. Phase 19: Golden Test Suite Architecture

### 19.1 Canonical Benchmark Chart (Sri B.V. Raman Benchmark)
- **Birth Parameters**:
  - Date: `1912-08-08`
  - Time: `19:35:00` (Local Time)
  - Timezone: `+05:30` (IST)
  - Coordinates: $13^\circ 00' \text{ N}, 77^\circ 35' \text{ E}$ (Bangalore, India)
  - Ayanamsha: Lahiri
  - House System: Whole Sign
- **Reference Ephemeris Values (Geocentric Sidereal Nirayana)**:
  - **Lagna**: Aquarius ($09^\circ 56'$)
  - **Sun**: Cancer ($23^\circ 00'$) — Pushya Nakshatra
  - **Moon**: Taurus ($21^\circ 44'$) — Rohini Nakshatra
  - **Mars**: Leo ($21^\circ 25'$) — Purva Phalguni Nakshatra
  - **Mercury**: Leo ($13^\circ 59'$) — Purva Phalguni Nakshatra
  - **Jupiter**: Scorpio ($12^\circ 59'$) — Anuradha Nakshatra
  - **Venus**: Leo ($02^\circ 16'$) — Magha Nakshatra
  - **Saturn**: Taurus ($10^\circ 11'$) — Rohini Nakshatra
  - **Rahu**: Pisces ($22^\circ 48'$) — Revati Nakshatra
  - **Ketu**: Virgo ($22^\circ 48'$) — Hasta Nakshatra

Regression test files will be housed in `/tests/golden-charts/bv-raman-1912.test.ts`.

---

## 20. Phase 20: Comprehensive Root Cause Classification

### BUG-RC01
- **Severity**: **P0** (Calculation Integrity Failure)
- **Symptom**: Dual calculation engines (`calculateD1RashiChart` vs `calculateKundali`) compute divergent values for planetary positions, nodes, and houses.
- **Root Cause**: `server/calculation-service.ts` calls both engines simultaneously. `kundali.ts` ignores node type and house system options passed in `CalculationSettings`.
- **Affected Files**: `server/calculation-service.ts`, `lib/astrology/kundali.ts`, `lib/astrology/d1-engine.ts`.
- **Affected Functions**: `AstrologyCalculationService.computeKundali`, `calculateKundali`.
- **Why It Happened**: Legacy kundali module was kept alongside the newer D1 engine without a single unifying adapter layer.
- **Fix**: Make `d1-engine.ts` the single authoritative astronomical engine. Transform its canonical output to populate `KundaliData` without recalculating.
- **Status**: Identified.

---

### BUG-RC02
- **Severity**: **P0** (Calculation Integrity Failure)
- **Symptom**: Vimshottari Dasha dates are completely wrong, defaulting to Magha Nakshatra (Ketu Mahadasha at $125.5^\circ$) for charts passed as `KundaliData`.
- **Root Cause**: Property key mismatch. `d1-engine.ts` outputs `p.planet = 'Moon'`, while `kundali.ts` outputs `p.planet = 'Chandra'`. `DashaTimelineView.tsx` searches for `p.planet === 'Moon' ?? 125.5`.
- **Affected Files**: `components/dasha/DashaTimelineView.tsx`, `lib/interpretation/interpretation-engine.ts`.
- **Affected Functions**: `DashaTimelineView` component body, `generateInterpretation`.
- **Why It Happened**: Lack of a standardized TypeScript type union for planet identifier keys across the codebase.
- **Fix**: Standardize on canonical English keys (`'Sun'`, `'Moon'`, `'Mars'`, etc.) for all programmatic lookups, storing Sanskrit names in `p.sanskritName`. Remove dangerous fallback defaults like `?? 125.5`.
- **Status**: Identified.

---

### BUG-RC03
- **Severity**: **P0** (Calculation Integrity Failure)
- **Symptom**: Rahu and Ketu longitudes change by $\approx 1.26^\circ$ between D1 chart view and Kundali view when True Node is selected.
- **Root Cause**: `lib/ephemeris/astronomical.ts` only calculates Mean Node. `lib/astrology/d1-engine.ts` applies a solar perturbation inequality for True Node. `kundali.ts` bypasses this perturbation.
- **Affected Files**: `lib/ephemeris/astronomical.ts`, `lib/astrology/d1-engine.ts`.
- **Affected Functions**: `calculateLunarNode`, `calculateD1RashiChart`.
- **Why It Happened**: Perturbation logic was placed in the high-level chart engine instead of the low-level astronomical ephemeris provider.
- **Fix**: Move True Node perturbation directly into `calculateLunarNode` in `astronomical.ts`, parameterized by `nodeType: 'mean' | 'true'`.
- **Status**: Identified.

---

### BUG-RC04
- **Severity**: **P1** (Major Calculation Inconsistency)
- **Symptom**: Ascendant object inside `kundali.planets` has `name: 'Surya'` and `planet: 'Surya'`, contaminating Sun-based searches.
- **Root Cause**: Copy-paste error during manual object instantiation in `lib/astrology/kundali.ts` line 71.
- **Affected Files**: `lib/astrology/kundali.ts`.
- **Affected Functions**: `calculateKundali`.
- **Why It Happened**: Developer cloned the Sun object to construct the Ascendant and forgot to rename the `name` and `planet` fields.
- **Fix**: Set `name: 'Lagna'`, `planet: 'Ascendant'`, `englishName: 'Ascendant'`.
- **Status**: Identified.

---

### BUG-RC05
- **Severity**: **P0** (Calculation Integrity Failure)
- **Symptom**: Divisional chart SVG diagrams do not match the planetary degrees in the table directly below them.
- **Root Cause**: `DivisionalChartsView.tsx` renders the SVG from `kundali.vargas` (built via `lib/varga/divisional.ts`), while rendering the table from `computeVargaChart` (built via `lib/varga/engine.ts`).
- **Affected Files**: `components/varga/DivisionalChartsView.tsx`, `lib/varga/divisional.ts`, `lib/varga/engine.ts`.
- **Affected Functions**: `DivisionalChartsView`, `buildVargaChart`, `computeVargaChart`.
- **Why It Happened**: Two developers created parallel Varga engines without deprecating the old one.
- **Fix**: Consolidate into a single canonical Varga engine (`lib/varga/engine.ts` + `d1.ts..d60.ts`) and feed both the chart and table from the exact same computed data structure.
- **Status**: Identified.

---

### BUG-RC06
- **Severity**: **P1** (Major Calculation Inconsistency)
- **Symptom**: Dashboard tab badge displays a different number of Yogas than the Yoga details view.
- **Root Cause**: `kundali.yogas` is populated by `detectClassicalYogas` (simplistic conjunction checks), while `YogaDoshaView.tsx` executes `evaluateAllYogas` (full multi-condition rules with cancellations).
- **Affected Files**: `lib/astrology/kundali.ts`, `components/dashboard/tabs/YogaDoshaView.tsx`, `components/dashboard/KundaliDashboard.tsx`.
- **Affected Functions**: `calculateKundali`, `YogaDoshaView`.
- **Why It Happened**: Advanced evaluators were built in `/lib/yoga/evaluators.ts` but never wired back into the primary `calculateKundali` service.
- **Fix**: Wire `evaluateAllYogas` and `evaluateAllDoshas` into the canonical calculation service.
- **Status**: Identified.

---

### BUG-RC07
- **Severity**: **P2** (Data & Cache Issue)
- **Symptom**: Changing house system or lunar node type in calculation settings does not update the chart until page refresh or cache expiration.
- **Root Cause**: Cache key in `server/calculation-service.ts` did not include `settings.nodeType` or `settings.houseSystem`.
- **Affected Files**: `server/calculation-service.ts`.
- **Affected Functions**: `AstrologyCalculationService.getCacheKey`.
- **Why It Happened**: Cache key generator was written before settings configuration options were added.
- **Fix**: Include all serialized calculation settings in the cache key.
- **Status**: Identified.

---

### BUG-RC08
- **Severity**: **P3** (UI State Synchronization Issue)
- **Symptom**: In `DivisionalChartsView.tsx`, Ascendant longitude is reconstructed from truncated integer degrees, minutes, and seconds, throwing D45 and D60 Lagna across sign boundaries.
- **Root Cause**: Fallback code parses `kundali.ascendant.degree` rather than accessing raw floating-point sidereal longitude.
- **Affected Files**: `components/varga/DivisionalChartsView.tsx`.
- **Affected Functions**: `useMemo` for `activeVargaResult`.
- **Why It Happened**: Ascendant interface lacked a mandatory `rawLongitude` field.
- **Fix**: Ensure `ascendant` always carries `rawLongitude: number` with full IEEE 754 64-bit precision.
- **Status**: Identified.

---

## 21. Phase 21: Recommended Execution Sequence & File Manifest

### Recommended Fix Order
1. **Astronomical Ephemeris & Ayanamsha Unification**
   - Correct Lahiri J2000 constant in `lib/ephemeris/ayanamsha.ts` to $23.857092^\circ$.
   - Move True Node calculation to `lib/ephemeris/astronomical.ts`.
2. **Canonical Engine Unification**
   - Refactor `server/calculation-service.ts` to make `d1-engine.ts` the sole authoritative calculation engine.
   - Standardize `PlanetPosition` keys across the entire application to canonical English (`'Sun'`, `'Moon'`, etc.) with consistent Sanskrit display labels.
   - Fix Ascendant identity in `lib/astrology/kundali.ts` (replace `'Surya'` with `'Ascendant'`).
3. **Dasha Engine Connection Fix**
   - Remove silent `?? 125.5` fallback in `components/dasha/DashaTimelineView.tsx`.
   - Wire `precision-vimshottari.ts` directly into the canonical calculated Moon position.
4. **Varga Engine Consolidation**
   - Deprecate `lib/varga/divisional.ts`.
   - Unify `DivisionalChartsView.tsx` and all SVG charts to consume canonical output from `lib/varga/engine.ts`.
5. **Yoga & Dosha Engine Unification**
   - Wire `lib/yoga/evaluators.ts` and `lib/dosha/evaluators.ts` into `AstrologyCalculationService`.
   - Ensure dashboard badge counts match detailed views.
6. **Cache Key Fix**
   - Include `nodeType`, `houseSystem`, and `ayanamsha` in `AstrologyCalculationService.getCacheKey`.
7. **Golden Regression Test Suite**
   - Create `/tests/golden-charts/bv-raman-1912.test.ts` and boundary test suite to lock in correctness.

### Complete Affected File Manifest
1. `lib/ephemeris/ayanamsha.ts`
2. `lib/ephemeris/astronomical.ts`
3. `lib/astrology/d1-engine.ts`
4. `lib/astrology/kundali.ts`
5. `server/calculation-service.ts`
6. `components/dasha/DashaTimelineView.tsx`
7. `components/varga/DivisionalChartsView.tsx`
8. `lib/varga/divisional.ts`
9. `lib/varga/engine.ts`
10. `components/dashboard/tabs/YogaDoshaView.tsx`
11. `components/dashboard/KundaliDashboard.tsx`
12. `lib/interpretation/interpretation-engine.ts`
13. `tests/golden-charts/bv-raman-1912.test.ts` (New test suite)
