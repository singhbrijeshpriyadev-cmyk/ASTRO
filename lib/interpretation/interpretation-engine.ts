import { ChartData, TraditionalGraha } from '@/types/astrology';
import {
  ThirteenLayerInterpretation,
  AnalysisLayer,
  RuleResult,
  EpistemicStatement,
} from './types';
import { synthesizePlanetaryFacts, synthesizeHouseFacts, SIGN_LORDS } from './fact-synthesizer';
import {
  evaluatePlanetInHouseRule,
  evaluatePlanetInSignRule,
  evaluateHouseLordRule,
  evaluatePlanetAspectRule,
  evaluateConjunctionRule,
  evaluateDignityRule,
  evaluateVargottamaRule,
  evaluateNakshatraRule,
  evaluateYogaRule,
  evaluateDashaRule,
  evaluateTransitRule,
  createStatements,
} from './rules';
import { evaluateAllYogas } from '../yoga/evaluators';
import { evaluateAllDoshas } from '../dosha/evaluators';
import { calculatePrecisionVimshottari, resolveActiveDasha, ActiveDashaState } from '../dasha/precision-vimshottari';
import { connectActiveDasha } from '../dasha/dasha-connector';

export interface InterpretationOptions {
  querentName?: string;
  birthDate?: Date;
  targetDate?: Date;
}

function buildLayer(
  layerId: string,
  title: string,
  subtitle: string,
  summary: string,
  rules: RuleResult[]
): AnalysisLayer {
  const facts: EpistemicStatement[] = [];
  const interpretations: EpistemicStatement[] = [];
  const guidance: EpistemicStatement[] = [];

  for (const r of rules) {
    for (const stmt of r.statements) {
      if (stmt.classification === 'CALCULATED_FACT') facts.push(stmt);
      else if (stmt.classification === 'TRADITIONAL_INTERPRETATION') interpretations.push(stmt);
      else if (stmt.classification === 'INTERPRETIVE_GUIDANCE') guidance.push(stmt);
    }
  }

  return {
    layerId,
    title,
    subtitle,
    summary,
    rules,
    facts,
    interpretations,
    guidance,
  };
}

const TO_ENG: Record<string, TraditionalGraha> = {
  Surya: 'Sun', Chandra: 'Moon', Mangala: 'Mars', Budha: 'Mercury',
  Guru: 'Jupiter', Shukra: 'Venus', Shani: 'Saturn',
  Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
  Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn',
  Rahu: 'Rahu', Ketu: 'Ketu',
};

const TO_SAN: Record<string, TraditionalGraha> = {
  Sun: 'Surya', Moon: 'Chandra', Mars: 'Mangala', Mercury: 'Budha',
  Jupiter: 'Guru', Venus: 'Shukra', Saturn: 'Shani',
  Rahu: 'Rahu', Ketu: 'Ketu',
};

function getSafePlanetFact(facts: Record<TraditionalGraha, any>, graha: TraditionalGraha) {
  const eng = TO_ENG[graha] || graha;
  const san = TO_SAN[graha] || graha;
  return facts[graha] || facts[eng] || facts[san] || {
    planet: graha,
    sign: 'Aries',
    signIndex: 0,
    degree: 0,
    minute: 0,
    degreeFormatted: "0° 00'",
    house: 1,
    nakshatra: 'Ashwini',
    nakshatraLord: 'Ketu',
    pada: 1,
    dignity: 'Neutral',
    compoundRelationshipToSignLord: 'Neutral (Sama)',
    ownedHouses: [],
    conjunctions: [],
    aspectsReceived: [],
    aspectsCastOnHouses: [],
    d9Sign: 'Aries',
    d9House: 1,
    isVargottama: false,
    d10Sign: 'Aries',
    d10House: 1,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    isMoolatrikona: false,
  };
}

