import { GrahaName } from '@/types/astrology';

export interface EvaluatedCondition {
  id: string;
  description: string;
  isSatisfied: boolean;
  actualValue: string;
  requiredValue: string;
}

export interface CancellationFactor {
  factor: string;
  isApplied: boolean;
  ruleCitation: string;
  evidence: string;
}

export interface DetectedDosha {
  id: string;
  name: string;
  sanskritName: string;
  category: 
    | 'Manglik' 
    | 'Kaal Sarpa' 
    | 'Kemadruma' 
    | 'Grahan' 
    | 'Guru Chandal' 
    | 'Nadi' 
    | 'Bhakoot'
    | 'Dosha';
  polarity: 'Challenging' | 'Mitigated' | 'Mixed';
  conditions: EvaluatedCondition[];
  satisfiedConditions: string[];
  failedConditions: string[];
  strength: 'Dominant' | 'Moderate' | 'Mild' | 'Mitigated' | 'Cancelled';
  affectedHouses: number[];
  affectedPlanets: GrahaName[];
  interpretation: string;
  traditionalSource: string;
  calculationVersion: string;
  cancellationFactors: CancellationFactor[];
  mitigationSummary: string;
  isCancelled: boolean;
  hasMitigation: boolean;
}

export interface DoshaEngineInput {
  lagnaRashiNumber: number;
  moonRashiNumber: number;
  venusRashiNumber: number;
  planets: Array<{
    name: GrahaName;
    rashiNumber: number; // 1-12
    degreeInRashi: number; // 0-30
    house: number; // 1-12
    dignity: string;
    isRetrograde: boolean;
    isCombust: boolean;
    nakshatra?: string;
    pada?: number;
  }>;
}
