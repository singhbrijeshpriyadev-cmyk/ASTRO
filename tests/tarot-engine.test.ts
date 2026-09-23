import { describe, it, expect } from 'vitest';
import { ALL_TAROT_CARDS, MAJOR_ARCANA_CARDS, MINOR_ARCANA_CARDS, getCardById } from '../lib/tarot/cards';
import { ALL_SPREADS, getSpreadById } from '../lib/tarot/spreads';
import { drawCards, drawSpread, reproduceReading, shuffleDeck } from '../lib/tarot/engine';

describe('Tarot Subsystem - Database & Engine', () => {
  it('should have exactly 78 total tarot cards with unique IDs', () => {
    expect(ALL_TAROT_CARDS.length).toBe(78);
    const uniqueIds = new Set(ALL_TAROT_CARDS.map(c => c.id));
    expect(uniqueIds.size).toBe(78);
  });

  it('should have exactly 22 Major Arcana and 56 Minor Arcana cards', () => {
    expect(MAJOR_ARCANA_CARDS.length).toBe(22);
    expect(MINOR_ARCANA_CARDS.length).toBe(56);
  });

  it('should have all 18 required attributes on every single card', () => {
    for (const card of ALL_TAROT_CARDS) {
      expect(card.id).toBeTruthy();
      expect(card.name).toBeTruthy();
      expect(typeof card.number).toBe('number');
      expect(['major', 'minor']).toContain(card.arcana);
      expect(card.uprightKeywords.length).toBeGreaterThan(0);
      expect(card.reversedKeywords.length).toBeGreaterThan(0);
      expect(card.uprightMeaning.length).toBeGreaterThan(10);
      expect(card.reversedMeaning.length).toBeGreaterThan(10);
      expect(card.loveMeaning.length).toBeGreaterThan(10);
      expect(card.careerMeaning.length).toBeGreaterThan(10);
      expect(card.financeMeaning.length).toBeGreaterThan(10);
      expect(card.educationMeaning.length).toBeGreaterThan(10);
      expect(card.spiritualMeaning.length).toBeGreaterThan(10);
      expect(card.advice.length).toBeGreaterThan(5);
      expect(card.shadow.length).toBeGreaterThan(5);
      expect(card.symbolism.length).toBeGreaterThan(5);
      expect(card.element).toBeTruthy();
      expect(card.astrologicalAssociation).toBeTruthy();
    }
  });

  it('should have 7 standard spreads with matching position counts and interpretations', () => {
    expect(ALL_SPREADS.length).toBe(7);
    for (const spread of ALL_SPREADS) {
      expect(spread.positions.length).toBe(spread.cardCount);
      expect(spread.interpretationOrder.length).toBe(spread.cardCount);
    }
  });

  it('should shuffle deck without dropping or duplicating cards', () => {
    const shuffled = shuffleDeck();
    expect(shuffled.length).toBe(78);
    const uniqueIds = new Set(shuffled.map(c => c.id));
    expect(uniqueIds.size).toBe(78);
  });

  it('should draw cards without replacement', () => {
    const drawn = drawCards(10, { allowReversed: true });
    expect(drawn.length).toBe(10);
    const uniqueIds = new Set(drawn.map(d => d.card.id));
    expect(uniqueIds.size).toBe(10);
  });

  it('should draw a Celtic Cross spread (10 cards) and allow exact reproduction', () => {
    const reading = drawSpread('celtic_cross', 'What does the upcoming quarter hold for my endeavours?');
    expect(reading.spreadId).toBe('celtic_cross');
    expect(reading.cards.length).toBe(10);
    expect(reading.calculationMetadata.totalDeckSize).toBe(78);

    // Reproduction
    const reproduced = reproduceReading(reading);
    expect(reproduced.cards.length).toBe(10);
    for (let i = 0; i < 10; i++) {
      expect(reproduced.cards[i].cardId).toBe(reading.cards[i].cardId);
      expect(reproduced.cards[i].isReversed).toBe(reading.cards[i].isReversed);
      expect(reproduced.cards[i].positionName).toBe(reading.cards[i].positionName);
    }
  });
});
