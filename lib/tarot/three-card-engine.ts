/**
 * TAROT 3-CARD RANDOM DRAW ENGINE
 * 
 * Deterministic application function for drawing exactly 3 tarot cards
 * from a standard 78-card Rider-Waite-Smith-style tarot deck.
 * 
 * Rules:
 * 1. Cryptographically secure random draw (crypto.getRandomValues / crypto.randomBytes).
 * 2. Question or user profile NEVER influences card selection.
 * 3. Cards are selected BEFORE interpretation.
 * 4. Sampled without replacement (always 3 unique cards).
 * 5. Independent 50/50 orientation probability (Upright / Reversed).
 * 6. Non-fatalistic language for Position 3 (Future / Direction).
 * 7. Secure random unavailable error handling.
 */

import { ALL_TAROT_CARDS, getTarotCardImageUrl } from './cards';
import { TarotCard } from './types';

export type ArcanaDisplay = 'Major Arcana' | 'Minor Arcana';
export type OrientationType = 'Upright' | 'Reversed';
export type MinorSuitDisplay = 'Wands' | 'Cups' | 'Swords' | 'Pentacles';

export interface ThreeCardItem {
  position: 1 | 2 | 3;
  positionName: 'Past / Background' | 'Present / Current Energy' | 'Future / Direction';
  name: string;
  arcana: ArcanaDisplay;
  suit?: MinorSuitDisplay;
  orientation: OrientationType;
  cardId: string;
  number: number;
  imageUrl: string;
  traditionalMeaning: string;
  positionMeaning: string;
  practicalReflection: string;
}

export interface ThreeCardInterpretation {
  cardInterpretations: Array<{
    cardName: string;
    orientation: OrientationType;
    traditionalMeaning: string;
    positionMeaning: string;
    practicalReflection: string;
  }>;
  overallReading: string;
}

export interface ThreeCardReadingResult {
  readingId: string;
  timestamp: string;
  spread: 'Past Present Future';
  userQuestion?: string;
  cards: [ThreeCardItem, ThreeCardItem, ThreeCardItem];
  interpretation: ThreeCardInterpretation;
}

export interface ThreeCardDrawError {
  error: 'Secure random source unavailable';
}

export interface ThreeCardDrawOptions {
  userQuestion?: string;
  storeQuestion?: boolean;
  forcedCryptoUnavailable?: boolean; // For automated test of error condition
}

/**
 * Validates availability of a cryptographically secure random source.
 */
export function getSecureCrypto(): { getRandomValues: (array: Uint8Array) => Uint8Array } | null {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }
  try {
    // Fallback for Node environments without globalThis.crypto
    // eslint-disable-next-line
    const nodeCrypto = require('crypto');
    if (nodeCrypto && typeof nodeCrypto.webcrypto?.getRandomValues === 'function') {
      return nodeCrypto.webcrypto;
    }
  } catch {
    // Ignored
  }
  return null;
}

/**
 * Generates an unbiased cryptographically secure random integer in [0, maxExclusive)
 * using rejection sampling.
 */
export function getSecureRandomInt(
  secureCrypto: { getRandomValues: (array: Uint8Array) => Uint8Array },
  maxExclusive: number
): number {
  if (maxExclusive <= 1) return 0;

  const bitsNeeded = Math.ceil(Math.log2(maxExclusive));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = (1 << bitsNeeded) - 1;
  const buffer = new Uint8Array(bytesNeeded);

  while (true) {
    secureCrypto.getRandomValues(buffer);
    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) | buffer[i];
    }
    value = value & mask;
    if (value < maxExclusive) {
      return value;
    }
  }
}

/**
 * Independent 50/50 probability coin flip for card orientation.
 */
export function getSecureCardOrientation(
  secureCrypto: { getRandomValues: (array: Uint8Array) => Uint8Array }
): OrientationType {
  const buf = new Uint8Array(1);
  secureCrypto.getRandomValues(buf);
  return (buf[0] & 1) === 0 ? 'Upright' : 'Reversed';
}

/**
 * Fisher-Yates cryptographic deck shuffle.
 */
export function shuffleDeckCryptographically(
  cards: TarotCard[],
  secureCrypto: { getRandomValues: (array: Uint8Array) => Uint8Array }
): TarotCard[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(secureCrypto, i + 1);
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}

/**
 * Generates formatted reading ID matching specification:
 * e.g. "tarot_20260922_8F4K29"
 */
export function generateReadingId(
  secureCrypto: { getRandomValues: (array: Uint8Array) => Uint8Array },
  date: Date = new Date()
): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randStr = '';
  for (let i = 0; i < 6; i++) {
    const idx = getSecureRandomInt(secureCrypto, chars.length);
    randStr += chars[idx];
  }

  return `tarot_${dateStr}_${randStr}`;
}

/**
 * Formats Suit for Minor Arcana matching specification.
 */
function formatSuit(suit: string | null): MinorSuitDisplay | undefined {
  if (!suit) return undefined;
  const s = suit.toLowerCase();
  if (s === 'wands') return 'Wands';
  if (s === 'cups') return 'Cups';
  if (s === 'swords') return 'Swords';
  if (s === 'pentacles') return 'Pentacles';
  return undefined;
}

