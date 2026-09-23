import { 
  TarotCard, 
  TarotOrientation, 
  TarotTopic, 
  StructuredDrawnCard, 
  CombinationAnalysis, 
  ProductionTarotReading,
  TarotElement 
} from './types';
import { generateReadingId } from './randomizer';
import { getTarotCardImageUrl } from './cards';

export const TOPIC_METADATA: Record<TarotTopic, { label: string; description: string; iconName: string }> = {
  general: {
    label: 'General Insight',
    description: 'Holistic reflection on overall life energy and underlying current patterns.',
    iconName: 'Sparkles',
  },
  love: {
    label: 'Love & Relationships',
    description: 'Heart connection, interpersonal dynamics, emotional honesty, and mutual growth.',
    iconName: 'Heart',
  },
  career: {
    label: 'Career & Ambition',
    description: 'Professional trajectory, leadership, vocational clarity, and workplace challenges.',
    iconName: 'Briefcase',
  },
  education: {
    label: 'Education & Intellect',
    description: 'Academic studies, intellectual mastery, examinations, and cognitive expansion.',
    iconName: 'GraduationCap',
  },
  finance: {
    label: 'Finance & Resources',
    description: 'Material security, investments, resource management, and abundance mindset.',
    iconName: 'Coins',
  },
  family: {
    label: 'Family & Roots',
    description: 'Ancestral patterns, domestic harmony, family bonds, and foundational security.',
    iconName: 'Home',
  },
  growth: {
    label: 'Personal Growth',
    description: 'Self-mastery, emotional resilience, breaking old habits, and conscious evolution.',
    iconName: 'TrendingUp',
  },
  spirituality: {
    label: 'Spirituality & Karma',
    description: 'Higher purpose, inner alignment, contemplative practice, and karmic lessons.',
    iconName: 'Compass',
  },
  decision: {
    label: 'Decisions & Crossroad',
    description: 'Evaluating crossroads, discerning hidden variables, and weighing alternatives.',
    iconName: 'GitFork',
  },
  yes_no: {
    label: 'Yes / No Inquiry',
    description: 'Direct inquiry focusing on energetic momentum, openness, and potential obstacles.',
    iconName: 'CheckCircle2',
  },
};

/**
 * Derives topic-contextual interpretation for a specific card and orientation.
 */
export function deriveTopicMeaning(card: TarotCard, orientation: TarotOrientation, topic: TarotTopic): string {
  const isUpright = orientation === 'upright';
  const uprightKw = card.keywords_upright || card.uprightKeywords || [];
  const reversedKw = card.keywords_reversed || card.reversedKeywords || [];
  const meaningUpright = card.meaning_upright || card.uprightMeaning || '';
  const meaningReversed = card.meaning_reversed || card.reversedMeaning || '';

  switch (topic) {
    case 'love':
      return isUpright ? (card.love_upright || card.loveMeaning) : (card.love_reversed || `Reversed: Calls for transparent emotional vulnerability and unburdening unspoken expectations.`);
    case 'career':
      return isUpright ? (card.career_upright || card.careerMeaning) : (card.career_reversed || `Reversed: Professional deceleration or the need to refine strategies before launching outward.`);
    case 'finance':
      return isUpright ? (card.finance_upright || card.financeMeaning) : (card.finance_reversed || `Reversed: Prudence and careful auditing advised; avoid speculative financial impulsiveness.`);
    case 'education':
      return isUpright ? (card.education_upright || card.educationMeaning) : (card.education_reversed || `Reversed: Working through cognitive blockages and adopting fresh learning frameworks.`);
    case 'spirituality':
      return isUpright ? (card.spiritual_upright || card.spiritualMeaning) : (card.spiritual_reversed || `Reversed: Inner sanctuary work; returning to personal contemplation rather than outer dogma.`);
    case 'family':
      return isUpright
        ? `In family matters, ${card.name} reflects ${uprightKw.slice(0, 3).join(', ').toLowerCase()}, fostering mutual respect and shared lineage strength.`
        : `In domestic spheres, reversed ${card.name} signals a time to heal past misunderstandings and establish healthy emotional boundaries.`;
    case 'growth':
      return isUpright
        ? `Personal evolution is catalyzed by ${uprightKw.slice(0, 3).join(', ').toLowerCase()}, inviting intentional action.`
        : `Inner growth centers on recognizing shadow traits: ${card.shadow}. Transforming self-judgment into compassionate integration.`;
    case 'decision':
      return isUpright
        ? `Regarding your crossroad, ${card.name} provides constructive momentum toward decisive, aligned action.`
        : `At this crossroad, reversed ${card.name} recommends pausing to resolve underlying reservations before committing fully.`;
    case 'yes_no':
      return isUpright
        ? `${card.name} in the upright orientation carries an affirmative, constructive frequency (${card.yes_no || 'Yes'}), supporting forward movement.`
        : `Reversed, ${card.name} introduces pause or resistance, advising caution or resolving prerequisites before proceeding.`;
    case 'general':
    default:
      return isUpright ? meaningUpright : meaningReversed;
  }
}

