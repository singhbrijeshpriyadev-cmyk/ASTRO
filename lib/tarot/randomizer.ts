import { TarotCard, TarotOrientation } from './types';
import { ALL_TAROT_CARDS } from './cards';

/**
 * Validates availability of a cryptographically secure random source (Web Crypto or Node crypto).
 */
export function getCryptoProvider(): { getRandomValues: (array: Uint8Array) => Uint8Array } | null {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return window.crypto;
  }
  return null;
}

/**
 * Generates an unbiased cryptographically secure random integer in [0, maxExclusive)
 * using rejection sampling to eliminate modulo bias.
 */
export function getSecureRandomInt(
  cryptoProvider: { getRandomValues: (array: Uint8Array) => Uint8Array },
  maxExclusive: number
): number {
  if (maxExclusive <= 1) return 0;

  const bitsNeeded = Math.ceil(Math.log2(maxExclusive));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = (1 << bitsNeeded) - 1;
  const buffer = new Uint8Array(bytesNeeded);

  while (true) {
    cryptoProvider.getRandomValues(buffer);
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
export function getSecureOrientation(
  cryptoProvider: { getRandomValues: (array: Uint8Array) => Uint8Array }
): TarotOrientation {
  const buf = new Uint8Array(1);
  cryptoProvider.getRandomValues(buf);
  return (buf[0] & 1) === 0 ? 'upright' : 'reversed';
}

/**
 * Cryptographic Fisher-Yates shuffle.
 */
export function shuffleDeck<T>(
  items: T[],
  cryptoProvider: { getRandomValues: (array: Uint8Array) => Uint8Array }
): T[] {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(cryptoProvider, i + 1);
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}

/**
 * Generates unique formatted reading ID: e.g. "tarot_20260923_7K9X2B"
 */
export function generateReadingId(date: Date = new Date()): string {
  const provider = getCryptoProvider();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randStr = '';

  if (provider) {
    for (let i = 0; i < 6; i++) {
      const idx = getSecureRandomInt(provider, chars.length);
      randStr += chars[idx];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      randStr += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return `tarot_${dateStr}_${randStr}`;
}

export interface DrawnCardResult {
  card: TarotCard;
  orientation: TarotOrientation;
}

/**
 * Draws N unique cards from the deck without replacement.
 * Cryptographically secure, with orientations determined independently.
 */
export function drawRandomCards(
  count: number = 3,
  deck: TarotCard[] = ALL_TAROT_CARDS
): DrawnCardResult[] {
  const provider = getCryptoProvider();
  if (!provider) {
    throw new Error('Secure random source unavailable');
  }

  if (count > deck.length) {
    throw new Error(`Cannot draw ${count} unique cards from a deck of ${deck.length}.`);
  }

  // Shuffle deck using Fisher-Yates
  const shuffled = shuffleDeck(deck, provider);

  // Take top N cards and determine orientation for each
  const selected: DrawnCardResult[] = [];
  for (let i = 0; i < count; i++) {
    const orientation = getSecureOrientation(provider);
    selected.push({
      card: shuffled[i],
      orientation,
    });
  }

  return selected;
}