/**
 * Derives contextual position meaning for Card 1 (Past / Background).
 */
function derivePastMeaning(card: TarotCard, orientation: OrientationType): string {
  const meaning = orientation === 'Upright' ? card.uprightMeaning : card.reversedMeaning;
  return `Previous influences and background circumstances: ${meaning} This represents the historical pattern, root impetus, or completed cycle that established your present trajectory.`;
}

/**
 * Derives contextual position meaning for Card 2 (Present / Current Energy).
 */
function derivePresentMeaning(card: TarotCard, orientation: OrientationType): string {
  const meaning = orientation === 'Upright' ? card.uprightMeaning : card.reversedMeaning;
  return `Current situation, energetic challenge, or dominant influence: ${meaning} This highlights where your conscious awareness, immediate friction, or current agency is actively tested.`;
}

/**
 * Derives contextual position meaning for Card 3 (Future / Direction).
 * MUST NOT describe as a guaranteed prediction.
 */
function deriveFutureMeaning(card: TarotCard, orientation: OrientationType): string {
  const meaning = orientation === 'Upright' ? card.uprightMeaning : card.reversedMeaning;
  return `Possible direction and developing energy to consider: If current momentum continues uninterrupted, ${meaning} This is an evolving potential and area to consider for conscious stewardship, rather than a fatalistic certainty.`;
}

/**
 * Derives practical reflection for a card.
 */
function derivePracticalReflection(card: TarotCard, orientation: OrientationType): string {
  if (orientation === 'Upright') {
    return `${card.advice} Ground this through mindful action and alignment with ${card.element} energy.`;
  }
  return `Shadow work & corrective reflection: ${card.shadow} Mindfully integrate where energy is withheld, resisted, or overcompensating.`;
}

/**
 * Generates an overall reading synthesizing the narrative progression of the 3 cards.
 */
function generateOverallReading(cards: [ThreeCardItem, ThreeCardItem, ThreeCardItem]): string {
  const [past, present, future] = cards;

  const pastSummary = `${past.name} (${past.orientation}) in the foundation indicates that past developments centered on ${past.orientation === 'Upright' ? 'conscious activation' : 'internalization or recalibration'}`;
  const presentSummary = `${present.name} (${present.orientation}) reflects that current circumstances demand engaging with ${present.orientation === 'Upright' ? 'direct manifestation and focused clarity' : 'resolving underlying frictions or hidden variables'}`;
  const futureSummary = `${future.name} (${future.orientation}) reveals a developing energy and possible direction toward ${future.orientation === 'Upright' ? 'harmonic maturation and constructive realization' : 're-evaluating expectations and adjusting course'}`;

  return [
    `### Overall Reading`,
    `The three-card spread outlines a dynamic developmental trajectory from background conditions into prospective horizons:`,
    `- **Historical Influx**: ${pastSummary}.`,
    `- **Present Crucible**: ${presentSummary}.`,
    `- **Prospective Direction**: ${futureSummary}.`,
    ``,
    `Rather than a predetermined fatalistic decree, this spread serves as an archetypal mirror: the future remains open to conscious agency, discernment, and ethical action. How you steward the present reality of ${present.name} directly shapes the ripening of ${future.name}.`,
  ].join('\n');
}

/**
 * Deterministic TAROT 3-CARD RANDOM DRAW ENGINE
 * 
 * Draws exactly 3 unique cards with independent 50/50 orientations
 * using cryptographically secure random sources.
 */
