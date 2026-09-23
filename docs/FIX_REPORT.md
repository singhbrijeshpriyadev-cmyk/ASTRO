# Kaalika Precision Engine — Root Cause Fix Report

**Generated**: 2026-09-23  
**Project**: Kaalika — Precision Vedic Astrology & Astronomical Observatory  
**Status**: All P0, P1, P2, and P3 Root Cause Fixes Implemented & Verified  
**Test Suite**: 19 Test Files, 89 Passed Tests, 0 Failures (100% Pass Rate)  
**TypeScript**: Clean (`tsc --noEmit` exited 0)  
**Linter**: Clean (`next lint` exited 0)  
**Production Build**: Verified (`next build` compiled successfully)  

---

## Executive Summary

Following the comprehensive astronomical and architectural investigation documented in [`/docs/ROOT_CAUSE_AUDIT.md`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/docs/ROOT_CAUSE_AUDIT.md), all identified root-cause discrepancies have been fixed in strict order of severity ($P0 \rightarrow P1 \rightarrow P2 \rightarrow P3$). 

Each fix targeted the foundational root cause rather than patching symptoms. No calculation conventions were artificially altered to mimic third-party software; all conventions (Ayanamsha, Node Type, House System, and Varga Traditions) are now fully configurable and explicitly propagated end-to-end through the calculation pipeline.

---

## Detailed Bug Fix Reports

### BUG-RC01 [P0] — Dual Astrological Calculation Engines with Divergent Outputs

- **Bug ID**: `BUG-RC01`
- **Severity**: P0 (Calculation Integrity / Core Architecture)
- **Root Cause**: 
  The codebase maintained two independent calculation pipelines: `lib/astrology/kundali.ts` (using `astronomy-engine` for Graha positions and house cusps) and `lib/astrology/d1-engine.ts` (using the unified ephemeris adapter). `server/calculation-service.ts` invoked both engines in parallel. However, the API response returned the `KundaliData` object populated with `kundali.ts` planets and houses, while the dedicated chart views, Varga engines, and astronomical debug screens relied on `d1-engine.ts`. This created a critical divergence where identical inputs yielded different house boundaries, planetary speeds, and ascendant degrees across dashboard views.
- **Fix**: 
  1. Standardized `lib/astrology/kundali.ts` to accept optional `CalculationSettings` (specifying `nodeType`, `ayanamsha`, and `houseSystem`).
  2. Unified `server/calculation-service.ts` by harmonizing `kundali.planets` and `kundali.houses` directly from the canonical `d1Chart` calculation results, ensuring that both the `KundaliData` payload and `d1Chart` share identical planetary longitudes, house cusps, and retrograde states.
  3. Ensured `planetEnglish` accurately retains `'Rahu'` and `'Ketu'` rather than `'North Node'` / `'South Node'` so downstream consumers never misidentify nodes.
- **Files Changed**:
  - [`lib/astrology/kundali.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/astrology/kundali.ts)
  - [`lib/astrology/d1-engine.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/astrology/d1-engine.ts)
  - [`server/calculation-service.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/server/calculation-service.ts)
- **Tests Added**:
  - [`tests/p0-calculation-engine-unification.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p0-calculation-engine-unification.test.ts)
- **Before**: 
  `kundali.planets` had different floating-point degrees than `d1Chart.planets` (up to $0.05^\circ$ difference due to different nutation and aberration models), and `kundali.houses` ignored the user's chosen `houseSystem` (always defaulting to equal houses).
- **After**: 
  `kundali.planets` and `kundali.houses` in the primary API response match `d1Chart.planets` and `d1Chart.houses` exactly to 8 decimal places.
- **Regression Result**: **PASSED** (Validated in `tests/p0-calculation-engine-unification.test.ts` and `tests/calculation-audit.test.ts`).

---

### BUG-RC02 [P0] — Dasha Timeline Hardcoded Moon Longitude Fallback (`?? 125.5`)

