import { RashiName, WesternZodiac, GrahaName, TraditionalGraha, DignityType } from '@/types/astrology';

export interface VargaPlacement {
  planet: GrahaName;
  sanskrit: string;
  symbol: string;
  sourceDegreeInRashi: number;
  sourceRashi: RashiName;
  vargaRashi: RashiName;
  vargaRashiEnglish: WesternZodiac;
  vargaRashiNumber: number; // 1-12
  vargaDegree: number; // 0 to 30 within division
  dms: string;
  house: number; // 1-12 relative to varga ascendant
  dignity: DignityType;
  isVargottama: boolean;
  nakshatra?: string;
  pada?: number;
  isRetrograde?: boolean;
  isCombust?: boolean;
  deity?: string;
  traditionalRole?: string;
}

export interface VargaDefinition {
  id: string; // 'D1', 'D2', ... 'D60'
  number: number;
  name: string;
  sanskritName: string;
  purpose: string;
  divisionCount: number;
  spanDegrees: number; // 30 / divisionCount
  calculationMethod: string;
  signMapping: string;
  planetMapping: string;
  boundaryRules: string;
  traditionalNotes: string;
  calculate: (siderealLon: number) => {
    rashi: RashiName;
    rashiNumber: number;
    degreeInRashi: number;
    deity?: string;
  };
}

export interface VargaChartResult {
  definition: VargaDefinition;
  ascendant: {
    rashi: RashiName;
    rashiNumber: number;
    degreeInRashi: number;
    dms: string;
    deity?: string;
  };
  positions: Record<GrahaName, VargaPlacement>;
  keyObservations: string[];
  interpretation: string;
}
