import { TarotCard, TarotReadingSnapshot, TarotSpread } from './types';
import { ALL_TAROT_CARDS, getCardById } from './cards';
import { ALL_SPREADS, getSpreadById } from './spreads';

/**
 * Deterministic & Cryptographically Secure Tarot Engine
 * 
 * Rules:
 * 1. AI must NEVER choose the cards.
 * 2. Uses Web Crypto API (crypto.getRandomValues) for cryptographically unbiased shuffling.
 * 3. Cards are drawn without replacement.
 * 4. Card orientations (upright / reversed) are chosen using cryptographically secure random bits.
 * 5. Full reading snapshots can be serialized, saved, and completely reproduced later.
 */

/**
 * Cryptographically secure random integer in [0, maxExclusive)
 */
function getSecureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;
  
  // Calculate mask to avoid bias (rejection sampling)
  const bitsNeeded = Math.ceil(Math.log2(maxExclusive));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = (1 << bitsNeeded) - 1;
  const buffer = new Uint8Array(bytesNeeded);

  while (true) {
    crypto.getRandomValues(buffer);
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
 * Cryptographically secure coin flip for orientation (upright / reversed)
 * Returns true for reversed, false for upright.
 * Typically 50/50 probability, or can take custom reversedProbability (0 to 1).
 */
export function getSecureOrientation(reversedProbability: number = 0.5): boolean {
  if (reversedProbability <= 0) return false;
  if (reversedProbability >= 1) return true;
  
  const randInt = getSecureRandomInt(10000);
  return randInt < Math.round(reversedProbability * 10000);
}

/**
 * Fisher-Yates shuffle using cryptographically secure RNG
 */
export function shuffleDeck(cards: TarotCard[] = ALL_TAROT_CARDS): TarotCard[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export interface DrawCardOptions {
  allowReversed?: boolean;
  reversedProbability?: number;
  deck?: TarotCard[];
}

/**
 * Draw N unique cards from the deck with cryptographic orientation
 */
export function drawCards(count: number, options: DrawCardOptions = {}): { card: TarotCard; isReversed: boolean }[] {
  const {
    allowReversed = true,
    reversedProbability = 0.5,
    deck = ALL_TAROT_CARDS,
  } = options;

  if (count <= 0) return [];
  if (count > deck.length) {
    throw new Error(`Cannot draw ${count} cards from a deck of ${deck.length}`);
  }

  const shuffled = shuffleDeck(deck);
  const drawn: { card: TarotCard; isReversed: boolean }[] = [];

  for (let i = 0; i < count; i++) {
    const card = shuffled[i];
    const isReversed = allowReversed ? getSecureOrientation(reversedProbability) : false;
    drawn.push({ card, isReversed });
  }

  return drawn;
}

/**
 * Draw an exact Tarot spread
 */
export function drawSpread(
  spreadId: string,
  userQuestion?: string,
  querentName?: string,
  options: DrawCardOptions = {}
): TarotReadingSnapshot {
  const spread = getSpreadById(spreadId);
  if (!spread) {
    throw new Error(`Spread "${spreadId}" not found in registered spreads.`);
  }

  const drawn = drawCards(spread.cardCount, options);

  const cardsInSpread = drawn.map((d, index) => {
    const pos = spread.positions[index];
    return {
      cardId: d.card.id,
      card: d.card,
      isReversed: d.isReversed,
      positionIndex: index,
      positionName: pos.name,
      positionDescription: pos.description,
    };
  });

  const snapshot: TarotReadingSnapshot = {
    readingId: `read_${Date.now()}_${getSecureRandomInt(100000)}`,
    timestamp: new Date().toISOString(),
    userQuestion: userQuestion || 'General Reading',
    querentName: querentName || 'Querent',
    spreadId: spread.id,
    spreadName: spread.name,
    cards: cardsInSpread,
    calculationMetadata: {
      totalDeckSize: ALL_TAROT_CARDS.length,
      shuffleAlgorithm: 'Cryptographic Fisher-Yates (Web Crypto rejection sampling)',
      allowReversed: options.allowReversed !== false,
      timestampUTC: new Date().toUTCString(),
    },
  };

  return snapshot;
}

/**
 * Reproduce a reading exactly from its saved snapshot
 */
export function reproduceReading(snapshot: TarotReadingSnapshot): TarotReadingSnapshot {
  const spread = getSpreadById(snapshot.spreadId);
  if (!spread) {
    throw new Error(`Cannot reproduce reading: spread "${snapshot.spreadId}" is unknown.`);
  }

  // Re-hydrate cards from the database to guarantee integrity
  const rehydratedCards = snapshot.cards.map((c, index) => {
    const cardDef = getCardById(c.cardId);
    if (!cardDef) {
      throw new Error(`Cannot reproduce reading: card "${c.cardId}" is unknown.`);
    }
    const pos = spread.positions[index] || {
      name: c.positionName,
      description: c.positionDescription,
    };

    return {
      cardId: c.cardId,
      card: cardDef,
      isReversed: c.isReversed,
      positionIndex: index,
      positionName: pos.name,
      positionDescription: pos.description,
    };
  });

  return {
    ...snapshot,
    cards: rehydratedCards,
  };
}

/**
 * In-memory Reading History store (with local-storage fallback for persistence in browser)
 */
const HISTORY_KEY = 'kaalika_tarot_history_v1';

export function saveReadingToHistory(snapshot: TarotReadingSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: TarotReadingSnapshot[] = raw ? JSON.parse(raw) : [];
    // Prepend new reading, keep last 50
    const updated = [snapshot, ...history.filter(h => h.readingId !== snapshot.readingId)].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Non-fatal if localStorage is restricted
  }
}

export function loadReadingHistory(): TarotReadingSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const history: TarotReadingSnapshot[] = JSON.parse(raw);
    return history.map(reproduceReading);
  } catch {
    return [];
  }
}

export function clearReadingHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Non-fatal
  }
}