/**
 * Derives spread-position interpretation for Card 1 (Past), Card 2 (Present), or Card 3 (Future).
 */
export function derivePositionMeaning(card: TarotCard, orientation: TarotOrientation, position: 'past' | 'present' | 'future'): string {
  const base = orientation === 'upright' 
    ? (card.meaning_upright || card.uprightMeaning || '') 
    : (card.meaning_reversed || card.reversedMeaning || '');

  if (position === 'past') {
    return `Foundation & Historical Impetus: ${base} This card illuminates the foundational circumstances, prior decisions, and root energy that set the stage for your current inquiry.`;
  }

  if (position === 'present') {
    return `Current Energy & Immediate Crucible: ${base} This highlights the focal point of your active awareness right now—the central theme, friction, or vital catalyst demanding conscious stewardship.`;
  }

  // Future position: Strictly non-fatalistic language
  return `Evolving Horizon & Potential Direction: If current momentum unfolds without major intervention, ${base} The cards suggest this as an emerging trajectory to consider with mindful agency, rather than a fatalistic certainty.`;
}

/**
 * Analyzes relationship between the 3 drawn cards.
 */
export function analyzeSpreadCombination(
  drawn: Array<{ card: TarotCard; orientation: TarotOrientation; position: 'past' | 'present' | 'future' }>
): CombinationAnalysis {
  const majorArcanaCount = drawn.filter(d => d.card.arcana === 'major').length;
  const majorArcanaEmphasis = majorArcanaCount >= 2;

  // Element counts
  const elementCounts: Record<TarotElement, number> = {
    Fire: 0,
    Water: 0,
    Air: 0,
    Earth: 0,
    Spirit: 0,
  };
  drawn.forEach(d => {
    if (d.card.element) {
      elementCounts[d.card.element] = (elementCounts[d.card.element] || 0) + 1;
    }
  });

  // Dominant element
  const sortedElements = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
  const dominantElement = sortedElements[0][1] > 1 ? sortedElements[0][0] : 'Balanced Elemental Synthesis';

  // Suit repetitions
  const suits = drawn.map(d => d.card.suit).filter(Boolean) as string[];
  const suitCounts: Record<string, number> = {};
  suits.forEach(s => { suitCounts[s] = (suitCounts[s] || 0) + 1; });
  const repeatedSuits = Object.entries(suitCounts)
    .filter(([_, count]) => count >= 2)
    .map(([suit, count]) => `${count} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`);

  // Rank repetitions
  const ranks = drawn.map(d => d.card.rank).filter(r => r && r !== 'Major') as string[];
  const rankCounts: Record<string, number> = {};
  ranks.forEach(r => { rankCounts[r] = (rankCounts[r] || 0) + 1; });
  const repeatedRanks = Object.entries(rankCounts)
    .filter(([_, count]) => count >= 2)
    .map(([rank, count]) => `Multiple ${rank}s`);

  // Upright vs Reversed
  const uprightCount = drawn.filter(d => d.orientation === 'upright').length;
  const uprightRatio = `${uprightCount} Upright / ${3 - uprightCount} Reversed`;

  // Progression synthesis
  const [c1, c2, c3] = drawn;
  let progression = `Movement flows from ${c1.card.name} (${c1.orientation}) through ${c2.card.name} (${c2.orientation}), pointing toward ${c3.card.name} (${c3.orientation}).`;

  if (majorArcanaEmphasis) {
    progression += ` With ${majorArcanaCount} Major Arcana cards active, this reading emphasizes deep archetypal cycles and pivotal life chapters rather than temporary daily fluctuations.`;
  } else {
    progression += ` Dominated by Minor Arcana, the energies highlight practical, day-to-day choices, relationships, and actionable steps within your immediate control.`;
  }

  return {
    majorArcanaCount,
    majorArcanaEmphasis,
    elementalBalance: dominantElement === 'Balanced Elemental Synthesis'
      ? 'A harmonious distribution across multiple elements, indicating a multi-layered situation.'
      : `Prominence of ${dominantElement} energy, emphasizing ${dominantElement === 'Fire' ? 'action, vitality, and passion' : dominantElement === 'Water' ? 'emotion, intuition, and relational depth' : dominantElement === 'Air' ? 'intellect, communication, and perspective' : 'material stability, physical reality, and practical manifestation'}.`,
    repeatedSuits,
    repeatedRanks,
    uprightRatio,
    progression,
  };
}

