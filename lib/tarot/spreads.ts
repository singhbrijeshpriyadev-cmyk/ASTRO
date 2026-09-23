import { TarotSpread } from './types';

export const ONE_CARD_SPREAD: TarotSpread = {
  id: 'one_card',
  name: 'One Card (Single Oracle)',
  description: 'Immediate focal inquiry, daily spiritual theme, or singular contemplative lens.',
  cardCount: 1,
  positions: [
    {
      index: 0,
      name: 'The Core Focus',
      description: 'The primary archetypal energy animating your immediate situation.',
      category: 'Primary',
    },
  ],
  positionMeaning: () => 'The central archetypal theme operating in your life right now.',
  interpretationOrder: [0],
};

export const THREE_CARD_SPREAD: TarotSpread = {
  id: 'three_card',
  name: 'Three Card (Time & Causality)',
  description: 'Chronological or situational progression: Past root, Present climate, and Future horizon.',
  cardCount: 3,
  positions: [
    {
      index: 0,
      name: 'The Root / Past',
      description: 'The foundational cause and historical impetus leading into the present moment.',
      category: 'Foundation',
    },
    {
      index: 1,
      name: 'The Present Crucible',
      description: 'The active energy, immediate challenge, or current realization requiring presence.',
      category: 'Action',
    },
    {
      index: 2,
      name: 'The Trajectory / Future',
      description: 'The natural crystallization of current momentum if unhindered by conscious redirection.',
      category: 'Outcome',
    },
  ],
  positionMeaning: (idx: number) => {
    switch (idx) {
      case 0:
        return 'Foundational root cause and past karmic seeds.';
      case 1:
        return 'Present operating reality and focal awareness.';
      case 2:
        return 'Likely trajectory and evolving horizon.';
      default:
        return 'Card position context.';
    }
  },
  interpretationOrder: [0, 1, 2],
};

export const RELATIONSHIP_SPREAD: TarotSpread = {
  id: 'relationship',
  name: 'Relationship Spread (Mutual Mirror)',
  description: 'Deep inquiry into partnership dynamics, mutual perceptions, and evolutionary potential.',
  cardCount: 5,
  positions: [
    {
      index: 0,
      name: 'Your Stance (Self)',
      description: 'Your conscious perspective, emotional energy, and contributions to the dynamic.',
      category: 'Self',
    },
    {
      index: 1,
      name: 'Partner’s Stance (Other)',
      description: 'Your partner’s current perspective, emotional climate, and inner orientation.',
      category: 'Other',
    },
    {
      index: 2,
      name: 'The Dynamic (Connection)',
      description: 'The living space between both souls; the current vibrational frequency of the union.',
      category: 'Bond',
    },
    {
      index: 3,
      name: 'Hidden Influences (Subconscious)',
      description: 'Unspoken projections, past karmic conditioning, or external pressures coloring the bond.',
      category: 'Shadow',
    },
    {
      index: 4,
      name: 'Harmonic Potential (Outcome)',
      description: 'The highest evolutionary horizon achievable through conscious mutual dedication.',
      category: 'Horizon',
    },
  ],
  positionMeaning: (idx: number) => {
    switch (idx) {
      case 0:
        return 'Your emotional perspective and internal stance.';
      case 1:
        return 'Your partner’s perspective and operating reality.';
      case 2:
        return 'The relational bridge and energetic dynamic between you.';
      case 3:
        return 'Subconscious shadow or unseen external pressure.';
      case 4:
        return 'Evolutionary potential and highest path forward together.';
      default:
        return 'Relationship dimension.';
    }
  },
  interpretationOrder: [0, 1, 2, 3, 4],
};