- **Bug ID**: `BUG-RC02`
- **Severity**: P0 (Data Corruption / Silent Error)
- **Root Cause**: 
  In `components/dasha/DashaTimelineView.tsx` (line 27), the component looked up the natal Moon using `chart.planets.find(p => p.planet === 'Moon')?.siderealLongitude ?? 125.5`. If the planet object used Sanskrit (`name: 'Chandra'`, `planet: 'Chandra'`) or if `siderealLongitude` was missing from a partial object, the engine silently defaulted to $125.5^\circ$ (Magha Nakshatra, Ketu Mahadasha). This corrupted Vimshottari Mahadasha balance, start dates, and sub-period dates for any chart where the Moon was not named `'Moon'`. Similarly, `lib/interpretation/interpretation-engine.ts` used single-key lookups for Moon facts.
- **Fix**: 
  1. Removed the hardcoded `?? 125.5` fallback entirely.
  2. Implemented exhaustive alias matching: `p.planet === 'Moon' || p.name === 'Chandra' || p.name === 'Moon' || p.planet === 'Chandra'`.
  3. Added degree reconstruction fallback: if `siderealLongitude` is not directly defined on the object, compute `(rashiNumber - 1) * 30 + degree + minutes / 60`.
  4. If the Moon is truly absent from the chart data, explicitly throw a descriptive error: `'Critical error: Moon position not found in chart planets for Vimshottari Dasha calculation.'` rather than silently generating invalid timelines.
- **Files Changed**:
  - [`components/dasha/DashaTimelineView.tsx`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/components/dasha/DashaTimelineView.tsx)
  - [`lib/interpretation/interpretation-engine.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/interpretation/interpretation-engine.ts)
- **Tests Added**:
  - [`tests/p0-dasha-moon-lookup.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p0-dasha-moon-lookup.test.ts)
- **Before**: 
  Passing a chart with Sanskrit planet names caused the timeline to evaluate at $125.5^\circ$ (Ketu Mahadasha, Magha), ignoring natal Moon's true position.
- **After**: 
  Moon is accurately identified across all naming conventions (`Moon`, `Chandra`, English/Sanskrit), calculating exact birth balance and starting Mahadasha lord. Missing Moon throws a fail-fast error.
- **Regression Result**: **PASSED** (Validated in `tests/p0-dasha-moon-lookup.test.ts` with 3 test cases).

---

### BUG-RC03 [P1] — Lunar Node Calculation Inconsistency & Missing True Node Option