/**
 * Builds the complete structured ProductionTarotReading.
 */
export function interpretThreeCardSpread(
  drawnRaw: Array<{ card: TarotCard; orientation: TarotOrientation }>,
  question: string,
  topic: TarotTopic = 'general'
): ProductionTarotReading {
  const positions: Array<'past' | 'present' | 'future'> = ['past', 'present', 'future'];
  const positionLabels = ['Past / Foundation', 'Present / Current Energy', 'Future / Direction'];

  const structuredCards = drawnRaw.map((item, idx) => {
    const pos = positions[idx];
    const posName = positionLabels[idx];
    const baseMeaning = item.orientation === 'upright' 
      ? (item.card.meaning_upright || item.card.uprightMeaning || '') 
      : (item.card.meaning_reversed || item.card.reversedMeaning || '');
    const posMeaning = derivePositionMeaning(item.card, item.orientation, pos);
    const topicMeaning = deriveTopicMeaning(item.card, item.orientation, topic);
    const keywords = (item.orientation === 'upright' 
      ? (item.card.keywords_upright || item.card.uprightKeywords) 
      : (item.card.keywords_reversed || item.card.reversedKeywords)) || [];

    const practicalReflection = item.orientation === 'upright'
      ? `${item.card.advice} Ground this through conscious presence and alignment with ${item.card.element} energy.`
      : `Shadow Integration: ${item.card.shadow} Mindfully acknowledge where natural flow has been resisted or internalized.`;

    const structured: StructuredDrawnCard = {
      cardId: item.card.id,
      name: item.card.name,
      arcana: item.card.arcana,
      suit: item.card.suit,
      rank: item.card.rank || 'Major',
      number: item.card.number,
      orientation: item.orientation,
      position: pos,
      positionName: posName,
      card: item.card,
      imageUrl: getTarotCardImageUrl(item.card),
      baseMeaning,
      positionMeaning: posMeaning,
      topicMeaning,
      practicalReflection,
      keywords,
    };
    return structured;
  }) as [StructuredDrawnCard, StructuredDrawnCard, StructuredDrawnCard];

  const combination = analyzeSpreadCombination(
    structuredCards.map(sc => ({ card: sc.card, orientation: sc.orientation, position: sc.position as any }))
  );

  const [past, present, future] = structuredCards;
  const topicMeta = TOPIC_METADATA[topic] || TOPIC_METADATA.general;

  // Extract cohesive themes
  const themesSet = new Set<string>();
  structuredCards.forEach(c => {
    c.keywords.slice(0, 2).forEach(kw => themesSet.add(kw));
  });
  if (combination.majorArcanaEmphasis) {
    themesSet.add('Archetypal Turning Point');
  }
  const themes = Array.from(themesSet).slice(0, 5);

  // Overall reading synthesis
  const overallReading = [
    `The three-card spread offers an archetypal mirror reflecting the energetic currents surrounding your question: *"${question || topicMeta.label}"*.`,
    ``,
    `In the **Foundation (${past.name} - ${past.orientation})**, prior developments formed the energetic springboard for this chapter. ${past.topicMeaning}`,
    ``,
    `At the **Center of Present Awareness (${present.name} - ${present.orientation})**, your immediate reality invites conscious discernment. ${present.topicMeaning}`,
    ``,
    `Looking toward the **Evolving Horizon (${future.name} - ${future.orientation})**, the cards outline an emerging potential rather than a fixed destiny. ${future.topicMeaning}`,
    ``,
    `**Elemental & Structural Synthesis**: ${combination.elementalBalance} ${combination.progression}`,
  ].join('\n');

  // Practical Guidance
  const guidance = [
    `Honor the foundation of ${past.name} by acknowledging the lessons it delivered.`,
    `Focus your primary agency on the active challenge of ${present.name}: ${present.practicalReflection}`,
    `Keep your horizon open to the potential ripening of ${future.name}, remembering that your conscious choices today shape tomorrow's reality.`,
  ].join(' ');

  // Thoughtful Reflection Question
  const reflection = `In light of ${present.name} at your present crossroad, what part of your current approach are you ready to engage with greater honesty, courage, or quiet discernment?`;

  const disclaimer = `Tarot readings are intended for self-reflection, mindfulness, and philosophical inquiry. They do not constitute guaranteed predictions or medical, legal, or professional advice.`;

  return {
    readingId: generateReadingId(),
    timestamp: new Date().toISOString(),
    question: question.trim() || `Guidance on ${topicMeta.label}`,
    topic,
    topicLabel: topicMeta.label,
    spreadId: 'three_card',
    spreadName: 'Three-Card Spread (Past • Present • Future)',
    cards: structuredCards,
    combination,
    overallReading,
    themes,
    guidance,
    reflection,
    disclaimer,
  };
}
