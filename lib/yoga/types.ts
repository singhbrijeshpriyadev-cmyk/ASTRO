import { GrahaName, TraditionalGraha, RashiName } from '@/types/astrology';

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

export interface DetectedYoga {
  id: string;
  name: string;
  sanskritName: string;
  category: 
    | 'Raja Yoga' 
    | 'Dhana Yoga' 
    | 'Pancha Mahapurusha' 
    | 'Vipareeta Raja Yoga' 
    | 'Neecha Bhanga' 
    | 'Chandra-Mangala' 
    | 'Budhaditya' 
    | 'Gaja Kesari' 
    | 'Dharma-Karmadhipati'
    | 'Auspicious';
  polarity: 'Auspicious' | 'Mixed';
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
}

export interface YogaEngineInput {
  lagnaRashiNumber: number;
  planets: Array<{
    name: GrahaName;
    rashiNumber: number; // 1-12
    degreeInRashi: number; // 0-30
    house: number; // 1-12
    dignity: string;
    isRetrograde: boolean;
    isCombust: boolean;
    d9RashiNumber?: number;
    d9Dignity?: string;
  }>;
}
