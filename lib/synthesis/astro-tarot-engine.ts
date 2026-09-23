import { ChartData } from '@/types/astrology';
import { TarotReadingSnapshot } from '../tarot/types';
import { AstroAnalysis, TarotAnalysis, CombinedAnalysis, ConvergingTheme, DifferingSignal } from './types';
import { synthesizePlanetaryFacts, synthesizeHouseFacts, SIGN_LORDS } from '../interpretation/fact-synthesizer';
import { evaluateAllYogas } from '../yoga/evaluators';
import { calculatePrecisionVimshottari, resolveActiveDasha } from '../dasha/precision-vimshottari';
import { connectActiveDasha } from '../dasha/dasha-connector';

export interface SynthesisInput {
  chart: ChartData;
  tarotSnapshot: TarotReadingSnapshot;
  birthDate?: Date;
  targetDate?: Date;
  userQuestion?: string;
}

const ELEMENT_OF_SIGN: Record<number, 'fire' | 'earth' | 'air' | 'water'> = {
  0: 'fire',  // Aries
  1: 'earth', // Taurus
  2: 'air',   // Gemini
  3: 'water', // Cancer
  4: 'fire',  // Leo
  5: 'earth', // Virgo
  6: 'air',   // Libra
  7: 'water', // Scorpio
  8: 'fire',  // Sagittarius
  9: 'earth', // Capricorn
  10: 'air',  // Aquarius
  11: 'water',// Pisces
};

/**
 * Step 1: Extract Calculated Astrology Facts
 */
export function extractAstroFacts(
  chart: ChartData,
  birthDate: Date = new Date('1990-01-01T12:00:00Z'),
  targetDate: Date = new Date()
): AstroAnalysis {
  const pFacts = synthesizePlanetaryFacts(chart);
  const ascSignIdx = chart.ascendant.signIndex;
  const lagnaLord = SIGN_LORDS[ascSignIdx];

  const moonFact = pFacts['Moon'];
  const sunFact = pFacts['Sun'];

  // Vimshottari Dasha
  const dashaTimeline = calculatePrecisionVimshottari(birthDate, moonFact?.degree ?? 0);
  const activeDasha = resolveActiveDasha(dashaTimeline, targetDate);
  const connectedDasha = activeDasha ? connectActiveDasha(activeDasha, chart) : null;

  // Yogas
  const yogas = evaluateAllYogas({
    planets: chart.planets,
    ascendantSignIndex: ascSignIdx ?? 0,
    houses: chart.houses,
  });

  // Elemental balance
  const elemBalance = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const p of chart.planets) {
    const sIdx = p.signIndex ?? (p.rashiNumber ? p.rashiNumber - 1 : 0);
    const elem = ELEMENT_OF_SIGN[sIdx];
    if (elem) elemBalance[elem]++;
  }

  // Strengths and growth edges
  const keyStrengths: string[] = [];
  const growthEdges: string[] = [];

  for (const p of Object.values(pFacts)) {
    if (p.isExalted || p.isOwnSign || p.isVargottama) {
      keyStrengths.push(`${p.planet} in ${p.sign} (${p.dignity}${p.isVargottama ? ', Vargottama' : ''})`);
    } else if (p.isDebilitated || p.isCombust) {
      growthEdges.push(`${p.planet} in ${p.sign} (${p.dignity}${p.isCombust ? ', Combust' : ''})`);
    }
  }

  return {
    lagnaSign: chart.ascendant.sign,
    lagnaLord,
    moonSign: moonFact?.sign || 'Aries',
    moonNakshatra: `${moonFact?.nakshatra || ''} (Lord: ${moonFact?.nakshatraLord || ''})`,
    sunSign: sunFact?.sign || 'Aries',
    activeDasha: {
      mahadasha: activeDasha?.mahadasha.planet || 'Sun',
      antardasha: activeDasha?.antardasha.planet || 'Sun',
      pratyantardasha: activeDasha?.pratyantardasha.planet || 'Sun',
      progressPercent: activeDasha?.mdProgressPercent || 0,
      operatingHouses: connectedDasha?.mdLordConnection.d1.houseLordOf || [1],
    },
    dominantYogas: yogas.slice(0, 3).map(y => y.name),
    keyPlanetaryStrengths: keyStrengths.slice(0, 4),
    activeGrowthEdges: growthEdges.slice(0, 4),
    elementalBalance: elemBalance,
  };
}

