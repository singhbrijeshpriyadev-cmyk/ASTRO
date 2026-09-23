import { ChartData } from '@/types/astrology';
import { TarotReadingSnapshot } from '../tarot/types';
import { ActiveDashaState } from '../dasha/precision-vimshottari';
import { DetectedYoga } from '../yoga/types';

export interface AstroAnalysis {
  lagnaSign: string;
  lagnaLord: string;
  moonSign: string;
  moonNakshatra: string;
  sunSign: string;
  activeDasha: {
    mahadasha: string;
    antardasha: string;
    pratyantardasha: string;
    progressPercent: number;
    operatingHouses: number[];
  };
  dominantYogas: string[];
  keyPlanetaryStrengths: string[];
  activeGrowthEdges: string[];
  elementalBalance: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
}

export interface TarotAnalysis {
  spreadId: string;
  spreadName: string;
  totalCards: number;
  majorArcanaCount: number;
  minorArcanaCount: number;
  reversedCount: number;
  dominantSuit?: string;
  dominantElement?: string;
  elementalBalance: {
    fire: number;   // Wands
    water: number;  // Cups
    air: number;    // Swords
    earth: number;  // Pentacles
    spirit: number; // Major Arcana
  };
  keyArchetypes: Array<{
    cardName: string;
    isReversed: boolean;
    position: string;
    coreKeyword: string;
    element: string;
  }>;
}

export interface ConvergingTheme {
  theme: string;
  astroEvidence: string;
  tarotEvidence: string;
  explanation: string;
}

export interface DifferingSignal {
  dimension: string;
  astroIndication: string;
  tarotIndication: string;
  synthesis: string;
}

export interface CombinedAnalysis {
  synthesisId: string;
  timestamp: string;
  userQuestion: string;
  overallTheme: string;
  astrologicalFactors: string[];
  tarotFactors: string[];
  convergingThemes: ConvergingTheme[];
  differentSignals: DifferingSignal[];
  practicalReflection: string[];
  questionsForReflection: string[];
  astroAnalysis: AstroAnalysis;
  tarotAnalysis: TarotAnalysis;
  epistemicDemarcation: {
    calculatedFactCount: number;
    symbolicResonanceCount: number;
    statement: string;
  };
}
