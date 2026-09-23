import { GrahaName, DignityType } from '@/types/astrology';

export interface ClassicalAphorism {
  id: string;
  source: string; // e.g. 'Brihat Parashara Hora Shastra', 'Saravali'
  category: 'Lagna' | 'Graha' | 'Bhava' | 'Yoga';
  verseReference: string;
  text: string;
  insight: string;
}

export const CLASSICAL_APHORISMS: ClassicalAphorism[] = [
  {
    id: 'bphs_lagna_1',
    source: 'Brihat Parashara Hora Shastra',
    category: 'Lagna',
    verseReference: 'BPHS Ch. 11, Sl. 2',
    text: 'The Ascendant (Lagna) is the foundation of the horoscope, representing bodily strength, longevity, and inherent constitutional nature.',
    insight: 'All planetary significations must be filtered through the strength and dignity of the Lagna Lord.'
  },
  {
    id: 'bphs_kendra_trikona',
    source: 'Brihat Parashara Hora Shastra',
    category: 'Bhava',
    verseReference: 'BPHS Ch. 34, Sl. 14',
    text: 'Kendras (1, 4, 7, 10) are the pillars of Vishnu representing sustenance and action; Trikonas (1, 5, 9) are the houses of Lakshmi representing grace and fortune.',
    insight: 'When lords of Kendras and Trikonas associate by conjunction or mutual aspect, powerful Raja Yogas manifest.'
  },
  {
    id: 'saravali_guru',
    source: 'Saravali (Kalyana Varma)',
    category: 'Graha',
    verseReference: 'Saravali Ch. 27, Sl. 1-4',
    text: 'Jupiter placed in Kendra dispels thousands of blemishes, as the rising sun destroys nocturnal darkness.',
    insight: 'A well-dignified Jupiter in 1st, 4th, 7th, or 10th house acts as a protective shield for life events.'
  },
  {
    id: 'bphs_dasha_phala',
    source: 'Brihat Parashara Hora Shastra',
    category: 'Yoga',
    verseReference: 'BPHS Ch. 46, Sl. 10',
    text: 'The effects of Dashas manifest according to the natural disposition, lordship, and temporal friendships of the Grahas in the natal chart.',
    insight: 'Dasha lords act as the cosmic trigger bringing natal potentials into tangible chronological reality.'
  }
];

export function getInterpretationForGrahaInHouse(
  graha: GrahaName,
  house: number,
  dignity: DignityType
): string {
  const dignityModifier = 
    dignity === 'Exalted' ? 'operating in its most exalted, purest expression' :
    dignity === 'Debilitated' ? 'requiring conscious discipline and conscious remedial awareness' :
    dignity === 'Own Sign' ? 'with natural sovereign ease and strong self-reliance' :
    'with steady developmental lessons';

  return `${graha} in the ${house}th house ${dignityModifier}. It directs vital focus to house themes through its planetary nature.`;
}
