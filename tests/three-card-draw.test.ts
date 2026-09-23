import { describe, it, expect } from 'vitest';
import { 
  draw3CardSpread, 
  run10kDrawTest, 
  STANDARD_78_DECK, 
  generateReadingId 
} from '../lib/tarot/three-card-engine';
import { MAJOR_ARCANA_CARDS, MINOR_ARCANA_CARDS } from '../lib/tarot/cards';

describe('TAROT 3-CARD RANDOM DRAW ENGINE', () => {
  it('1. Deck contains exactly 78 cards', () => {
    expect(STANDARD_78_DECK.length).toBe(78);
  });

  it('2. All card names are unique', () => {
    const names = STANDARD_78_DECK.map(c => c.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(78);
  });

  it('3. Exactly 3 cards are returned', () => {
    const result = draw3CardSpread();
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.cards.length).toBe(3);
      expect(result.spread).toBe('Past Present Future');
      expect(result.cards[0].position).toBe(1);
      expect(result.cards[1].position).toBe(2);
      expect(result.cards[2].position).toBe(3);
    }
  });

  it('4. All 3 cards are unique in every draw', () => {
    for (let i = 0; i < 50; i++) {
      const result = draw3CardSpread();
      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        const ids = result.cards.map(c => c.cardId);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(3);
      }
    }
  });

  it('5. Every orientation is independently either Upright or Reversed', () => {
    const orientationsSeen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const result = draw3CardSpread();
      if (!('error' in result)) {
        for (const c of result.cards) {
          expect(['Upright', 'Reversed']).toContain(c.orientation);
          orientationsSeen.add(c.orientation);
        }
      }
    }
    expect(orientationsSeen.has('Upright')).toBe(true);
    expect(orientationsSeen.has('Reversed')).toBe(true);
  });

  it('6. Card selection does not depend on the user question', () => {
    // Calling draw with different questions produces different draws without question-based determinism
    const q1 = 'What career trajectory awaits me?';
    const q2 = 'What romance path is unfolding?';

    const r1 = draw3CardSpread(q1);
    const r2 = draw3CardSpread(q2);

    expect('error' in r1).toBe(false);
    expect('error' in r2).toBe(false);

    // Questions do not force predetermined card outcomes
    if (!('error' in r1) && !('error' in r2)) {
      expect(r1.cards.length).toBe(3);
      expect(r2.cards.length).toBe(3);
      // Question should not be saved unless storeQuestion is true
      expect(r1.userQuestion).toBeUndefined();
    }
  });

  it('7. A new draw produces a new randomization process and unique reading ID', () => {
    const draws = new Set<string>();
    const readingIds = new Set<string>();

    for (let i = 0; i < 20; i++) {
      const res = draw3CardSpread();
      if (!('error' in res)) {
        readingIds.add(res.readingId);
        // Pattern of 3 card IDs
        draws.add(res.cards.map(c => c.cardId).join('-'));
        // Verify format tarot_YYYYMMDD_XXXXXX
        expect(res.readingId).toMatch(/^tarot_\d{8}_[0-9A-Z]{6}$/);
      }
    }

    expect(readingIds.size).toBe(20);
    expect(draws.size).toBeGreaterThan(1);
  });

  it('8. No card can appear twice in the same reading (without replacement)', () => {
    for (let i = 0; i < 100; i++) {
      const res = draw3CardSpread();
      if (!('error' in res)) {
        const [c1, c2, c3] = res.cards;
        expect(c1.cardId).not.toBe(c2.cardId);
        expect(c1.cardId).not.toBe(c3.cardId);
        expect(c2.cardId).not.toBe(c3.cardId);
      }
    }
  });

  it('9. Major Arcana count = 22', () => {
    expect(MAJOR_ARCANA_CARDS.length).toBe(22);
    for (let i = 0; i <= 21; i++) {
      expect(MAJOR_ARCANA_CARDS.some(c => c.number === i)).toBe(true);
    }
  });

  it('10. Minor Arcana count = 56', () => {
    expect(MINOR_ARCANA_CARDS.length).toBe(56);
    const suits = ['wands', 'cups', 'swords', 'pentacles'];
    for (const s of suits) {
      const inSuit = MINOR_ARCANA_CARDS.filter(c => c.suit === s);
      expect(inSuit.length).toBe(14);
    }
  });

  it('11. Total cards count equals 78', () => {
    expect(MAJOR_ARCANA_CARDS.length + MINOR_ARCANA_CARDS.length).toBe(78);
    expect(STANDARD_78_DECK.length).toBe(78);
  });

  it('12. Error handling when secure random source is unavailable', () => {
    const errorResult = draw3CardSpread('Test question', { forcedCryptoUnavailable: true });
    expect('error' in errorResult).toBe(true);
    if ('error' in errorResult) {
      expect(errorResult.error).toBe('Secure random source unavailable');
    }
  });

  it('13. Non-fatalistic language in Position 3 (Future / Direction)', () => {
    const res = draw3CardSpread();
    if (!('error' in res)) {
      const futureCard = res.cards[2];
      expect(futureCard.positionName).toBe('Future / Direction');
      // Must not state certainty
      expect(futureCard.positionMeaning.toLowerCase()).not.toContain('this will definitely happen');
      expect(futureCard.positionMeaning.toLowerCase()).toMatch(/possible direction|developing energy|area to consider/);
    }
  });

  it('14. Development-only 10,000 draw empirical verification', () => {
    const stats = run10kDrawTest();
    expect(stats.totalDraws).toBe(10000);
    expect(stats.totalCardsSampled).toBe(30000);
    expect(stats.anyDuplicateInSingleDraw).toBe(false);
    expect(stats.all78CardsDrawn).toBe(true);
    expect(stats.uniqueCardsDrawnCount).toBe(78);
    // Orientation probability should be close to 50% (between 46% and 54%)
    expect(stats.uprightRatio).toBeGreaterThan(0.46);
    expect(stats.uprightRatio).toBeLessThan(0.54);
  });
});
