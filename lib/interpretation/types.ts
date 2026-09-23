import { TraditionalGraha, DignityType } from '@/types/astrology';

export type EpistemicClassification = 'CALCULATED_FACT' | 'TRADITIONAL_INTERPRETATION' | 'INTERPRETIVE_GUIDANCE';

export interface EpistemicStatement {
  classification: EpistemicClassification;
  tag: '[CALCULATED FACT]' | '[TRADITIONAL INTERPRETATION]' | '[INTERPRETIVE GUIDANCE]';
  text: string;
}

export type RuleCategory = 
  | 'planet_in_house'
  | 'planet_in_sign'
  | 'house_lord'
  | 'planet_aspect'
  | 'conjunction'
  | 'dignity'
  | 'vargottama'
  | 'nakshatra'
  | 'yoga'
  | 'dasha'
  | 'transit';

export type RuleSeverity = 'very_favorable' | 'favorable' | 'neutral' | 'challenging' | 'intense';

export interface RuleResult {
  ruleId: string;
  category: RuleCategory;
  severity: RuleSeverity;
  evidence: string; // The astronomical / factual basis
  interpretation: string; // Traditional delineation
  guidance: string; // Actionable, psychological, or remediation counsel
  confidence: number; // 0 to 1
  sourceTradition: string; // e.g. "Brihat Parashara Hora Shastra, Ch. 24", "Phaladeepika, Ch. 8", etc.
  statements: EpistemicStatement[];
}

export type PanchadhaMaitriType = 'Great Friend (Adhi Mitra)' | 'Friend (Mitra)' | 'Neutral (Sama)' | 'Enemy (Shatru)' | 'Great Enemy (Adhi Shatru)';

export interface PlanetSynthesisFact {
  planet: TraditionalGraha;
  sign: string;
  signIndex: number; // 0-11
  degree: number;
  minute: number;
  degreeFormatted: string;
  house: number; // 1-12
  ownedHouses: number[];
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  dignity: DignityType | string;
  isMoolatrikona: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
  compoundRelationshipToSignLord: PanchadhaMaitriType;
  isRetrograde: boolean;
  isCombust: boolean;
  combustionDegreesFromSun?: number;
  isVargottama: boolean;
  d9Sign: string;
  d9House: number;
  d10Sign: string;
  d10House: number;
  conjunctions: Array<{
    otherPlanet: TraditionalGraha;
    angularDistanceDeg: number;
    isTight: boolean; // orb < 5 deg
    isExact: boolean; // orb < 1 deg (Graha Yuddha if non-luminaries)
  }>;
  aspectsReceived: Array<{
    aspectingPlanet: TraditionalGraha;
    aspectType: string; // '7th', '4th', '8th', '5th', '9th', '3rd', '10th'
    distanceDeg: number;
  }>;
  aspectsCastOnHouses: number[];
}

export interface HouseSynthesisFact {
  houseNumber: number; // 1-12
  sign: string;
  signIndex: number;
  cuspLongitude: number;
  lord: TraditionalGraha;
  lordPlacementHouse: number;
  lordPlacementSign: string;
  occupyingPlanets: TraditionalGraha[];
  aspectingPlanets: TraditionalGraha[];
  naturalKarakas: TraditionalGraha[];
  strengthScore: number; // calculated relative strength indicator
  isKendra: boolean;
  isTrikona: boolean;
  isDusthana: boolean;
  isUpachaya: boolean;
  isMaraka: boolean;
}

export interface AnalysisLayer {
  layerId: string;
  title: string;
  subtitle: string;
  summary: string;
  rules: RuleResult[];
  facts: EpistemicStatement[];
  interpretations: EpistemicStatement[];
  guidance: EpistemicStatement[];
}

export interface ThirteenLayerInterpretation {
  calculationTimestamp: string;
  querentName: string;
  birthSummary: string;
  
  // The 13 required analytical layers
  layer1_chartSummary: AnalysisLayer;
  layer2_lagnaAnalysis: AnalysisLayer;
  layer3_moonAnalysis: AnalysisLayer;
  layer4_sunAnalysis: AnalysisLayer;
  layer5_planetAnalysis: Record<TraditionalGraha, AnalysisLayer>;
  layer6_houseAnalysis: Record<number, AnalysisLayer>;
  layer7_importantYogas: AnalysisLayer;
  layer8_strengths: AnalysisLayer;
  layer9_challenges: AnalysisLayer;
  layer10_dashaAnalysis: AnalysisLayer;
  layer11_transitAnalysis: AnalysisLayer;
  layer12_vargaComparison: AnalysisLayer;
  layer13_topicSpecific: {
    dharma: AnalysisLayer;
    artha: AnalysisLayer;
    kama: AnalysisLayer;
    moksha: AnalysisLayer;
  };
  
  allRulesEvaluated: RuleResult[];
}
