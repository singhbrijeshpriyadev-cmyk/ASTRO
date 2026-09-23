import { TraditionalGraha } from '@/types/astrology';
import { PlanetSynthesisFact, HouseSynthesisFact, RuleResult, EpistemicStatement } from './types';
import { DetectedYoga } from '../yoga/types';
import { ActiveDashaState } from '../dasha/precision-vimshottari';

/**
 * Creates structured epistemic triad statements
 */
export function createStatements(fact: string, tradInterp: string, guidanceText: string): EpistemicStatement[] {
  return [
    {
      classification: 'CALCULATED_FACT',
      tag: '[CALCULATED FACT]',
      text: fact,
    },
    {
      classification: 'TRADITIONAL_INTERPRETATION',
      tag: '[TRADITIONAL INTERPRETATION]',
      text: tradInterp,
    },
    {
      classification: 'INTERPRETIVE_GUIDANCE',
      tag: '[INTERPRETIVE GUIDANCE]',
      text: guidanceText,
    },
  ];
}

// 1. PlanetInHouseRule
export function evaluatePlanetInHouseRule(fact: PlanetSynthesisFact): RuleResult {
  const isFavorableHouse = [1, 4, 5, 7, 9, 10, 11].includes(fact.house);
  const isDusthana = [6, 8, 12].includes(fact.house);

  let severity: RuleResult['severity'] = 'neutral';
  if (isFavorableHouse) severity = fact.isExalted || fact.isOwnSign ? 'very_favorable' : 'favorable';
  else if (isDusthana) severity = 'challenging';

  const evidence = `${fact.planet} occupies House ${fact.house} in ${fact.sign} at ${fact.degreeFormatted}.`;
  const interpretation = `In classical Jyotish, ${fact.planet} positioned in House ${fact.house} channels its core karakas into the activities and themes governed by this bhava. When situated in a Kendra or Trikona, its external expression flourishes with societal and psychological support. In a Trika house (6/8/12), it requires conscious transmutation of tension into resilience, service, or contemplative depth.`;
  const guidance = `Consciously integrate the natural energy of ${fact.planet} into daily endeavors relating to House ${fact.house}. Focus on constructive expression rather than reactive friction.`;

  return {
    ruleId: `PIH_${fact.planet}_H${fact.house}`,
    category: 'planet_in_house',
    severity,
    evidence,
    interpretation,
    guidance,
    confidence: 0.9,
    sourceTradition: 'Brihat Parashara Hora Shastra, Bhava Phala Adhyaya',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 2. PlanetInSignRule
export function evaluatePlanetInSignRule(fact: PlanetSynthesisFact): RuleResult {
  const evidence = `${fact.planet} is situated in ${fact.sign} (${fact.dignity}, relationship to lord: ${fact.compoundRelationshipToSignLord}).`;
  const interpretation = `The sign of ${fact.sign} provides the elemental and psychological filter through which ${fact.planet} operates. Its compound relationship (${fact.compoundRelationshipToSignLord}) reveals the ease of access to the sign’s resources.`;
  const guidance = `Cultivate the elevated virtues of ${fact.sign} while moderating the natural shadow expressions of this archetype.`;

  return {
    ruleId: `PIS_${fact.planet}_${fact.sign}`,
    category: 'planet_in_sign',
    severity: fact.isExalted || fact.isOwnSign ? 'very_favorable' : fact.isDebilitated ? 'challenging' : 'neutral',
    evidence,
    interpretation,
    guidance,
    confidence: 0.88,
    sourceTradition: 'Phaladeepika, Rashi Phala Adhyaya',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 3. HouseLordRule
export function evaluateHouseLordRule(houseFact: HouseSynthesisFact, lordFact: PlanetSynthesisFact): RuleResult {
  const evidence = `House ${houseFact.houseNumber} (${houseFact.sign}) is ruled by ${houseFact.lord}, who is placed in House ${houseFact.lordPlacementHouse} (${houseFact.lordPlacementSign}).`;
  const interpretation = `The lordship link binds House ${houseFact.houseNumber} to House ${houseFact.lordPlacementHouse}. The matters of the ${houseFact.houseNumber}th bhava find fruition and agency through the affairs of the ${houseFact.lordPlacementHouse}th bhava.`;
  const guidance = `To strengthen and harmonize House ${houseFact.houseNumber}, attend to the responsibilities and ethical demands of House ${houseFact.lordPlacementHouse}.`;

  const isFavorable = [1, 4, 5, 7, 9, 10, 11].includes(houseFact.lordPlacementHouse);
  return {
    ruleId: `HLR_H${houseFact.houseNumber}_in_H${houseFact.lordPlacementHouse}`,
    category: 'house_lord',
    severity: isFavorable ? 'favorable' : 'challenging',
    evidence,
    interpretation,
    guidance,
    confidence: 0.85,
    sourceTradition: 'Brihat Parashara Hora Shastra, Bhavesha Phala',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 4. PlanetAspectRule
export function evaluatePlanetAspectRule(
  targetPlanet: PlanetSynthesisFact,
  aspectingPlanet: TraditionalGraha,
  aspectType: string
): RuleResult {
  const evidence = `${aspectingPlanet} casts a full ${aspectType} upon ${targetPlanet.planet} (situated in House ${targetPlanet.house}).`;
  const isBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(aspectingPlanet);
  const interpretation = `The rays (Drishti) of ${aspectingPlanet} imprint upon ${targetPlanet.planet}. In classical doctrine, benefic aspects impart protection, grace, and expansion, while malefic rays demand discipline, endurance, and boundary enforcement.`;
  const guidance = isBenefic
    ? `Utilize the expansive wisdom and ethical clarity of ${aspectingPlanet} to enhance ${targetPlanet.planet}’s potential.`
    : `Apply structured discipline, patience, and vigilance in matters involving ${targetPlanet.planet}.`;

  return {
    ruleId: `ASPECT_${aspectingPlanet}_TO_${targetPlanet.planet}`,
    category: 'planet_aspect',
    severity: isBenefic ? 'favorable' : 'intense',
    evidence,
    interpretation,
    guidance,
    confidence: 0.82,
    sourceTradition: 'Saravali, Graha Drishti Prakarana',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 5. ConjunctionRule
export function evaluateConjunctionRule(
  p1: PlanetSynthesisFact,
  p2: PlanetSynthesisFact,
  orbDeg: number,
  isTight: boolean
): RuleResult {
  const evidence = `${p1.planet} and ${p2.planet} are conjunct in ${p1.sign} (House ${p1.house}) with an angular separation of ${orbDeg}°.${isTight ? ' [Tight orb <= 5°]' : ''}`;
  const interpretation = `When two planetary forces share the same celestial sector, their archetypal significations fuse intimately. This conjunction generates a powerful energetic catalyst, compelling both planets to act in concert across their respective house portfolios.`;
  const guidance = `Harmonize the joint expression of ${p1.planet} and ${p2.planet}. Avoid allowing the dominant planet to overshadow the subtleties of the companion graha.`;

  return {
    ruleId: `CONJ_${p1.planet}_${p2.planet}_H${p1.house}`,
    category: 'conjunction',
    severity: 'neutral',
    evidence,
    interpretation,
    guidance,
    confidence: 0.88,
    sourceTradition: 'Jataka Parijata, Graha Yoga',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 6. DignityRule
export function evaluateDignityRule(fact: PlanetSynthesisFact): RuleResult {
  const evidence = `${fact.planet} holds dignity status: ${fact.dignity} in ${fact.sign} at ${fact.degreeFormatted}.`;
  let interpretation = `${fact.planet} possesses balanced functional dignity.`;
  let severity: RuleResult['severity'] = 'neutral';

  if (fact.isExalted) {
    severity = 'very_favorable';
    interpretation = `${fact.planet} is Exalted (Uccha), standing in its peak celestial potency. Classical authorities celebrate this placement as granting extraordinary confidence, command, and capacity to deliver noble results.`;
  } else if (fact.isDebilitated) {
    severity = 'challenging';
    interpretation = `${fact.planet} is Debilitated (Neecha), where its external ease of manifestation encounters friction. Traditional texts emphasize that conscious effort, humility, and structural cultivation are required to unlock its latent strength.`;
  } else if (fact.isOwnSign || fact.isMoolatrikona) {
    severity = 'very_favorable';
    interpretation = `${fact.planet} resides in its Own Sign (Swakshetra / Moolatrikona), enjoying natural sovereignty, comfort, and independent authority.`;
  }

  const guidance = fact.isDebilitated
    ? `Harness deliberate, patient effort and systematic self-correction to develop the qualities of ${fact.planet}.`
    : `Channel the high vitality of ${fact.planet} into selfless leadership and creative excellence.`;

  return {
    ruleId: `DIGNITY_${fact.planet}_${fact.sign}`,
    category: 'dignity',
    severity,
    evidence,
    interpretation,
    guidance,
    confidence: 0.95,
    sourceTradition: 'Brihat Parashara Hora Shastra, Graha Baladhyaya',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 7. VargottamaRule
export function evaluateVargottamaRule(fact: PlanetSynthesisFact): RuleResult {
  const evidence = `${fact.planet} occupies ${fact.sign} in both D1 Rashi and D9 Navamsha (Vargottama).`;
  const interpretation = `A planet that is Vargottama secures identical sign alignment in both the physical vehicle (D1) and the core soul harmonic (D9). Classical masters state that Vargottama confers an enduring stability, unshakeable convictions, and royal resilience equivalent to own-sign dignity.`;
  const guidance = `Recognize this planet as an innate anchor of authenticity and psychic fortitude during challenging periods.`;

  return {
    ruleId: `VARGOTTAMA_${fact.planet}`,
    category: 'vargottama',
    severity: 'very_favorable',
    evidence,
    interpretation,
    guidance,
    confidence: 0.95,
    sourceTradition: 'Jataka Parijata, Varga Viveka',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 8. NakshatraRule
export function evaluateNakshatraRule(fact: PlanetSynthesisFact): RuleResult {
  const evidence = `${fact.planet} resides in ${fact.nakshatra} (Pada ${fact.pada}), ruled by ${fact.nakshatraLord}.`;
  const interpretation = `The lunar mansion ${fact.nakshatra} provides the mythological ethos, subconscious motivations, and refined karmic wavelength guiding ${fact.planet}’s outer actions.`;
  const guidance = `Meditate on the symbolic motif and presiding deity of ${fact.nakshatra} to align with its deepest creative wisdom.`;

  return {
    ruleId: `NAKSHATRA_${fact.planet}_${fact.nakshatra}`,
    category: 'nakshatra',
    severity: 'neutral',
    evidence,
    interpretation,
    guidance,
    confidence: 0.85,
    sourceTradition: 'Taittiriya Brahmana & Brihat Samhita',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 9. YogaRule
export function evaluateYogaRule(yoga: DetectedYoga): RuleResult {
  const evidence = `Classical combination "${yoga.name}" confirmed. Satisfied conditions: ${yoga.satisfiedConditions.join('; ')}. Strength rating: ${yoga.strength}.`;
  const interpretation = yoga.interpretation;
  const guidance = `Harness the auspicious momentum of this yoga through deliberate intention and righteous conduct (Dharma).`;

  return {
    ruleId: `YOGA_${yoga.name.replace(/\s+/g, '_')}`,
    category: 'yoga',
    severity: yoga.category === 'Raja Yoga' || yoga.category === 'Dhana Yoga' ? 'very_favorable' : 'favorable',
    evidence,
    interpretation,
    guidance,
    confidence: 0.92,
    sourceTradition: yoga.traditionalSource,
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 10. DashaRule
export function evaluateDashaRule(activeDasha: ActiveDashaState): RuleResult {
  const evidence = `Current operational dasha timeline: Mahadasha Lord ${activeDasha.mahadasha.planet} (Progress: ${activeDasha.mdProgressPercent}%), Antardasha Lord ${activeDasha.antardasha.planet} (Progress: ${activeDasha.adProgressPercent}%), Pratyantardasha Lord ${activeDasha.pratyantardasha.planet}.`;
  const interpretation = `The Vimshottari clock highlights ${activeDasha.mahadasha.planet} as the primary architect of current life events, while ${activeDasha.antardasha.planet} dispenses tangible day-to-day circumstances. Their mutual relationship determines whether this period feels effortlessly expansive or character-testing.`;
  const guidance = `Align priorities with the domains activated by both dasha rulers. What is planted under ${activeDasha.mahadasha.planet} reaches culmination in subsequent sub-cycles.`;

  return {
    ruleId: `DASHA_${activeDasha.mahadasha.planet}_${activeDasha.antardasha.planet}`,
    category: 'dasha',
    severity: 'neutral',
    evidence,
    interpretation,
    guidance,
    confidence: 0.94,
    sourceTradition: 'Brihat Parashara Hora Shastra, Vimshottari Phala Adhyaya',
    statements: createStatements(evidence, interpretation, guidance),
  };
}

// 11. TransitRule
export function evaluateTransitRule(planet: TraditionalGraha, transitHouse: number, natalMoonHouse: number): RuleResult {
  const houseFromMoon = ((transitHouse - natalMoonHouse + 12) % 12) + 1;
  const evidence = `Gochar (Transit): ${planet} transits natal House ${transitHouse} (${houseFromMoon}th house from Moon).`;
  const isFavorableFromMoon = [3, 6, 10, 11].includes(houseFromMoon);
  const interpretation = `Classical Gochara principles emphasize planetary transits measured from the natal Moon (Chandra Lagna). ${planet} currently activates the ${houseFromMoon}th sector from the emotional core.`;
  const guidance = isFavorableFromMoon
    ? `Take advantage of favorable environmental currents and societal cooperation.`
    : `Maintain internal equilibrium and prudence; focus on foundational consolidation.`;

  return {
    ruleId: `TRANSIT_${planet}_H${transitHouse}`,
    category: 'transit',
    severity: isFavorableFromMoon ? 'favorable' : 'challenging',
    evidence,
    interpretation,
    guidance,
    confidence: 0.8,
    sourceTradition: 'Phaladeepika, Gochara Phala Adhyaya',
    statements: createStatements(evidence, interpretation, guidance),
  };
}