/**
 * Step 2: Extract Tarot Facts
 */
export function extractTarotFacts(snapshot: TarotReadingSnapshot): TarotAnalysis {
  let majorCount = 0;
  let minorCount = 0;
  let reversedCount = 0;
  const suitCounts: Record<string, number> = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
  const elemBalance = { fire: 0, water: 0, air: 0, earth: 0, spirit: 0 };

  const keyArchetypes = snapshot.cards.map(c => {
    if (c.card.arcana === 'major') {
      majorCount++;
      elemBalance.spirit++;
    } else {
      minorCount++;
      if (c.card.suit) {
        suitCounts[c.card.suit] = (suitCounts[c.card.suit] || 0) + 1;
        if (c.card.suit === 'wands') elemBalance.fire++;
        else if (c.card.suit === 'cups') elemBalance.water++;
        else if (c.card.suit === 'swords') elemBalance.air++;
        else if (c.card.suit === 'pentacles') elemBalance.earth++;
      }
    }

    if (c.isReversed) reversedCount++;

    return {
      cardName: c.card.name,
      isReversed: c.isReversed,
      position: c.positionName,
      coreKeyword: c.isReversed ? c.card.reversedKeywords[0] : c.card.uprightKeywords[0],
      element: c.card.element,
    };
  });

  // Find dominant suit
  let dominantSuit: string | undefined = undefined;
  let maxSuitCount = 0;
  for (const [suit, cnt] of Object.entries(suitCounts)) {
    if (cnt > maxSuitCount) {
      maxSuitCount = cnt;
      dominantSuit = suit;
    }
  }

  return {
    spreadId: snapshot.spreadId,
    spreadName: snapshot.spreadName,
    totalCards: snapshot.cards.length,
    majorArcanaCount: majorCount,
    minorArcanaCount: minorCount,
    reversedCount,
    dominantSuit: maxSuitCount > 0 ? dominantSuit : undefined,
    elementalBalance: elemBalance,
    keyArchetypes,
  };
}

/**
 * Steps 3, 4, 5, 6: Synthesize Themes & Assemble Combined Analysis
 */
