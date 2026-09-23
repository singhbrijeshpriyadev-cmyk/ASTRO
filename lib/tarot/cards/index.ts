import { TarotCard, TarotRank } from '../types';
import { MAJOR_ARCANA as RAW_MAJOR } from './major-arcana';
import { MINOR_WANDS as RAW_WANDS } from './minor-wands';
import { MINOR_CUPS as RAW_CUPS } from './minor-cups';
import { MINOR_SWORDS as RAW_SWORDS } from './minor-swords';
import { MINOR_PENTACLES as RAW_PENTACLES } from './minor-pentacles';

export function getTarotCardImageUrl(card: { arcana: string; number: number; suit?: string | null }): string {
  if (card.arcana === 'major') {
    return `/tarot/m${String(card.number).padStart(2, '0')}.jpg`;
  }
  const suitPrefixMap: Record<string, string> = {
    wands: 'w',
    cups: 'c',
    swords: 's',
    pentacles: 'p',
  };
  const prefix = (card.suit && suitPrefixMap[card.suit.toLowerCase()]) || 'w';
  return `/tarot/${prefix}${String(card.number).padStart(2, '0')}.jpg`;
}

function deriveRank(arcana: string, number: number): TarotRank {
  if (arcana === 'major') return 'Major';
  switch (number) {
    case 1: return 'Ace';
    case 2: return '2';
    case 3: return '3';
    case 4: return '4';
    case 5: return '5';
    case 6: return '6';
    case 7: return '7';
    case 8: return '8';
    case 9: return '9';
    case 10: return '10';
    case 11: return 'Page';
    case 12: return 'Knight';
    case 13: return 'Queen';
    case 14: return 'King';
    default: return String(number) as TarotRank;
  }
}

function deriveYesNo(card: { id: string; name: string; arcana: string; number: number; suit?: string | null }): 'Yes' | 'No' | 'Maybe' {
  const noCards = new Set([
    'major_13_death', 'major_15_devil', 'major_16_tower',
    'swords_3', 'swords_5', 'swords_7', 'swords_8', 'swords_9', 'swords_10',
    'cups_5', 'cups_8', 'pentacles_5',
  ]);
  const maybeCards = new Set([
    'major_2_high_priestess', 'major_10_wheel_of_fortune', 'major_12_hanged_man', 'major_18_moon',
    'swords_2', 'cups_7', 'cups_4', 'pentacles_4', 'pentacles_7', 'wands_2', 'wands_7',
  ]);

  if (noCards.has(card.id)) return 'No';
  if (maybeCards.has(card.id)) return 'Maybe';
  return 'Yes';
}

function normalizeCard(raw: any): TarotCard {
  const rank = deriveRank(raw.arcana, raw.number);
  const yes_no = deriveYesNo(raw);
  const image_path = getTarotCardImageUrl(raw);

  const keywords_upright = raw.uprightKeywords || raw.keywords_upright || [];
  const keywords_reversed = raw.reversedKeywords || raw.keywords_reversed || [];
  const meaning_upright = raw.uprightMeaning || raw.meaning_upright || '';
  const meaning_reversed = raw.reversedMeaning || raw.meaning_reversed || '';

  const love_upright = raw.loveMeaning || raw.love_upright || meaning_upright;
  const love_reversed = raw.love_reversed || `Reversed: Calls for honest emotional dialogue and addressing underlying ${keywords_reversed.slice(0, 2).join(' or ').toLowerCase()}.`;

  const career_upright = raw.careerMeaning || raw.career_upright || meaning_upright;
  const career_reversed = raw.career_reversed || `Reversed: Temporary hurdles or need to reassess ${keywords_reversed.slice(0, 2).join(' and ').toLowerCase()}.`;

  const finance_upright = raw.financeMeaning || raw.finance_upright || meaning_upright;
  const finance_reversed = raw.finance_reversed || `Reversed: Prudence advised; review commitments and avoid hasty speculations.`;

  const education_upright = raw.educationMeaning || raw.education_upright || meaning_upright;
  const education_reversed = raw.education_reversed || `Reversed: Overcoming cognitive friction and seeking deeper conceptual integration.`;

  const spiritual_upright = raw.spiritualMeaning || raw.spiritual_upright || meaning_upright;
  const spiritual_reversed = raw.spiritual_reversed || `Reversed: Inward contemplative inquiry, realigning with authentic inner values.`;

  const associated_symbolism = raw.symbolism || raw.associated_symbolism || '';
  const description = raw.description || `${meaning_upright} Symbolism highlights: ${associated_symbolism}`;

  return {
    ...raw,
    rank,
    keywords_upright,
    keywords_reversed,
    meaning_upright,
    meaning_reversed,
    love_upright,
    love_reversed,
    career_upright,
    career_reversed,
    finance_upright,
    finance_reversed,
    education_upright,
    education_reversed,
    spiritual_upright,
    spiritual_reversed,
    yes_no,
    associated_symbolism,
    description,
    image_path,
    // Camelcase compatibility
    uprightKeywords: keywords_upright,
    reversedKeywords: keywords_reversed,
    uprightMeaning: meaning_upright,
    reversedMeaning: meaning_reversed,
    loveMeaning: love_upright,
    careerMeaning: career_upright,
    financeMeaning: finance_upright,
    educationMeaning: education_upright,
    spiritualMeaning: spiritual_upright,
    advice: raw.advice || 'Act with mindful discernment and conscious intention.',
    shadow: raw.shadow || 'Watch for unconscious resistance or unintegrated reactions.',
    symbolism: associated_symbolism,
    astrologicalAssociation: raw.astrologicalAssociation || 'Cosmic Archetype',
  };
}

export const MAJOR_ARCANA: TarotCard[] = RAW_MAJOR.map(normalizeCard);
export const MINOR_WANDS: TarotCard[] = RAW_WANDS.map(normalizeCard);
export const MINOR_CUPS: TarotCard[] = RAW_CUPS.map(normalizeCard);
export const MINOR_SWORDS: TarotCard[] = RAW_SWORDS.map(normalizeCard);
export const MINOR_PENTACLES: TarotCard[] = RAW_PENTACLES.map(normalizeCard);

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...MINOR_WANDS,
  ...MINOR_CUPS,
  ...MINOR_SWORDS,
  ...MINOR_PENTACLES,
];

export const TAROT_CARD_MAP: Record<string, TarotCard> = {};
ALL_TAROT_CARDS.forEach(card => {
  TAROT_CARD_MAP[card.id] = card;
});

export function getTarotCard(id: string): TarotCard {
  const card = TAROT_CARD_MAP[id];
  if (!card) {
    throw new Error(`Tarot card with id "${id}" not found.`);
  }
  return card;
}

export const MAJOR_ARCANA_CARDS = MAJOR_ARCANA;
export const MINOR_ARCANA_CARDS = [
  ...MINOR_WANDS,
  ...MINOR_CUPS,
  ...MINOR_SWORDS,
  ...MINOR_PENTACLES,
];

export const getCardById = getTarotCard;