export function draw3CardSpread(
  question?: string,
  options: ThreeCardDrawOptions = {}
): ThreeCardReadingResult | ThreeCardDrawError {
  // Test hook or real detection for secure randomness
  if (options.forcedCryptoUnavailable) {
    return { error: 'Secure random source unavailable' };
  }

  const secureCrypto = getSecureCrypto();
  if (!secureCrypto) {
    return { error: 'Secure random source unavailable' };
  }

  // 1. Create a fresh 78-card deck
  const freshDeck = [...ALL_TAROT_CARDS];

  // 2. Cryptographically shuffle the deck
  const shuffledDeck = shuffleDeckCryptographically(freshDeck, secureCrypto);

  // 3. & 4. Select exactly 3 different cards without replacement
  const selectedCards = [shuffledDeck[0], shuffledDeck[1], shuffledDeck[2]];

  // 5. Independently determine orientation for each card (50% Upright, 50% Reversed)
  const orientation1 = getSecureCardOrientation(secureCrypto);
  const orientation2 = getSecureCardOrientation(secureCrypto);
  const orientation3 = getSecureCardOrientation(secureCrypto);

  const readingId = generateReadingId(secureCrypto);
  const timestamp = new Date().toISOString();

  // Position definitions
  const item1: ThreeCardItem = {
    position: 1,
    positionName: 'Past / Background',
    name: selectedCards[0].name,
    arcana: selectedCards[0].arcana === 'major' ? 'Major Arcana' : 'Minor Arcana',
    suit: formatSuit(selectedCards[0].suit),
    orientation: orientation1,
    cardId: selectedCards[0].id,
    number: selectedCards[0].number,
    imageUrl: getTarotCardImageUrl(selectedCards[0]),
    traditionalMeaning: orientation1 === 'Upright' ? selectedCards[0].uprightMeaning : selectedCards[0].reversedMeaning,
    positionMeaning: derivePastMeaning(selectedCards[0], orientation1),
    practicalReflection: derivePracticalReflection(selectedCards[0], orientation1),
  };

  const item2: ThreeCardItem = {
    position: 2,
    positionName: 'Present / Current Energy',
    name: selectedCards[1].name,
    arcana: selectedCards[1].arcana === 'major' ? 'Major Arcana' : 'Minor Arcana',
    suit: formatSuit(selectedCards[1].suit),
    orientation: orientation2,
    cardId: selectedCards[1].id,
    number: selectedCards[1].number,
    imageUrl: getTarotCardImageUrl(selectedCards[1]),
    traditionalMeaning: orientation2 === 'Upright' ? selectedCards[1].uprightMeaning : selectedCards[1].reversedMeaning,
    positionMeaning: derivePresentMeaning(selectedCards[1], orientation2),
    practicalReflection: derivePracticalReflection(selectedCards[1], orientation2),
  };

  const item3: ThreeCardItem = {
    position: 3,
    positionName: 'Future / Direction',
    name: selectedCards[2].name,
    arcana: selectedCards[2].arcana === 'major' ? 'Major Arcana' : 'Minor Arcana',
    suit: formatSuit(selectedCards[2].suit),
    orientation: orientation3,
    cardId: selectedCards[2].id,
    number: selectedCards[2].number,
    imageUrl: getTarotCardImageUrl(selectedCards[2]),
    traditionalMeaning: orientation3 === 'Upright' ? selectedCards[2].uprightMeaning : selectedCards[2].reversedMeaning,
    positionMeaning: deriveFutureMeaning(selectedCards[2], orientation3),
    practicalReflection: derivePracticalReflection(selectedCards[2], orientation3),
  };

  const cardsTuple: [ThreeCardItem, ThreeCardItem, ThreeCardItem] = [item1, item2, item3];

  const interpretation: ThreeCardInterpretation = {
    cardInterpretations: cardsTuple.map(c => ({
      cardName: c.name,
      orientation: c.orientation,
      traditionalMeaning: c.traditionalMeaning,
      positionMeaning: c.positionMeaning,
      practicalReflection: c.practicalReflection,
    })),
    overallReading: generateOverallReading(cardsTuple),
  };

  const result: ThreeCardReadingResult = {
    readingId,
    timestamp,
    spread: 'Past Present Future',
    cards: cardsTuple,
    interpretation,
  };

  // Only store user's question if explicitly enabled
  if (options.storeQuestion && (question || options.userQuestion)) {
    result.userQuestion = question || options.userQuestion;
  }

  return result;
}

/**
 * Development-only test mode:
 * Executes 10,000 draws to empirically verify uniform representation,
 * absence of duplicates in any single draw, and valid orientation balance.
 * 
 * Never exposed or called in production.
 */
export function run10kDrawTest(): {
  totalDraws: number;
  totalCardsSampled: number;
  uniqueCardsDrawnCount: number;
  all78CardsDrawn: boolean;
  anyDuplicateInSingleDraw: boolean;
  uprightCount: number;
  reversedCount: number;
  uprightRatio: number;
} {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Test mode not available in production environments.');
  }

  const cardFrequency: Record<string, number> = {};
  for (const c of ALL_TAROT_CARDS) {
    cardFrequency[c.id] = 0;
  }

  let uprightCount = 0;
  let reversedCount = 0;
  let anyDuplicateInSingleDraw = false;

  const TOTAL_DRAWS = 10000;

  for (let i = 0; i < TOTAL_DRAWS; i++) {
    const res = draw3CardSpread();
    if ('error' in res) {
      throw new Error(`10k test draw failed on iteration ${i}: ${res.error}`);
    }

    const [c1, c2, c3] = res.cards;

    // Check duplicate in this draw
    if (c1.cardId === c2.cardId || c1.cardId === c3.cardId || c2.cardId === c3.cardId) {
      anyDuplicateInSingleDraw = true;
    }

    cardFrequency[c1.cardId]++;
    cardFrequency[c2.cardId]++;
    cardFrequency[c3.cardId]++;

    for (const c of res.cards) {
      if (c.orientation === 'Upright') uprightCount++;
      else reversedCount++;
    }
  }

  const drawnCardIds = Object.keys(cardFrequency).filter(id => cardFrequency[id] > 0);

  return {
    totalDraws: TOTAL_DRAWS,
    totalCardsSampled: TOTAL_DRAWS * 3,
    uniqueCardsDrawnCount: drawnCardIds.length,
    all78CardsDrawn: drawnCardIds.length === 78,
    anyDuplicateInSingleDraw,
    uprightCount,
    reversedCount,
    uprightRatio: uprightCount / (uprightCount + reversedCount),
  };
}

export { ALL_TAROT_CARDS as STANDARD_78_DECK };