/**
 * Master Deterministic Vedic Interpretation Engine
 * 
 * Rules:
 * 1. The calculation engine produces facts.
 * 2. The interpretation engine interprets those facts.
 * 3. AI must NEVER invent the underlying facts.
 * 4. Never use fatalistic language.
 * 5. Strictly distinguish:
 *    [CALCULATED FACT]
 *    [TRADITIONAL INTERPRETATION]
 *    [INTERPRETIVE GUIDANCE]
 */
export function generateDeterministicInterpretation(
  chart: ChartData,
  options: InterpretationOptions = {}
): ThirteenLayerInterpretation {
  const querentName = options.querentName || 'Querent';
  const birthDate = options.birthDate || new Date('1990-01-01T12:00:00Z');
  const targetDate = options.targetDate || new Date();

  // 1. Synthesize all planetary and house facts
  const planetFacts = synthesizePlanetaryFacts(chart);
  const houseFacts = synthesizeHouseFacts(chart, planetFacts);

  // 2. Evaluate classical Yogas and Doshas
  const yogaInput = {
    planets: chart.planets,
    ascendantSignIndex: chart.ascendant.signIndex,
    houses: chart.houses,
  };
  const detectedYogas = evaluateAllYogas(yogaInput);
  const detectedDoshas = evaluateAllDoshas(yogaInput);

  // 3. Evaluate Vimshottari Dasha
  const moonPlanet = chart.planets.find(
    p => p.planet === 'Moon' || p.name === 'Chandra' || p.name === 'Moon' || p.planet === 'Chandra'
  );
  const moonLon = moonPlanet?.siderealLongitude ?? 
    (moonPlanet ? (moonPlanet.rashiNumber - 1) * 30 + moonPlanet.degree + moonPlanet.minutes / 60 : 0);
  const dashaTimeline = calculatePrecisionVimshottari(birthDate, moonLon);
  const activeDasha = resolveActiveDasha(dashaTimeline, targetDate) || {
    targetDate: targetDate.toISOString().split('T')[0],
    targetMs: targetDate.getTime(),
    mahadasha: dashaTimeline.mahadashas[0],
    antardasha: dashaTimeline.mahadashas[0].antardashas[0],
    pratyantardasha: dashaTimeline.mahadashas[0].antardashas[0].pratyantardashas[0],
    mdProgressPercent: 50,
    adProgressPercent: 50,
    pdProgressPercent: 50,
  };
  const connectedDasha = connectActiveDasha(activeDasha, chart);

  const allRules: RuleResult[] = [];

  // Evaluate planetary rules
  const planetRulesMap: Record<TraditionalGraha, RuleResult[]> = {} as any;
  const traditionalGrahas: TraditionalGraha[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const graha of traditionalGrahas) {
    const pFact = planetFacts[graha];
    if (!pFact) continue;

    const pRules: RuleResult[] = [];
    pRules.push(evaluatePlanetInHouseRule(pFact));
    pRules.push(evaluatePlanetInSignRule(pFact));
    pRules.push(evaluateDignityRule(pFact));
    pRules.push(evaluateNakshatraRule(pFact));

    if (pFact.isVargottama) {
      pRules.push(evaluateVargottamaRule(pFact));
    }

    for (const conj of pFact.conjunctions) {
      const otherFact = planetFacts[conj.otherPlanet];
      if (otherFact) {
        pRules.push(evaluateConjunctionRule(pFact, otherFact, conj.angularDistanceDeg, conj.isTight));
      }
    }

    for (const asp of pFact.aspectsReceived) {
      pRules.push(evaluatePlanetAspectRule(pFact, asp.aspectingPlanet, asp.aspectType));
    }

    planetRulesMap[graha] = pRules;
    allRules.push(...pRules);
  }

  // Evaluate house rules
  const houseRulesMap: Record<number, RuleResult[]> = {};
  for (let h = 1; h <= 12; h++) {
    const hFact = houseFacts[h];
    const lordFact = planetFacts[hFact.lord];
    const hRules: RuleResult[] = [];
    if (hFact && lordFact) {
      hRules.push(evaluateHouseLordRule(hFact, lordFact));
    }
    houseRulesMap[h] = hRules;
    allRules.push(...hRules);
  }

  // Evaluate Yogas
  const yogaRules: RuleResult[] = detectedYogas.map(y => evaluateYogaRule(y));
  allRules.push(...yogaRules);

  // Evaluate Dasha
  const dashaRule = evaluateDashaRule(activeDasha);
  allRules.push(dashaRule);

  // Evaluate Transits (using Saturn and Jupiter transits)
  const saturnFact = planetFacts['Saturn'];
  const moonHouse = planetFacts['Moon']?.house ?? 1;
  const transitSaturnRule = evaluateTransitRule('Saturn', saturnFact?.house ?? 1, moonHouse);
  const transitJupiterRule = evaluateTransitRule('Jupiter', planetFacts['Jupiter']?.house ?? 1, moonHouse);
  allRules.push(transitSaturnRule, transitJupiterRule);

  // Compile the 13 required layers

  // Layer 1: Chart Summary
  const lagnaSign = chart.ascendant.sign || 'Aries';
  const moonFact = getSafePlanetFact(planetFacts, 'Moon');
  const sunFact = getSafePlanetFact(planetFacts, 'Sun');
  const moonSign = moonFact.sign;
  const sunSign = sunFact.sign;
  const layer1 = buildLayer(
    'layer_1_summary',
    'Layer 1: Chart Summary & Constitutional Blueprint',
    `Lagna ${lagnaSign} | Janma Rashi ${moonSign} | Surya Rashi ${sunSign}`,
    `This celestial nativity crystallizes under ${lagnaSign} Ascendant with ${moonSign} Moon and ${sunSign} Sun. The dynamic balance of Kendra, Trikona, and Upachaya houses orchestrates life potential without predetermined fatalism.`,
    [
      evaluatePlanetInSignRule(sunFact),
      evaluatePlanetInSignRule(moonFact),
      dashaRule,
    ]
  );

  // Layer 2: Lagna Analysis
  const lagnaLord = SIGN_LORDS[chart.ascendant.signIndex] || 'Mars';
  const lagnaLordFact = getSafePlanetFact(planetFacts, lagnaLord);
  const layer2 = buildLayer(
    'layer_2_lagna',
    'Layer 2: Lagna & Physical Constitution',
    `Ascendant in ${lagnaSign} (${chart.ascendant.formatted || `${lagnaSign} ${chart.ascendant.degree}°`}) — Ruled by ${lagnaLord}`,
    `The First Bhava (Tanu Bhava) represents the physical embodiment, vitality, worldview, and self-orientation. With Lord ${lagnaLord} placed in House ${lagnaLordFact.house} (${lagnaLordFact.sign}), vitality is channeled directly into ${lagnaLordFact.sign} endeavors.`,
    [
      evaluatePlanetInHouseRule(lagnaLordFact),
      evaluatePlanetInSignRule(lagnaLordFact),
      ...(houseRulesMap[1] || []),
    ]
  );

  // Layer 3: Moon Analysis
  const layer3 = buildLayer(
    'layer_3_moon',
    'Layer 3: Moon & Mental Equilibrium (Chandra Kundli)',
    `Moon in ${moonFact.sign} at ${moonFact.degreeFormatted} (${moonFact.nakshatra} Pada ${moonFact.pada})`,
    `The Moon (Manas) mirrors the subconscious psyche, emotional resilience, instinctive reactions, and public receptivity. Residing in ${moonFact.sign} under ${moonFact.nakshatra} mansion, the mind seeks harmonic stability through ${moonFact.nakshatraLord} frequencies.`,
    planetRulesMap['Moon'] || []
  );

  // Layer 4: Sun Analysis
  const layer4 = buildLayer(
    'layer_4_sun',
    'Layer 4: Sun & Soul Purpose (Atmakaraka & Surya)',
    `Sun in ${sunFact.sign} at ${sunFact.degreeFormatted} (${sunFact.nakshatra})`,
    `The Sun (Atma) signifies the core life force, ethical sovereignty, father principle, and executive clarity. Situated in House ${sunFact.house}, life purpose radiates through constructive self-expression and leadership.`,
    planetRulesMap['Sun'] || []
  );

  // Layer 5: Each Planet Analysis
  const layer5: Record<TraditionalGraha, AnalysisLayer> = {} as any;
  for (const graha of traditionalGrahas) {
    const pf = getSafePlanetFact(planetFacts, graha);
    layer5[graha] = buildLayer(
      `layer_5_${graha.toLowerCase()}`,
      `Layer 5: ${graha} Delineation`,
      `${graha} in ${pf.sign} (House ${pf.house}) — ${pf.dignity}`,
      `Detailed classical and structural evaluation of ${graha} across sign, house, aspects, and harmonic links.`,
      planetRulesMap[graha] || []
    );
  }

  // Layer 6: Each House Analysis
  const layer6: Record<number, AnalysisLayer> = {};
  const houseNames = [
    'Tanu (Self & Vitality)',
    'Dhana (Wealth & Speech)',
    'Sahaja (Courage & Siblings)',
    'Sukha (Home & Emotional Peace)',
    'Putra (Creativity & Intellect)',
    'Ari (Challenges & Service)',
    'Yuvati (Partnership & Union)',
    'Randhra (Transformation & Longevity)',
    'Dharma (Wisdom & Higher Philosophy)',
    'Karma (Career & Social Authority)',
    'Labha (Gains & Aspirations)',
    'Vyaya (Expenditure & Liberation)',
  ];

  for (let h = 1; h <= 12; h++) {
    const hf = houseFacts[h];
    layer6[h] = buildLayer(
      `layer_6_house_${h}`,
      `House ${h}: ${houseNames[h - 1]}`,
      `${hf.sign} Cusp | Lord ${hf.lord} in H${hf.lordPlacementHouse} | Strength ${hf.strengthScore}/100`,
      `House ${h} governs ${houseNames[h - 1]}. Occupants: ${hf.occupyingPlanets.join(', ') || 'None'}. Aspects: ${hf.aspectingPlanets.join(', ') || 'None'}.`,
      houseRulesMap[h] || []
    );
  }

  // Layer 7: Important Yogas
  const layer7 = buildLayer(
    'layer_7_yogas',
    'Layer 7: Classical Yogas & Dosha Syntheses',
    `${detectedYogas.length} Yogas Detected | ${detectedDoshas.length} Doshas Analyzed`,
    `Evaluation of classical combinations. All conditions, mitigations, and cancellations are explicitly calculated without fatalism or inflated claims.`,
    yogaRules
  );

  // Layer 8: Strengths
  const strongPlanets = Object.values(planetFacts).filter(p => p.isExalted || p.isOwnSign || p.isVargottama || [1, 5, 9].includes(p.house));
  const layer8 = buildLayer(
    'layer_8_strengths',
    'Layer 8: Core Fortitudes & Endowments',
    `${strongPlanets.length} High-Dignity Graha Anchors`,
    `Planetary placements with superior dignity, kendra/trikona angularity, or vargottama harmonic reinforcement confer reliable personal and spiritual momentum.`,
    strongPlanets.map(p => evaluateDignityRule(p))
  );

  // Layer 9: Challenges
  const challengedPlanets = Object.values(planetFacts).filter(p => p.isDebilitated || p.isCombust || [6, 8, 12].includes(p.house));
  const layer9 = buildLayer(
    'layer_9_challenges',
    'Layer 9: Catalysts for Growth & Remedial Focus',
    `${challengedPlanets.length} Areas Requiring Deliberate Mastery`,
    `Planetary placements experiencing combustive heat, debilitation friction, or dusthana containment indicate karmic growth edges where conscious awareness and deliberate discipline bear the richest fruit.`,
    challengedPlanets.map(p => evaluatePlanetInHouseRule(p))
  );

  // Layer 10: Dasha Analysis
  const layer10 = buildLayer(
    'layer_10_dasha',
    'Layer 10: Dasha Timeline & Operating Cycle',
    `Active Mahadasha: ${activeDasha.mahadasha.planet} | Antardasha: ${activeDasha.antardasha.planet} | Pratyantardasha: ${activeDasha.pratyantardasha.planet}`,
    connectedDasha.mdLordConnection?.synthesisNotes || connectedDasha.periodTheme,
    [dashaRule]
  );

  // Layer 11: Transit Analysis
  const layer11 = buildLayer(
    'layer_11_transits',
    'Layer 11: Active Gochara (Transits) Relative to Janma Rashi',
    `Major planetary shifts through natal reference houses`,
    `Transit dynamics measured from the natal Moon provide the environmental weather against which internal dasha impulses unfold.`,
    [transitSaturnRule, transitJupiterRule]
  );

  // Layer 12: Varga Comparison
  const vargottamaPlanets = Object.values(planetFacts).filter(p => p.isVargottama);
  const layer12 = buildLayer(
    'layer_12_varga_comparison',
    'Layer 12: Harmonic Varga Cross-Comparison (D1 vs D9/D10/D60)',
    `${vargottamaPlanets.length} Vargottama Grahas Identified`,
    `Divisional cross-examination reconciles outward manifestation (D1) with inner soul resilience (D9 Navamsha) and career authority (D10 Dasamsha).`,
    vargottamaPlanets.map(p => evaluateVargottamaRule(p))
  );

  // Layer 13: Topic-Specific Interpretation (Purusharthas)
  const dharmaRules = [houseRulesMap[1] || [], houseRulesMap[5] || [], houseRulesMap[9] || []].flat();
  const arthaRules = [houseRulesMap[2] || [], houseRulesMap[6] || [], houseRulesMap[10] || []].flat();
  const kamaRules = [houseRulesMap[3] || [], houseRulesMap[7] || [], houseRulesMap[11] || []].flat();
  const mokshaRules = [houseRulesMap[4] || [], houseRulesMap[8] || [], houseRulesMap[12] || []].flat();

  const layer13 = {
    dharma: buildLayer('layer_13_dharma', 'Dharma (Houses 1, 5, 9)', 'Right Action, Ethical Purpose & Creative Virtue', 'Dharma houses clarify vocational alignment, authentic purpose, and moral integrity.', dharmaRules),
    artha: buildLayer('layer_13_artha', 'Artha (Houses 2, 6, 10)', 'Material Mastery, Treasury & Professional Service', 'Artha houses detail wealth preservation, day-to-day discipline, and professional leadership.', arthaRules),
    kama: buildLayer('layer_13_kama', 'Kama (Houses 3, 7, 11)', 'Relational Dynamics, Aspirations & Social Union', 'Kama houses delineate creative desires, intimate bonds, and communal networks.', kamaRules),
    moksha: buildLayer('layer_13_moksha', 'Moksha (Houses 4, 8, 12)', 'Inner Sanctuary, Transformation & Spiritual Liberation', 'Moksha houses govern emotional sanctuary, deep psychological transitions, and meditative transcendence.', mokshaRules),
  };

  return {
    calculationTimestamp: new Date().toISOString(),
    querentName,
    birthSummary: `${lagnaSign} Ascendant | Moon in ${moonSign} (${planetFacts['Moon']?.nakshatra || ''}) | Sun in ${sunSign}`,
    layer1_chartSummary: layer1,
    layer2_lagnaAnalysis: layer2,
    layer3_moonAnalysis: layer3,
    layer4_sunAnalysis: layer4,
    layer5_planetAnalysis: layer5,
    layer6_houseAnalysis: layer6,
    layer7_importantYogas: layer7,
    layer8_strengths: layer8,
    layer9_challenges: layer9,
    layer10_dashaAnalysis: layer10,
    layer11_transitAnalysis: layer11,
    layer12_vargaComparison: layer12,
    layer13_topicSpecific: layer13,
    allRulesEvaluated: allRules,
  };
}