export function generateAstroTarotSynthesis(input: SynthesisInput): CombinedAnalysis {
  const {
    chart,
    tarotSnapshot,
    birthDate = new Date('1990-01-01T12:00:00Z'),
    targetDate = new Date(),
    userQuestion = tarotSnapshot.userQuestion || 'Life Direction & Strategic Harmony',
  } = input;

  // 1. Extract facts
  const astro = extractAstroFacts(chart, birthDate, targetDate);
  const tarot = extractTarotFacts(tarotSnapshot);

  // 2. Identify Converging Themes
  const convergingThemes: ConvergingTheme[] = [];

  // Theme A: Major Arcana / Life Dharma
  if (tarot.majorArcanaCount >= 2) {
    convergingThemes.push({
      theme: 'Pivotal Karmic Crucible (Major Evolutionary Transition)',
      astroEvidence: `Nativity anchored by ${astro.lagnaSign} Lagna, with active ${astro.activeDasha.mahadasha} Mahadasha activating foundational life structures.`,
      tarotEvidence: `${tarot.majorArcanaCount} Major Arcana keys drawn (${tarot.keyArchetypes.filter(a => a.element.includes('Spirit') || a.element.includes('Fire')).map(a => a.cardName).join(', ') || 'High archetypal presence'}).`,
      explanation: 'Both systems indicate that current inquiries transcend daily logistical minutiae; they touch the fundamental architecture of soul purpose, character refinement, and long-term trajectory.',
    });
  }

  // Theme B: Dasha Lord resonance with Tarot Suits
  const mdLord = astro.activeDasha.mahadasha;
  if (['Mars', 'Sun'].includes(mdLord) && (tarot.elementalBalance.fire >= 1 || tarot.dominantSuit === 'wands')) {
    convergingThemes.push({
      theme: 'Dynamic Initiative & Sovereign Will (Agni Principle)',
      astroEvidence: `Active ${mdLord} Mahadasha igniting vital energy and outward initiative.`,
      tarotEvidence: `Prominence of Fire / Wands energy (${tarot.elementalBalance.fire} cards), prioritizing purposeful action.`,
      explanation: 'Solar and Martian planetary rhythms find an exact echo in the Tarot’s Suit of Wands, demanding courage, sovereign integrity, and decisive stewardship of personal energy.',
    });
  } else if (['Moon', 'Venus'].includes(mdLord) && (tarot.elementalBalance.water >= 1 || tarot.dominantSuit === 'cups')) {
    convergingThemes.push({
      theme: 'Emotional Sanctuary & Relational Cultivation (Jala Principle)',
      astroEvidence: `Active ${mdLord} Mahadasha centering receptivity, heart-centered bonding, and emotional coherence.`,
      tarotEvidence: `Prominence of Water / Cups energy (${tarot.elementalBalance.water} cards), reflecting internal depth and psychological attunement.`,
      explanation: 'Luminaries and aesthetic planetary rulers converge with the Cups suit to illuminate relational depth, empathy, and intuitive discernment.',
    });
  } else if (['Mercury', 'Saturn'].includes(mdLord) && (tarot.elementalBalance.earth >= 1 || tarot.dominantSuit === 'pentacles')) {
    convergingThemes.push({
      theme: 'Disciplined Execution & Tangible Grounding (Prithvi Principle)',
      astroEvidence: `Active ${mdLord} Mahadasha emphasizing structural discipline, long-term asset security, and persistent endeavor.`,
      tarotEvidence: `Prominence of Earth / Pentacles energy (${tarot.elementalBalance.earth} cards), prioritizing material reality and steady craftsmanship.`,
      explanation: 'Saturnian/Mercurial planetary precision mirrors Pentacles pragmatism, reinforcing the wisdom of measured, patient compounding.',
    });
  } else {
    // General synthesis fallback
    convergingThemes.push({
      theme: 'Harmonic Alignment of Time & Archetype',
      astroEvidence: `Operating under ${astro.activeDasha.mahadasha}-${astro.activeDasha.antardasha} Dasha with ${astro.lagnaSign} Ascendant.`,
      tarotEvidence: `Spread led by ${tarot.keyArchetypes[0]?.cardName || 'Primary Key'}${tarot.keyArchetypes[0]?.isReversed ? ' (Reversed)' : ''} in the ${tarot.keyArchetypes[0]?.position || 'central'} position.`,
      explanation: 'The macrocosmic planetary cycle and the microcosmic synchronistic draw align to guide focused reflection upon the question at hand.',
    });
  }

  // 3. Identify Differing Signals (Contrasting perspectives)
  const differentSignals: DifferingSignal[] = [];

  if (tarot.reversedCount >= 2) {
    differentSignals.push({
      dimension: 'Pacing & Internal vs External Manifestation',
      astroIndication: `Astrological chart reveals continuous forward momentum under ${astro.activeDasha.mahadasha} Mahadasha.`,
      tarotIndication: `Multiple reversed cards (${tarot.reversedCount} reversed) suggest internal reflection, paused momentum, or unexpressed psychological tensions.`,
      synthesis: 'While outer astrological currents support progression, Tarot highlights the necessity of resolving inner hesitations before initiating sweeping external changes.',
    });
  }

  if (astro.activeGrowthEdges.length > 0) {
    differentSignals.push({
      dimension: 'Growth Crucible vs Immediate Opportunity',
      astroIndication: `Natal growth edges active in: ${astro.activeGrowthEdges.join('; ')}.`,
      tarotIndication: `Tarot provides situational keys: ${tarot.keyArchetypes.map(a => a.cardName).slice(0, 2).join(', ')}.`,
      synthesis: 'Acknowledge constitutional planetary vulnerabilities not as permanent barriers, but as conscious filters through which the Tarot’s guidance is pragmatically applied.',
    });
  }

  // 4. Synthesize Astrological Factors & Tarot Factors lists
  const astroFactors = [
    `Nativity Ascendant: ${astro.lagnaSign} (Ruled by ${astro.lagnaLord})`,
    `Janma Rashi (Moon): ${astro.moonSign} in ${astro.moonNakshatra}`,
    `Surya Rashi (Sun): ${astro.sunSign}`,
    `Operating Vimshottari Cycle: ${astro.activeDasha.mahadasha} Mahadasha / ${astro.activeDasha.antardasha} Antardasha (${astro.activeDasha.progressPercent}% elapsed)`,
    ...(astro.dominantYogas.length > 0 ? [`Dominant Yogas: ${astro.dominantYogas.join(', ')}`] : []),
  ];

  const tarotFactors = [
    `Spread: ${tarot.spreadName} (${tarot.totalCards} cards drawn)`,
    `Arcana Distribution: ${tarot.majorArcanaCount} Major Arcana, ${tarot.minorArcanaCount} Minor Arcana`,
    `Orientation: ${tarot.totalCards - tarot.reversedCount} Upright, ${tarot.reversedCount} Reversed`,
    `Dominant Energy: ${tarot.dominantSuit ? `Suit of ${tarot.dominantSuit}` : 'Balanced Archetypal Distribution'}`,
    `Lead Card: ${tarot.keyArchetypes[0]?.cardName || 'Primary Key'} (${tarot.keyArchetypes[0]?.position || 'Focal'})`,
  ];

  // 5. Practical Reflection & Questions
  const practicalReflection = [
    `Respect both the overarching temporal season (${astro.activeDasha.mahadasha} Dasha) and the immediate psychological mirror presented by ${tarot.keyArchetypes[0]?.cardName || 'the lead card'}.`,
    `Ground abstract aspirations into concrete rituals or strategic actions aligned with your ${astro.lagnaSign} constitution.`,
    `Maintain emotional equanimity: Divinatory instruments provide symbolic lenses for self-inquiry, not immutable decrees.`,
  ];

  const questionsForReflection = [
    `Where in your current life is the energy of ${astro.activeDasha.mahadasha} asking for greater maturity, discipline, or courageous truth?`,
    `How does the archetype of ${tarot.keyArchetypes[0]?.cardName || 'the primary card'} reflect an unconscious pattern or budding opportunity in your situation?`,
    `What deliberate boundary or creative commitment can you establish this week to bring these insights into embodied reality?`,
  ];

  const overallTheme = `Convergence of ${astro.activeDasha.mahadasha} Planetary Season with the ${tarot.keyArchetypes[0]?.cardName || 'Archetypal'} Oracle`;

  return {
    synthesisId: `syn_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userQuestion,
    overallTheme,
    astrologicalFactors: astroFactors,
    tarotFactors,
    convergingThemes,
    differentSignals,
    practicalReflection,
    questionsForReflection,
    astroAnalysis: astro,
    tarotAnalysis: tarot,
    epistemicDemarcation: {
      calculatedFactCount: astroFactors.length,
      symbolicResonanceCount: tarotFactors.length,
      statement: 'Astrological coordinates represent deterministic astronomical facts. Tarot draws represent synchronistic archetypal reflections. Combined synthesis is an interpretive aid for contemplation and conscious agency.',
    },
  };
}