export const CAREER_SPREAD: TarotSpread = {
  id: 'career',
  name: 'Career & Vocation Spread',
  description: 'Strategic examination of professional direction, vocational strengths, and leadership hurdles.',
  cardCount: 5,
  positions: [
    {
      index: 0,
      name: 'Current Professional Standing',
      description: 'Where you currently stand in your career, role, or commercial endeavor.',
      category: 'Present',
    },
    {
      index: 1,
      name: 'Latent Vocational Superpower',
      description: 'Unrecognized or underutilized skills and strengths ready to be deployed.',
      category: 'Strength',
    },
    {
      index: 2,
      name: 'Workplace Hurdle',
      description: 'The primary operational, organizational, or interpersonal friction point.',
      category: 'Obstacle',
    },
    {
      index: 3,
      name: 'Strategic Action',
      description: 'The tactical, practical behavior recommended to navigate current challenges.',
      category: 'Advice',
    },
    {
      index: 4,
      name: 'Professional Horizon',
      description: 'The career milestone, recognition, or elevation awaiting purposeful effort.',
      category: 'Culmination',
    },
  ],
  positionMeaning: (idx: number) => {
    switch (idx) {
      case 0:
        return 'Current professional baseline and role.';
      case 1:
        return 'Key strength and competitive advantage.';
      case 2:
        return 'Immediate professional bottleneck or challenge.';
      case 3:
        return 'Recommended strategic action.';
      case 4:
        return 'Professional trajectory and career fruition.';
      default:
        return 'Career factor.';
    }
  },
  interpretationOrder: [0, 1, 2, 3, 4],
};

export const MONEY_SPREAD: TarotSpread = {
  id: 'money',
  name: 'Wealth & Prosperity Spread',
  description: 'Financial resource analysis: Foundation, resource leaks, growth vectors, and long-term security.',
  cardCount: 5,
  positions: [
    {
      index: 0,
      name: 'Financial Foundation',
      description: 'Your current relationship with money, assets, and material security.',
      category: 'Foundation',
    },
    {
      index: 1,
      name: 'Resource Leaks (Drain)',
      description: 'Subconscious anxieties, wasteful habits, or hidden drains depleting your treasury.',
      category: 'Challenge',
    },
    {
      index: 2,
      name: 'Prosperity Catalyst',
      description: 'Lucrative opportunities, unexplored talents, or viable revenue channels.',
      category: 'Opportunity',
    },
    {
      index: 3,
      name: 'Fiscal Discipline',
      description: 'Actionable financial strategy required: saving, reallocating, or investing.',
      category: 'Action',
    },
    {
      index: 4,
      name: 'Wealth Horizon',
      description: 'Long-term financial equilibrium, asset security, and tangible prosperity potential.',
      category: 'Outcome',
    },
  ],
  positionMeaning: (idx: number) => {
    switch (idx) {
      case 0:
        return 'Financial baseline and security foundation.';
      case 1:
        return 'Resource leakage and financial friction.';
      case 2:
        return 'Growth opportunity and revenue catalyst.';
      case 3:
        return 'Practical financial guidance.';
      case 4:
        return 'Long-term asset stability and wealth fruition.';
      default:
        return 'Financial dimension.';
    }
  },
  interpretationOrder: [0, 1, 2, 3, 4],
};

export const EDUCATION_SPREAD: TarotSpread = {
  id: 'education',
  name: 'Education & Scholarship Spread',
  description: 'Academic inquiry: Intellectual strengths, study blockages, mentor guidance, and exam outcomes.',
  cardCount: 5,
  positions: [
    {
      index: 0,
      name: 'Intellectual Foundation',
      description: 'Your current academic baseline, study habits, and intellectual aptitude.',
      category: 'Foundation',
    },
    {
      index: 1,
      name: 'Cognitive Hurdle',
      description: 'Distractions, imposter syndrome, mental fatigue, or conceptual stumbling blocks.',
      category: 'Obstacle',
    },
    {
      index: 2,
      name: 'Mentor & Method',
      description: 'The teaching style, mentor counsel, or research methodology best suited to you.',
      category: 'Guidance',
    },
    {
      index: 3,
      name: 'Optimal Study Focus',
      description: 'The specific discipline, topic, or deliberate practice that yields highest mastery.',
      category: 'Focus',
    },
    {
      index: 4,
      name: 'Scholarly Culmination',
      description: 'Academic milestone, graduation, exam success, or intellectual breakthrough.',
      category: 'Outcome',
    },
  ],
  positionMeaning: (idx: number) => {
    switch (idx) {
      case 0:
        return 'Academic foundation and intellectual capacity.';
      case 1:
        return 'Learning bottleneck or cognitive obstacle.';
      case 2:
        return 'Guidance, mentorship, and methodology.';
      case 3:
        return 'High-leverage study focus.';
      case 4:
        return 'Academic milestone and scholarly success.';
      default:
        return 'Educational dimension.';
    }
  },
  interpretationOrder: [0, 1, 2, 3, 4],
};

