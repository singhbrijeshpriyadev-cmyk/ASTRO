export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles' | null;
export type TarotElement = 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit';
export type TarotOrientation = 'upright' | 'reversed';

export type TarotTopic = 
  | 'general'
  | 'love'
  | 'career'
  | 'education'
  | 'finance'
  | 'family'
  | 'growth'
  | 'spirituality'
  | 'decision'
  | 'yes_no';

export interface TarotTopicMeta {
  id: TarotTopic;
  label: string;
  description: string;
  iconName: string;
}

export type TarotRank = 
  | 'Major'
  | 'Ace' 
  | '2' 
  | '3' 
  | '4' 
  | '5' 
  | '6' 
  | '7' 
  | '8' 
  | '9' 
  | '10' 
  | 'Page' 
  | 'Knight' 
  | 'Queen' 
  | 'King';

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  arcana: ArcanaType;
  suit: SuitType;
  rank?: string;

  // Section 9 Snake_case Structured Database Properties (populated in normalized deck)
  keywords_upright?: string[];
  keywords_reversed?: string[];
  meaning_upright?: string;
  meaning_reversed?: string;
  love_upright?: string;
  love_reversed?: string;
  career_upright?: string;
  career_reversed?: string;
  finance_upright?: string;
  finance_reversed?: string;
  education_upright?: string;
  education_reversed?: string;
  spiritual_upright?: string;
  spiritual_reversed?: string;
  yes_no?: 'Yes' | 'No' | 'Maybe';
  element: TarotElement;
  associated_symbolism?: string;
  description?: string;
  image_path?: string;

  // Backward-compatible camelCase properties
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  loveMeaning: string;
  careerMeaning: string;
  financeMeaning: string;
  educationMeaning: string;
  spiritualMeaning: string;
  advice: string;
  shadow: string;
  symbolism: string;
  astrologicalAssociation: string;
}

export interface ProductionTarotCard extends TarotCard {
  rank: string;
  keywords_upright: string[];
  keywords_reversed: string[];
  meaning_upright: string;
  meaning_reversed: string;
  love_upright: string;
  love_reversed: string;
  career_upright: string;
  career_reversed: string;
  finance_upright: string;
  finance_reversed: string;
  education_upright: string;
  education_reversed: string;
  spiritual_upright: string;
  spiritual_reversed: string;
  yes_no: 'Yes' | 'No' | 'Maybe';
  associated_symbolism: string;
  description: string;
  image_path: string;
}

export interface SpreadPosition {
  index: number;
  name: string;
  key?: 'past' | 'present' | 'future' | string;
  description: string;
  category: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  positionMeaning: (index: number) => string;
  interpretationOrder: number[];
}

export interface DrawnCard {
  card: TarotCard;
  positionIndex: number;
  positionName: string;
  positionMeaning?: string;
  positionDescription?: string;
  isReversed: boolean;
}

export interface StructuredDrawnCard {
  cardId: string;
  name: string;
  arcana: ArcanaType;
  suit: SuitType;
  rank: string;
  number: number;
  orientation: TarotOrientation;
  position: 'past' | 'present' | 'future' | string;
  positionName: string;
  card: TarotCard;
  imageUrl: string;
  baseMeaning: string;
  positionMeaning: string;
  topicMeaning: string;
  practicalReflection: string;
  keywords: string[];
}

export interface CombinationAnalysis {
  majorArcanaCount: number;
  majorArcanaEmphasis: boolean;
  elementalBalance: string;
  repeatedSuits: string[];
  repeatedRanks: string[];
  uprightRatio: string;
  progression: string;
}

export interface ProductionTarotReading {
  readingId: string;
  timestamp: string;
  question: string;
  topic: TarotTopic;
  topicLabel: string;
  spreadId: string;
  spreadName: string;
  cards: [StructuredDrawnCard, StructuredDrawnCard, StructuredDrawnCard];
  combination: CombinationAnalysis;
  overallReading: string;
  themes: string[];
  guidance: string;
  reflection: string;
  disclaimer: string;
}

export interface TarotReadingSnapshot {
  id?: string;
  readingId: string;
  timestamp: string;
  spreadId: string;
  spreadName: string;
  userQuestion?: string;
  querentName?: string;
  query?: string;
  topic?: TarotTopic;
  cards: Array<{
    cardId: string;
    card: TarotCard;
    positionIndex: number;
    positionName: string;
    positionDescription?: string;
    isReversed: boolean;
  }>;
  calculationMetadata: {
    totalDeckSize: number;
    shuffleAlgorithm: string;
    allowReversed: boolean;
    timestampUTC: string;
  };
}

export interface FullTarotReading {
  snapshot: TarotReadingSnapshot;
  spread: TarotSpread;
  drawnCards: DrawnCard[];
  elementalDistribution: Record<TarotElement, number>;
  majorArcanaRatio: number;
  dominantTheme: string;
}

export interface SavedTarotReading {
  readingId: string;
  createdAt: string;
  question: string;
  topic: TarotTopic;
  topicLabel: string;
  spreadName: string;
  cardSummaries: Array<{
    name: string;
    orientation: TarotOrientation;
    positionName: string;
    imageUrl: string;
    keywords: string[];
  }>;
  reading: ProductionTarotReading;
}