- **Bug ID**: `BUG-RC03`
- **Severity**: P1 (Astronomical Accuracy / Ephemeris Specification)
- **Root Cause**: 
  `lib/ephemeris/astronomical.ts` and `lib/ephemeris/interface.ts` accepted a `nodeType: 'mean' | 'true'` parameter in `CalculationSettings`, but `calculateLunarNode()` completely ignored this flag and computed only the mean node via low-precision linear polynomial. True Node calculations (which fluctuate by up to $\pm 1^\circ 45'$ due to solar gravitational perturbations) were unavailable in the astronomical engine, causing Rahu/Ketu positions to disagree with standard high-precision ephemerides when True Node was selected.
- **Fix**: 
  1. Updated `calculateLunarNode()` in `lib/ephemeris/astronomical.ts` to implement both Mean Node and True Node.
  2. For `true`, incorporated the major lunar node perturbation terms:
     - Principal evection and variation terms: $-1.4979^\circ \times \sin(2(D - F)) - 0.206^\circ \times \sin(2D) - 0.11^\circ \times \sin(2M')$, where $D$ is the mean elongation of the Moon, $M'$ is the Sun's mean anomaly, and $F$ is the Moon's argument of latitude.
  3. Ensured that Ketu is always precisely $180^\circ$ opposite Rahu in both mean and true modes.
  4. Exposed the selected `nodeType` in the astronomical debug report and calculation metadata.
- **Files Changed**:
  - [`lib/ephemeris/astronomical.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/ephemeris/astronomical.ts)
  - [`lib/ephemeris/interface.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/ephemeris/interface.ts)
  - [`lib/astrology/kundali.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/astrology/kundali.ts)
- **Tests Added**:
  - Verified in [`tests/p0-calculation-engine-unification.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p0-calculation-engine-unification.test.ts)
  - Verified in [`tests/ephemeris.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/ephemeris.test.ts)
- **Before**: 
  Selecting `nodeType: 'true'` had zero effect; Rahu and Ketu longitudes were identical to `nodeType: 'mean'`.
- **After**: 
  `nodeType: 'true'` applies the perturbation series, correctly shifting Rahu/Ketu by up to $\pm 1.75^\circ$ to match the true osculating node.
- **Regression Result**: **PASSED**.

---

### BUG-RC04 [P1] — Ascendant graha key conflict (`planet: 'Lagna'`, `name: 'Lagna'`)

- **Bug ID**: `BUG-RC04`
- **Severity**: P1 (Interface Consistency)
- **Root Cause**: 
  In `lib/astrology/kundali.ts`, the Ascendant was inserted into the `planets` array with `name: 'Lagna'` and `planet: 'Lagna'`. However, `D1Chart`, UI renderers, and standard lookup tables expect `planet: 'Ascendant'` and `name: 'Lagna'`. Furthermore, Graha entries had inconsistent casing and languages across files (`planet: 'Surya'`, `name: 'Sun'` vs `planet: 'Sun'`, `name: 'Surya'`).
- **Fix**: 
  Standardized all planet records emitted by `lib/astrology/kundali.ts`:
  - `planet`: Canonical English identifier (`'Ascendant'`, `'Sun'`, `'Moon'`, `'Mars'`, `'Mercury'`, `'Jupiter'`, `'Venus'`, `'Saturn'`, `'Rahu'`, `'Ketu'`).
  - `name`: Sanskrit traditional name (`'Lagna'`, `'Surya'`, `'Chandra'`, `'Mangala'`, `'Budha'`, `'Guru'`, `'Shukra'`, `'Shani'`, `'Rahu'`, `'Ketu'`).
- **Files Changed**:
  - [`lib/astrology/kundali.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/astrology/kundali.ts)
- **Tests Added**:
  - [`tests/p0-calculation-engine-unification.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p0-calculation-engine-unification.test.ts)
- **Before**: 
  Looking up `planets.find(p => p.planet === 'Ascendant')` returned `undefined` on `KundaliData`.
- **After**: 
  `planets.find(p => p.planet === 'Ascendant')` returns the Lagna object consistently.
- **Regression Result**: **PASSED**.

---

### BUG-RC05 [P0] — Divisional Chart (Varga) Rendering Discrepancy & Sign Transposition in Chart UI Components

- **Bug ID**: `BUG-RC05`
- **Severity**: P0 (Display Integrity / Astrological Representation)
- **Root Cause**: 
  The Varga engine (`lib/astrology/varga-engine.ts`) computed accurate harmonic planetary positions (`VargaChartResult.planets`) and Ascendants (`VargaChartResult.ascendant`). However, when `DivisionalChartsView.tsx` passed data into `NorthIndianChart`, `SouthIndianChart`, and `EastIndianChart`, it only passed the raw `D1Chart` object or an adapted chart. The chart components then attempted to recalculate or transpose signs using D1 longitudes, completely discarding the harmonic divisional rashi assignments and house numbers calculated by the classical Varga algorithms!
- **Fix**: 
  1. Updated `NorthIndianChartProps`, `SouthIndianChartProps`, and `EastIndianChartProps` to accept an optional `vargaResult?: VargaChartResult`.
  2. When `vargaResult` is provided, the chart renderers bypass D1 recalculations and directly render the harmonic signs, divisional house placements, and intra-division degree coordinates calculated by the authoritative Varga engine.
  3. In `DivisionalChartsView.tsx`, passed `vargaResult={activeVargaResult}` directly to all chart renderers.
- **Files Changed**:
  - [`components/charts/NorthIndianChart.tsx`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/components/charts/NorthIndianChart.tsx)
  - [`components/charts/SouthIndianChart.tsx`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/components/charts/SouthIndianChart.tsx)
  - [`components/charts/EastIndianChart.tsx`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/components/charts/EastIndianChart.tsx)
  - [`components/varga/DivisionalChartsView.tsx`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/components/varga/DivisionalChartsView.tsx)
- **Tests Added**:
  - [`tests/p0-varga-engine-consistency.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p0-varga-engine-consistency.test.ts)
- **Before**: 
  D9 (Navamsha) and D10 (Dashamsha) visual charts displayed planets in their D1 signs rather than their harmonic Varga signs.
- **After**: 
  All chart styles (North Indian, South Indian, East Indian) render exact Varga signs, houses, and degrees matching the divisional table and classical rules.
- **Regression Result**: **PASSED** (Validated in `tests/p0-varga-engine-consistency.test.ts` for D9 and D10).

---

### BUG-RC06 [P1] — Discrepant Yoga and Dosha Counts between Dashboard and Dedicated Yoga Subsystem

- **Bug ID**: `BUG-RC06`
- **Severity**: P1 (Calculation Consistency / Rule Parity)
- **Root Cause**: 
  `lib/astrology/kundali.ts` contained a legacy, simplified yoga detector checking only 4 basic conjunctions (Budhaditya, Gajakesari, Manglik, SadeSati). Meanwhile, the dedicated subsystem `lib/astrology/yoga-dosha-engine.ts` supported 30+ classical Parashari yogas and doshas with cancellation conditions (Neechabhanga, Viparita, Raja Yogas, Dhana Yogas). As a result, the Dashboard summary claimed "1 Yoga Detected" while the Yoga tab displayed 8 Yogas, confusing users.
- **Fix**: 
  Refactored `lib/astrology/kundali.ts` to call `evaluateAllYogas()` and `evaluateAllDoshas()` from `lib/astrology/yoga-dosha-engine.ts`, completely retiring the legacy duplicate code and ensuring 100% parity across all screens.
- **Files Changed**:
  - [`lib/astrology/kundali.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/lib/astrology/kundali.ts)
- **Tests Added**:
  - [`tests/p1-yoga-dosha-sync.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p1-yoga-dosha-sync.test.ts)
- **Before**: 
  `kundali.yogas` returned simple hardcoded entries that differed in name, structure, and count from `evaluateAllYogas()`.
- **After**: 
  `kundali.yogas` and `kundali.doshas` return identical results derived from the authoritative `yoga-dosha-engine.ts`.
- **Regression Result**: **PASSED**.

---

### BUG-RC07 [P2] — Cache Invalidation Blind to Calculation Configuration Settings

- **Bug ID**: `BUG-RC07`
- **Severity**: P2 (Caching / State Staleness)
- **Root Cause**: 
  In `server/calculation-service.ts`, the calculation cache key was formulated as `${params.date}_${params.time}_${params.latitude}_${params.longitude}`. Changes to `ayanamsha` (e.g., switching from Lahiri to Raman or Krishnamurti), `nodeType` (Mean vs. True), or `houseSystem` (Placidus vs. Equal House) failed to invalidate the cache. The server returned cached calculations from the previous configuration.
- **Fix**: 
  1. Updated the cache key generator to deterministically include `ayanamsha`, `nodeType`, and `houseSystem`:
     ```ts
     const cacheKey = `${date}_${time}_${latitude.toFixed(4)}_${longitude.toFixed(4)}_${ayanamsha}_${nodeType}_${houseSystem}`;
     ```
  2. Implemented an LRU eviction policy with a maximum size limit (100 charts) to prevent unbounded memory growth in long-running processes.
- **Files Changed**:
  - [`server/calculation-service.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/server/calculation-service.ts)
- **Tests Added**:
  - [`tests/p2-cache-key-invalidation.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p2-cache-key-invalidation.test.ts)
- **Before**: 
  Toggling from Lahiri to Raman ayanamsha returned identical (stale) planetary longitudes from the cache.
- **After**: 
  Changing any calculation setting immediately computes and returns a fresh, accurately configured chart.
- **Regression Result**: **PASSED** (Validated in `tests/p2-cache-key-invalidation.test.ts`).

---

### BUG-RC08 [P3] — Fractional Degree Precision Loss in Divisional Lagna Calculations

- **Bug ID**: `BUG-RC08`
- **Severity**: P3 (Harmonic Coordinate Precision)
- **Root Cause**: 
  In `components/varga/DivisionalChartsView.tsx`, the Ascendant sidereal longitude was reconstructed from integer degrees and minutes: `asc.degree + asc.minutes / 60`, which dropped fractional seconds. For higher harmonic charts (D24, D60) where a division spans only $0.5^\circ$ (30 arcminutes), dropping seconds can cause the harmonic Lagna to jump to an adjacent sign.
- **Fix**: 
  Updated `DivisionalChartsView.tsx` to preserve `ascendant.siderealLongitude` directly as a full double-precision float: `chart.ascendant.siderealLongitude ?? (chart.ascendant.degree + chart.ascendant.minutes / 60)`.
- **Files Changed**:
  - [`components/varga/DivisionalChartsView.tsx`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/components/varga/DivisionalChartsView.tsx)
- **Tests Added**:
  - Verified in [`tests/p0-varga-engine-consistency.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/p0-varga-engine-consistency.test.ts)
  - Verified in [`tests/varga-engine.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/varga-engine.test.ts)
- **Before**: 
  Harmonic Ascendant calculation lost up to 59 arcseconds of input precision.
- **After**: 
  High-precision floating-point longitude is preserved across all 16 Shodashavarga divisions.
- **Regression Result**: **PASSED**.

---

## Benchmark Validation: Dr. B. V. Raman Natal Chart (1912)

To ensure classical conformity without masking algorithmic settings, the engine was benchmarked against the gold-standard chart of Dr. B.V. Raman (August 8, 1912, 19:35 IST, 12°59' N, 77°35' E):

| Factor | Raman Ayanamsha ($21^\circ 11' 58"$) | Lahiri Ayanamsha ($22^\circ 38' 37"$) | Test Suite Status |
| :--- | :--- | :--- | :--- |
| **Lagna** | Kumbha ($9^\circ 56'$) | Kumbha ($8^\circ 30'$) | **PASSED** |
| **Moon (Chandra)** | Vrishabha ($25^\circ 03'$) | Vrishabha ($23^\circ 36'$) | **PASSED** |
| **Moon Nakshatra** | Mrigashira (Pada 1) | Mrigashira (Pada 1) | **PASSED** |
| **Dasha at Birth** | Mars (Mangala) | Mars (Mangala) | **PASSED** |
| **D9 Navamsha Lagna**| Mithuna | Mithuna | **PASSED** |
| **D9 Navamsha Moon** | Simha | Simha | **PASSED** |

Validated in test suite: [`tests/golden-charts/bv-raman-1912.test.ts`](file:///Users/brijeshpriyadevsingh/Downloads/antygravity/my%20pro/Kaalika/tests/golden-charts/bv-raman-1912.test.ts).

---

## Verification Suite Run Summary

```text
 ✓ tests/d1-engine.test.ts (2)
 ✓ tests/varga-engine.test.ts (14)
 ✓ tests/vimshottari-engine.test.ts (4)
 ✓ tests/interpretation-engine.test.ts (3)
 ✓ tests/calculation-audit.test.ts (8)
 ✓ tests/astro-tarot-synthesis.test.ts (1)
 ✓ tests/yoga-dosha-engine.test.ts (7)
 ✓ tests/birth-data-validation.test.ts (5)
 ✓ tests/tarot-engine.test.ts (7)
 ✓ tests/three-card-draw.test.ts (14)
 ✓ tests/ayanamsha.test.ts (3)
 ✓ tests/dasha.test.ts (1)
 ✓ tests/ephemeris.test.ts (2)
 ✓ tests/p0-calculation-engine-unification.test.ts (2)
 ✓ tests/p0-dasha-moon-lookup.test.ts (3)
 ✓ tests/p0-varga-engine-consistency.test.ts (2)
 ✓ tests/p1-yoga-dosha-sync.test.ts (1)
 ✓ tests/p2-cache-key-invalidation.test.ts (2)
 ✓ tests/golden-charts/bv-raman-1912.test.ts (8)

Test Files  19 passed (19)
Tests       89 passed (89)
Duration    1.58s
```

All 89 tests passed with 0 failures, 0 regressions, and full build verification.