export const CELTIC_CROSS_SPREAD: TarotSpread = {
  id: 'celtic_cross',
  name: 'The Celtic Cross (Complete Oracle)',
  description: 'The classical 10-card cross-and-staff spread covering all dimensions of life and soul purpose.',
  cardCount: 10,
  positions: [
    {
      index: 0,
      name: '1. The Heart of the Matter (Present)',
      description: 'The core energy, immediate atmosphere, and primary lesson facing the querent.',
      category: 'Cross',
    },
    {
      index: 1,
      name: '2. The Crossing Factor (Challenge)',
      description: 'The immediate obstacle, friction, or cross-current testing your resolve.',
      category: 'Cross',
    },
    {
      index: 2,
      name: '3. The Root (Subconscious Foundation)',
      description: 'Deep ancestral or subconscious roots, past life karmic seeds, and foundation.',
      category: 'Cross',
    },
    {
      index: 3,
      name: '4. The Recent Past (Passing Energy)',
      description: 'Influences that are waning or events recently concluded.',
      category: 'Cross',
    },
    {
      index: 4,
      name: '5. The Crown (Conscious Goal)',
      description: 'Your conscious aspirations, highest ideals, and what you aim to achieve.',
      category: 'Cross',
    },
    {
      index: 5,
      name: '6. The Near Future (Emerging Horizon)',
      description: 'The immediate upcoming phase or energy entering your field.',
      category: 'Cross',
    },
    {
      index: 6,
      name: '7. Self / Attitude',
      description: 'Your internal stance, self-concept, and psychological state.',
      category: 'Staff',
    },
    {
      index: 7,
      name: '8. External Environment',
      description: 'The influence of family, colleagues, social expectations, and external conditions.',
      category: 'Staff',
    },
    {
      index: 8,
      name: '9. Hopes and Fears',
      description: 'Your innermost desires and unspoken anxieties regarding the situation.',
      category: 'Staff',
    },
    {
      index: 9,
      name: '10. Ultimate Outcome',
      description: 'The resolution and cumulative culmination of the entire situation.',
      category: 'Staff',
    },
  ],
  positionMeaning: (idx: number) => {
    switch (idx) {
      case 0:
        return 'Present core situation and primary energy.';
      case 1:
        return 'Immediate challenge or crossing obstacle.';
      case 2:
        return 'Root foundation and subconscious origin.';
      case 3:
        return 'Recent past influences receding.';
      case 4:
        return 'Conscious goal and highest potential.';
      case 5:
        return 'Near future developments.';
      case 6:
        return 'Your internal psychological state and attitude.';
      case 7:
        return 'External environment and interpersonal influences.';
      case 8:
        return 'Inner hopes and secret fears.';
      case 9:
        return 'Ultimate culmination and long-term resolution.';
      default:
        return 'Celtic Cross position.';
    }
  },
  interpretationOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

export const SPREAD_MAP: Record<string, TarotSpread> = {
  one_card: ONE_CARD_SPREAD,
  three_card: THREE_CARD_SPREAD,
  relationship: RELATIONSHIP_SPREAD,
  career: CAREER_SPREAD,
  money: MONEY_SPREAD,
  education: EDUCATION_SPREAD,
  celtic_cross: CELTIC_CROSS_SPREAD,
};

export const ALL_SPREADS: TarotSpread[] = [
  ONE_CARD_SPREAD,
  THREE_CARD_SPREAD,
  RELATIONSHIP_SPREAD,
  CAREER_SPREAD,
  MONEY_SPREAD,
  EDUCATION_SPREAD,
  CELTIC_CROSS_SPREAD,
];

export function getSpread(id: string): TarotSpread {
  const normalized = id.replace(/-/g, '_');
  const spread = SPREAD_MAP[normalized] || SPREAD_MAP[id];
  if (!spread) {
    throw new Error(`Tarot spread with id "${id}" not found.`);
  }
  return spread;
}

export const getSpreadById = getSpread;
