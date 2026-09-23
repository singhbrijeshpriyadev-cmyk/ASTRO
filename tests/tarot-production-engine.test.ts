import { describe, it, expect } from 'vitest';
import { ALL_TAROT_CARDS, MAJOR_ARCANA_CARDS, MINOR_ARCANA_CARDS, getTarotCard } from '../lib/tarot/cards';
import { drawRandomCards, generateReadingId } from '../lib/tarot/randomizer';
import { 
  interpretThreeCardSpread, 
  deriveTopicMeaning, 
  derivePositionMeaning,
  analyzeSpreadCombination,
  TOPIC_METADATA 
} from '../lib/tarot/interpretation-engine';
import { 
  saveTarotReading, 
  getSavedReadings, 
  deleteSavedReading, 
  clearAllSavedReadings 
} from '../lib/tarot/history';
import { TarotTopic, TarotOrientation } from '../lib/tarot/types';

describe('PRODUCTION TAROT ENGINE AUDIT & VERIFICATION', () => {
  /* ========================================================
   * 1. 78-CARD DECK INTEGRITY TESTS
   * ======================================================== */
  describe('1. 78-Card Deck Database Integrity', () => {
    it('contains exactly 78 total cards', () => {
      expect(ALL_TAROT_CARDS.length).toBe(78);
    });

    it('contains exactly 22 Major Arcana cards (0 to 21)', () => {
      expect(MAJOR_ARCANA_CARDS.length).toBe(22);
      const numbers = MAJOR_ARCANA_CARDS.map(c => c.number).sort((a, b) => a - b);
      expect(numbers).toEqual(Array.from({ length: 22 }, (_, i) => i));
      MAJOR_ARCANA_CARDS.forEach(c => {
        expect(c.arcana).toBe('major');
        expect(c.suit).toBeNull();
        expect(c.rank).toBe('Major');
      });
    });

    it('contains exactly 56 Minor Arcana cards across 4 suits of 14 cards each', () => {
      expect(MINOR_ARCANA_CARDS.length).toBe(56);
      const suits = ['wands', 'cups', 'swords', 'pentacles'];
      const expectedRanks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];

      suits.forEach(suit => {
        const inSuit = MINOR_ARCANA_CARDS.filter(c => c.suit === suit);
        expect(inSuit.length).toBe(14);
        const ranksInSuit = inSuit.map(c => c.rank);
        expectedRanks.forEach(expectedRank => {
          expect(ranksInSuit).toContain(expectedRank);
        });
      });
    });

    it('has unique IDs and names for every single card', () => {
      const ids = ALL_TAROT_CARDS.map(c => c.id);
      const names = ALL_TAROT_CARDS.map(c => c.name);
      expect(new Set(ids).size).toBe(78);
      expect(new Set(names).size).toBe(78);
    });

    it('populates all Section 9 required fields without null/undefined or placeholders', () => {
      const forbiddenPlaceholders = ['lorem ipsum', 'sample meaning', 'coming soon', 'ai generated', 'placeholder'];

      ALL_TAROT_CARDS.forEach(card => {
        // Essential identifiers
        expect(card.id).toBeTruthy();
        expect(card.name).toBeTruthy();
        expect(['major', 'minor']).toContain(card.arcana);
        expect(typeof card.number).toBe('number');
        expect(card.rank).toBeTruthy();

        // Section 9 Snake_case fields
        expect(Array.isArray(card.keywords_upright)).toBe(true);
        expect(card.keywords_upright?.length).toBeGreaterThan(0);

        expect(Array.isArray(card.keywords_reversed)).toBe(true);
        expect(card.keywords_reversed?.length).toBeGreaterThan(0);

        expect(card.meaning_upright).toBeTruthy();
        expect(card.meaning_reversed).toBeTruthy();

        expect(card.love_upright).toBeTruthy();
        expect(card.love_reversed).toBeTruthy();

        expect(card.career_upright).toBeTruthy();
        expect(card.career_reversed).toBeTruthy();

        expect(card.finance_upright).toBeTruthy();
        expect(card.finance_reversed).toBeTruthy();

        expect(card.education_upright).toBeTruthy();
        expect(card.education_reversed).toBeTruthy();

        expect(card.spiritual_upright).toBeTruthy();
        expect(card.spiritual_reversed).toBeTruthy();

        expect(['Yes', 'No', 'Maybe']).toContain(card.yes_no);
        expect(['Fire', 'Water', 'Air', 'Earth', 'Spirit']).toContain(card.element);

        expect(card.associated_symbolism).toBeTruthy();
        expect(card.description).toBeTruthy();
        expect(card.image_path).toMatch(/^\/tarot\/[mcwsp]\d{2}\.jpg$/);

        // Verification against placeholders
        const allText = [
          card.meaning_upright,
          card.meaning_reversed,
          card.love_upright,
          card.career_upright,
          card.finance_upright,
          card.education_upright,
          card.spiritual_upright,
          card.description,
        ].join(' ').toLowerCase();

        forbiddenPlaceholders.forEach(ph => {
          expect(allText).not.toContain(ph);
        });
      });
    });
  });

  /* ========================================================
   * 2. RANDOMIZER & SAMPLING INTEGRITY TESTS
   * ======================================================== */
  describe('2. Randomizer Engine', () => {
    it('samples exactly 3 unique cards without replacement', () => {
      for (let i = 0; i < 30; i++) {
        const drawn = drawRandomCards(3);
        expect(drawn.length).toBe(3);
        const cardIds = drawn.map(d => d.card.id);
        expect(new Set(cardIds).size).toBe(3);
      }
    });

    it('assigns valid orientations independently to each drawn card', () => {
      const orientationsSeen = new Set<TarotOrientation>();
      for (let i = 0; i < 40; i++) {
        const drawn = drawRandomCards(3);
        drawn.forEach(d => {
          expect(['upright', 'reversed']).toContain(d.orientation);
          orientationsSeen.add(d.orientation);
        });
      }
      expect(orientationsSeen.has('upright')).toBe(true);
      expect(orientationsSeen.has('reversed')).toBe(true);
    });

    it('generates unique formatted reading IDs (tarot_YYYYMMDD_XXXXXX)', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 20; i++) {
        const id = generateReadingId();
        expect(id).toMatch(/^tarot_\d{8}_[0-9A-Z]{6}$/);
        ids.add(id);
      }
      expect(ids.size).toBe(20);
    });
  });

  /* ========================================================
   * 3. INTERPRETATION ENGINE TESTS
   * ======================================================== */
  describe('3. Interpretation Engine', () => {
    const fool = getTarotCard('major_0_fool');
    const star = getTarotCard('major_17_star');
    const aceOfWands = getTarotCard('wands_1_ace');

    it('contextualizes all 10 topics accurately', () => {
      const topics: TarotTopic[] = [
        'general', 'love', 'career', 'education', 'finance', 
        'family', 'growth', 'spirituality', 'decision', 'yes_no'
      ];

      topics.forEach(topic => {
        const uprightMeaning = deriveTopicMeaning(fool, 'upright', topic);
        const reversedMeaning = deriveTopicMeaning(fool, 'reversed', topic);
        expect(uprightMeaning).toBeTruthy();
        expect(reversedMeaning).toBeTruthy();
        expect(uprightMeaning).not.toBe(reversedMeaning);
      });
    });

    it('ensures Future position uses non-fatalistic language', () => {
      const futureMeaning = derivePositionMeaning(star, 'upright', 'future');
      expect(futureMeaning.toLowerCase()).toContain('emerging trajectory to consider');
      expect(futureMeaning.toLowerCase()).toContain('rather than a fatalistic certainty');
      expect(futureMeaning.toLowerCase()).not.toContain('this will definitely happen');
      expect(futureMeaning.toLowerCase()).not.toContain('guaranteed outcome');
    });

    it('analyzes cross-card combinations for Major Arcana concentration', () => {
      // 2 Major Arcana + 1 Minor Arcana
      const drawn = [
        { card: fool, orientation: 'upright' as TarotOrientation, position: 'past' as const },
        { card: star, orientation: 'upright' as TarotOrientation, position: 'present' as const },
        { card: aceOfWands, orientation: 'reversed' as TarotOrientation, position: 'future' as const },
      ];

      const combo = analyzeSpreadCombination(drawn);
      expect(combo.majorArcanaCount).toBe(2);
      expect(combo.majorArcanaEmphasis).toBe(true);
      expect(combo.progression).toContain('Major Arcana cards active');
      expect(combo.uprightRatio).toBe('2 Upright / 1 Reversed');
    });

    it('produces a complete structured ProductionTarotReading', () => {
      const drawn = [
        { card: fool, orientation: 'upright' as TarotOrientation },
        { card: star, orientation: 'upright' as TarotOrientation },
        { card: aceOfWands, orientation: 'reversed' as TarotOrientation },
      ];

      const reading = interpretThreeCardSpread(
        drawn,
        'What vocational shift awaits me?',
        'career'
      );

      expect(reading.readingId).toMatch(/^tarot_\d{8}_[0-9A-Z]{6}$/);
      expect(reading.question).toBe('What vocational shift awaits me?');
      expect(reading.topic).toBe('career');
      expect(reading.cards.length).toBe(3);
      expect(reading.cards[0].position).toBe('past');
      expect(reading.cards[1].position).toBe('present');
      expect(reading.cards[2].position).toBe('future');
      expect(reading.themes.length).toBeGreaterThanOrEqual(3);
      expect(reading.overallReading).toBeTruthy();
      expect(reading.guidance).toBeTruthy();
      expect(reading.reflection).toContain('?');
      expect(reading.disclaimer).toContain('Tarot readings are intended for self-reflection');
    });
  });

  /* ========================================================
   * 4. READING HISTORY PERSISTENCE TESTS
   * ======================================================== */
  describe('4. Reading History Persistence', () => {
    it('saves, retrieves, and deletes readings in history', () => {
      clearAllSavedReadings();
      expect(getSavedReadings().length).toBe(0);

      const drawn = [
        { card: getTarotCard('major_0_fool'), orientation: 'upright' as TarotOrientation },
        { card: getTarotCard('major_1_magician'), orientation: 'upright' as TarotOrientation },
        { card: getTarotCard('major_2_high_priestess'), orientation: 'reversed' as TarotOrientation },
      ];

      const reading = interpretThreeCardSpread(drawn, 'History test question', 'love');
      const saved = saveTarotReading(reading);

      expect(saved.readingId).toBe(reading.readingId);
      const allSaved = getSavedReadings();
      expect(allSaved.length).toBe(1);
      expect(allSaved[0].question).toBe('History test question');

      // Delete reading
      const afterDelete = deleteSavedReading(reading.readingId);
      expect(afterDelete.length).toBe(0);
      expect(getSavedReadings().length).toBe(0);
    });
  });
});
