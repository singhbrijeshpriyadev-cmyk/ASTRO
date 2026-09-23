import { TraditionalGraha } from '@/types/astrology';

export interface GrahaArchetype {
  graha: TraditionalGraha;
  sanskrit: string;
  tarotCard: string;
  element: string;
  archetype: string;
  deity: string;
  psychologicalDimension: string;
  spiritualLesson: string;
}

export const GRAHA_ARCHETYPES: Record<TraditionalGraha, GrahaArchetype> = {
  Surya: {
    graha: 'Surya',
    sanskrit: 'सूर्य',
    tarotCard: 'The Sun (XIX) / The Emperor (IV)',
    element: 'Agni (Fire)',
    archetype: 'The Sovereign / Atman',
    deity: 'Savitr / Vishnu',
    psychologicalDimension: 'Core ego identity, vitality, will to exist, self-radiance, father authority',
    spiritualLesson: 'Recognizing that the individual light is a microcosm of universal consciousness.',
  },
  Chandra: {
    graha: 'Chandra',
    sanskrit: 'चन्द्र',
    tarotCard: 'The High Priestess (II) / The Moon (XVIII)',
    element: 'Jala (Water)',
    archetype: 'The Vessel / Manas',
    deity: 'Soma / Parvati',
    psychologicalDimension: 'Emotional memory, subconscious tides, receptive perception, maternal nurture',
    spiritualLesson: 'Finding equanimity amidst the perpetual waxing and waning of life circumstances.',
  },
  Mangala: {
    graha: 'Mangala',
    sanskrit: 'मंगल',
    tarotCard: 'The Tower (XVI) / The Chariot (VII)',
    element: 'Agni / Tejas',
    archetype: 'The Warrior / Kartikeya',
    deity: 'Skanda / Rudra',
    psychologicalDimension: 'Assertive impulse, boundary defense, physical stamina, tactical courage',
    spiritualLesson: 'Transmuting reactive aggression into disciplined, righteous spiritual courage (Dharma-Yuddha).',
  },
  Budha: {
    graha: 'Budha',
    sanskrit: 'बुध',
    tarotCard: 'The Magician (I)',
    element: 'Prithvi / Vayu',
    archetype: 'The Messenger / Buddhi',
    deity: 'Vishnu / Saraswati',
    psychologicalDimension: 'Analytical discrimination, linguistic mastery, commercial discernment, logic',
    spiritualLesson: 'Bridging sensory perception and spiritual wisdom through speech and discernment.',
  },
  Guru: {
    graha: 'Guru',
    sanskrit: 'गुरु',
    tarotCard: 'The Hierophant (V) / Wheel of Fortune (X)',
    element: 'Akasha (Ether)',
    archetype: 'The Preceptor / Brihaspati',
    deity: 'Dakshinamurti / Indra-Guru',
    psychologicalDimension: 'Ethical judgment, expansive faith, higher scholarship, paternal benevolence',
    spiritualLesson: 'Aligning individual life with cosmic law (Rita) and generous universal stewardship.',
  },
  Shukra: {
    graha: 'Shukra',
    sanskrit: 'शुक्र',
    tarotCard: 'The Empress (III) / The Lovers (VI)',
    element: 'Jala / Ojas',
    archetype: 'The Alchemist of Form / Ushanas',
    deity: 'Lakshmi / Bhrigu',
    psychologicalDimension: 'Aesthetic harmony, reciprocal affection, sensory refinement, rejuvenating vitality',
    spiritualLesson: 'Elevating worldly pleasure and artistic refinement into divine devotion (Bhakti).',
  },
  Shani: {
    graha: 'Shani',
    sanskrit: 'शनि',
    tarotCard: 'The Hermit (IX) / The World (XXI)',
    element: 'Vayu / Tapas',
    archetype: 'The Timekeeper / Kala',
    deity: 'Yama / Shiva (Bhairava)',
    psychologicalDimension: 'Endurance under pressure, awareness of mortality, structured patience, realistic boundaries',
    spiritualLesson: 'Surrendering ego illusions through sustained discipline, patience, and humility.',
  },
  Rahu: {
    graha: 'Rahu',
    sanskrit: 'राहु',
    tarotCard: 'The Devil (XV) / Wheel of Fortune',
    element: 'Chhaya (Shadow / Smoke)',
    archetype: 'The Hungry Quest / Svarbhanu',
    deity: 'Durga / Simhika',
    psychologicalDimension: 'Insatiable material ambition, breaking conventions, futuristic technology, obsession',
    spiritualLesson: 'Exhausting worldly desires until their ephemeral nature becomes unmistakably evident.',
  },
  Ketu: {
    graha: 'Ketu',
    sanskrit: 'केतु',
    tarotCard: 'The Hanged Man (XII) / The Star (XVII)',
    element: 'Moksha / Tejas',
    archetype: 'The Ascetic / Moksha-Karaka',
    deity: 'Ganesha / Matsya',
    psychologicalDimension: 'Detachment, spiritual isolation, intuitive perception, sudden severing of bonds',
    spiritualLesson: 'Radical liberation through surrender of attachment to worldly outcomes.',
  },
  Sun: null as any,
  Moon: null as any,
  Mars: null as any,
  Mercury: null as any,
  Jupiter: null as any,
  Venus: null as any,
  Saturn: null as any,
};

GRAHA_ARCHETYPES.Sun = GRAHA_ARCHETYPES.Surya;
GRAHA_ARCHETYPES.Moon = GRAHA_ARCHETYPES.Chandra;
GRAHA_ARCHETYPES.Mars = GRAHA_ARCHETYPES.Mangala;
GRAHA_ARCHETYPES.Mercury = GRAHA_ARCHETYPES.Budha;
GRAHA_ARCHETYPES.Jupiter = GRAHA_ARCHETYPES.Guru;
GRAHA_ARCHETYPES.Venus = GRAHA_ARCHETYPES.Shukra;
GRAHA_ARCHETYPES.Saturn = GRAHA_ARCHETYPES.Shani;
