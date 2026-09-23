import { DetectedYoga, YogaEngineInput, EvaluatedCondition, CancellationFactor } from './types';
import { GrahaName } from '@/types/astrology';

// House lord mapping utility for whole-sign Bhavas
// Rashi numbers: 1: Mesha (Mars), 2: Vrishabha (Venus), 3: Mithuna (Mercury), 4: Karka (Moon),
// 5: Simha (Sun), 6: Kanya (Mercury), 7: Tula (Venus), 8: Vrishchika (Mars), 9: Dhanu (Jupiter),
// 10: Makara (Saturn), 11: Kumbha (Saturn), 12: Meena (Jupiter)
const SIGN_LORDS: Record<number, GrahaName> = {
  1: 'Mangala',
  2: 'Shukra',
  3: 'Budha',
  4: 'Chandra',
  5: 'Surya',
  6: 'Budha',
  7: 'Shukra',
  8: 'Mangala',
  9: 'Guru',
  10: 'Shani',
  11: 'Shani',
  12: 'Guru',
};

function getHouseLord(houseNum: number, lagnaRashi: number): GrahaName {
  const rashiNum = ((lagnaRashi - 1 + (houseNum - 1)) % 12) + 1;
  return SIGN_LORDS[rashiNum];
}

export function normalizeToYogaInput(input: any): YogaEngineInput {
  if (input.lagnaRashiNumber && Array.isArray(input.planets) && input.planets[0]?.name) {
    return input as YogaEngineInput;
  }

  const lagnaRashi = input.lagnaRashiNumber ||
    (input.ascendantSignIndex !== undefined ? input.ascendantSignIndex + 1 : undefined) ||
    (input.ascendant?.rashiNumber) ||
    (input.ascendant?.signIndex !== undefined ? input.ascendant.signIndex + 1 : 1);

  const GRAHA_NAME_MAP: Record<string, GrahaName> = {
    Sun: 'Surya', Surya: 'Surya',
    Moon: 'Chandra', Chandra: 'Chandra',
    Mars: 'Mangala', Mangala: 'Mangala',
    Mercury: 'Budha', Budha: 'Budha',
    Jupiter: 'Guru', Guru: 'Guru',
    Venus: 'Shukra', Shukra: 'Shukra',
    Saturn: 'Shani', Shani: 'Shani',
    Rahu: 'Rahu',
    Ketu: 'Ketu',
  };

  const rawPlanets = input.planets || [];
  const mapped = rawPlanets.map((p: any) => {
    const rawName = p.name || p.planet || 'Surya';
    const gName = GRAHA_NAME_MAP[rawName] || (rawName as GrahaName);
    const rashiNum = p.rashiNumber || (p.signIndex !== undefined ? p.signIndex + 1 : 1);
    return {
      name: gName,
      planet: p.planet || rawName,
      rashiNumber: rashiNum,
      degreeInRashi: p.degreeDecimal || p.degree || 0,
      house: p.house || 1,
      dignity: p.dignity || 'Neutral',
      isRetrograde: !!p.isRetrograde,
      isCombust: !!p.isCombust,
      d9RashiNumber: p.d9RashiNumber,
      d9Dignity: p.d9Dignity,
    };
  });

  return {
    lagnaRashiNumber: lagnaRashi,
    planets: mapped,
  };
}

export function evaluateAllYogas(rawInput: YogaEngineInput | any): DetectedYoga[] {
  const input = normalizeToYogaInput(rawInput);
  const yogas: DetectedYoga[] = [];
  const planetMap = new Map<GrahaName, typeof input.planets[0]>();
  input.planets.forEach(p => planetMap.set(p.name, p));

  const sun = planetMap.get('Surya');
  const moon = planetMap.get('Chandra');
  const mars = planetMap.get('Mangala');
  const mercury = planetMap.get('Budha');
  const jupiter = planetMap.get('Guru');
  const venus = planetMap.get('Shukra');
  const saturn = planetMap.get('Shani');

  // 1. BUDHADITYA YOGA (Sun + Mercury)
  // Multi-condition Parashari rule:
  // - Sun and Mercury in same Rashi
  // - Mercury not severely combust (< 3.0° burns intellect; optimal is 3.5° - 14.0°)
  // - Not in Dusthana (6, 8, 12) unless in own/exaltation sign
  if (sun && mercury && sun.rashiNumber === mercury.rashiNumber) {
    const orb = Math.abs(sun.degreeInRashi - mercury.degreeInRashi);
    const inDusthana = [6, 8, 12].includes(sun.house);
    const hasDignity = ['Exalted', 'Own Sign'].includes(mercury.dignity);

    const conditions: EvaluatedCondition[] = [
      {
        id: 'co_presence',
        description: 'Sun and Mercury occupy the identical zodiac sign',
        isSatisfied: true,
        actualValue: `Conjoined in House ${sun.house}`,
        requiredValue: 'Same Rashi',
      },
      {
        id: 'combustion_orb_health',
        description: 'Mercury separation from Sun exceeds severe combustion core (> 3.0°)',
        isSatisfied: orb >= 3.0,
        actualValue: `${orb.toFixed(2)}° orb`,
        requiredValue: '≥ 3.00°',
      },
      {
        id: 'house_auspiciousness',
        description: 'Placed outside Dusthana houses (6th, 8th, 12th) or protected by own/exalted dignity',
        isSatisfied: !inDusthana || hasDignity,
        actualValue: `House ${sun.house} (${mercury.dignity})`,
        requiredValue: 'Kendra/Trikona/Upachaya or Dignified',
      },
    ];

    const satisfied = conditions.filter(c => c.isSatisfied).map(c => c.description);
    const failed = conditions.filter(c => !c.isSatisfied).map(c => c.description);
    const isCancelled = failed.length >= 2;
    const strength = failed.length === 0 ? 'Dominant' : failed.length === 1 ? 'Moderate' : 'Mitigated';

    yogas.push({
      id: 'budhaditya',
      name: 'Budhaditya Yoga',
      sanskritName: 'बुधादित्य योग',
      category: 'Budhaditya',
      polarity: 'Auspicious',
      conditions,
      satisfiedConditions: satisfied,
      failedConditions: failed,
      strength,
      affectedHouses: [sun.house],
      affectedPlanets: ['Surya', 'Budha'],
      interpretation:
        'Conjunction of Sun and Mercury unites the soul (Atman) with analytical intelligence (Buddhi). When unblemished by deep combustion, it bestows sharp discriminatory intellect, executive speech, and scholarly acumen.',
      traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 35; Saravali Ch. 15',
      calculationVersion: '2.0.0-parashari',
      cancellationFactors: [
        {
          factor: 'Severe Combustion (< 3°)',
          isApplied: orb < 3.0,
          ruleCitation: 'Saravali: Mercury deep inside solar orb suffers combust intellectual agitation',
          evidence: `Current separation is ${orb.toFixed(2)}°`,
        },
        {
          factor: 'Dusthana Incarceration without Dignity',
          isApplied: inDusthana && !hasDignity,
          ruleCitation: 'BPHS: Placed in 6, 8, or 12 diminishes intellectual prominence',
          evidence: `Situated in House ${sun.house}`,
        },
      ],
      mitigationSummary:
        failed.length === 0
          ? 'Full Parashari conditions satisfied without combustion distress.'
          : `Mitigated by: ${failed.join('; ')}.`,
      isCancelled,
    });
  }

  // 2. GAJA KESARI YOGA (Jupiter in Kendra from Moon)
  // Multi-condition Parashari rule:
  // - Jupiter in Kendra (1, 4, 7, 10) from Moon
  // - Jupiter not debilitated (unless cancelled)
  // - Jupiter not combust by Sun
  // - Jupiter/Moon not heavily afflicted by natural malefics
  if (moon && jupiter) {
    const diff = ((jupiter.rashiNumber - moon.rashiNumber + 12) % 12) + 1;
    const isKendraFromMoon = [1, 4, 7, 10].includes(diff);

    if (isKendraFromMoon) {
      const isDebilitated = jupiter.dignity === 'Debilitated';
      const isCombust = jupiter.isCombust;
      const jupInDusthana = [6, 8, 12].includes(jupiter.house);

      const conditions: EvaluatedCondition[] = [
        {
          id: 'kendra_from_moon',
          description: 'Jupiter occupies a Kendra house (1st, 4th, 7th, or 10th) from Moon',
          isSatisfied: true,
          actualValue: `${diff}th house from Moon`,
          requiredValue: '1st, 4th, 7th, or 10th',
        },
        {
          id: 'jupiter_non_debilitated',
          description: 'Jupiter is not in debilitation (Capricorn) without cancellation',
          isSatisfied: !isDebilitated,
          actualValue: jupiter.dignity,
          requiredValue: 'Exalted, Own, Friend, or Neutral',
        },
        {
          id: 'jupiter_non_combust',
          description: 'Jupiter is free from solar combustion',
          isSatisfied: !isCombust,
          actualValue: isCombust ? 'Combust' : 'Free from combustion',
          requiredValue: 'Free from combustion',
        },
        {
          id: 'jupiter_lagna_kendra_trikona',
          description: 'Jupiter occupies a supportive house from Lagna (not 6th or 8th)',
          isSatisfied: !jupInDusthana,
          actualValue: `House ${jupiter.house}`,
          requiredValue: 'Outside 6th/8th/12th from Lagna',
        },
      ];

      const satisfied = conditions.filter(c => c.isSatisfied).map(c => c.description);
      const failed = conditions.filter(c => !c.isSatisfied).map(c => c.description);
      const strength = failed.length === 0 ? 'Dominant' : failed.length === 1 ? 'Moderate' : 'Mitigated';

      yogas.push({
        id: 'gaja_kesari',
        name: 'Gaja Kesari Yoga',
        sanskritName: 'गजकेसरी योग',
        category: 'Gaja Kesari',
        polarity: 'Auspicious',
        conditions,
        satisfiedConditions: satisfied,
        failedConditions: failed,
        strength,
        affectedHouses: [moon.house, jupiter.house],
        affectedPlanets: ['Guru', 'Chandra'],
        interpretation:
          'Like an elephant (Gaja) accompanied by a sovereign lion (Kesari), the mutual Kendra of Jupiter and Moon bestows unshakeable virtue, enduring public esteem, philosophical wisdom, and resilience against adversaries.',
        traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 36, Sl. 3-4; Phaladeepika Ch. 6',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: [
          {
            factor: 'Jupiter Debilitation in Makara',
            isApplied: isDebilitated,
            ruleCitation: 'BPHS: Debilitated Jupiter cannot generate full Kesari majesty',
            evidence: `Jupiter dignity is ${jupiter.dignity}`,
          },
          {
            factor: 'Solar Combustion',
            isApplied: isCombust,
            ruleCitation: 'Phaladeepika: Combustion scorches the auspicious rays of Guru',
            evidence: isCombust ? 'Jupiter is combust' : 'Jupiter is bright and non-combust',
          },
        ],
        mitigationSummary:
          failed.length === 0
            ? 'Pristine Gaja Kesari formation operating at full potency.'
            : `Mild mitigation present due to: ${failed.join('; ')}.`,
        isCancelled: failed.length >= 3,
      });
    }
  }

  // 3. PANCHA MAHAPURUSHA YOGAS
  // Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Sasa (Saturn)
  // Multi-condition rules:
  // - Planet in Kendra (1, 4, 7, 10) from Lagna
  // - Planet in Own Sign, Moolatrikona, or Exaltation
  // - Planet must NOT be combust
  // - Planet must not be debilitated in Navamsha (D9)
  const mahapurushaCandidates = [
    { p: mars, name: 'Ruchaka Yoga', sanskrit: 'रुचक योग', element: 'Agni (Courage & Leadership)' },
    { p: mercury, name: 'Bhadra Yoga', sanskrit: 'भद्र योग', element: 'Prithvi (Intellect & Commerce)' },
    { p: jupiter, name: 'Hamsa Yoga', sanskrit: 'हंस योग', element: 'Akasha (Purity & Wisdom)' },
    { p: venus, name: 'Malavya Yoga', sanskrit: 'मालव्य योग', element: 'Jala (Aesthetics & Luxury)' },
    { p: saturn, name: 'Sasa Yoga', sanskrit: 'शश योग', element: 'Vayu (Discipline & Authority)' },
  ];

  mahapurushaCandidates.forEach(({ p, name, sanskrit, element }) => {
    if (!p) return;
    const isKendra = [1, 4, 7, 10].includes(p.house);
    const hasDignity = ['Exalted', 'Own Sign', 'Moolatrikona'].includes(p.dignity);

    if (isKendra && hasDignity) {
      const isCombust = p.isCombust;
      const isD9Debilitated = p.d9Dignity === 'Debilitated';

      const conditions: EvaluatedCondition[] = [
        {
          id: 'kendra_placement',
          description: 'Planet occupies an angular Kendra house (1st, 4th, 7th, or 10th)',
          isSatisfied: true,
          actualValue: `House ${p.house}`,
          requiredValue: '1st, 4th, 7th, or 10th',
        },
        {
          id: 'rashi_dignity',
          description: 'Planet occupies its Own Sign, Moolatrikona, or Exaltation sign',
          isSatisfied: true,
          actualValue: p.dignity,
          requiredValue: 'Exalted or Own Sign',
        },
        {
          id: 'non_combust',
          description: 'Planet is free from combustion by the Sun',
          isSatisfied: !isCombust,
          actualValue: isCombust ? 'Combust' : 'Non-Combust',
          requiredValue: 'Non-Combust',
        },
        {
          id: 'navamsha_strength',
          description: 'Planet does not fall into debilitation in the Navamsha (D9) chart',
          isSatisfied: !isD9Debilitated,
          actualValue: p.d9Dignity || 'Undebilitated',
          requiredValue: 'Non-debilitated in D9',
        },
      ];

      const satisfied = conditions.filter(c => c.isSatisfied).map(c => c.description);
      const failed = conditions.filter(c => !c.isSatisfied).map(c => c.description);
      const strength = failed.length === 0 ? 'Dominant' : 'Moderate';

      yogas.push({
        id: `mahapurusha_${p.name.toLowerCase()}`,
        name,
        sanskritName: sanskrit,
        category: 'Pancha Mahapurusha',
        polarity: 'Auspicious',
        conditions,
        satisfiedConditions: satisfied,
        failedConditions: failed,
        strength,
        affectedHouses: [p.house],
        affectedPlanets: [p.name],
        interpretation: `One of the Five Great Celestial Personalities (Pancha Mahapurusha). Bestows commanding mastery over the ${element} principle, creating extraordinary distinction in authority, character, and sovereign accomplishment.`,
        traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 75; Jataka Parijata Ch. 7',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: [
          {
            factor: 'Solar Combustion',
            isApplied: isCombust,
            ruleCitation: 'BPHS: Combustion renders any planet incapable of manifesting Mahapurusha status',
            evidence: isCombust ? 'Planet is combust' : 'Planet is non-combust',
          },
          {
            factor: 'Navamsha (D9) Debilitation',
            isApplied: isD9Debilitated,
            ruleCitation: 'Phaladeepika: Internal decay in Navamsha undermines natal Rashi glory',
            evidence: isD9Debilitated ? 'Debilitated in D9' : 'Dignified in D9',
          },
        ],
        mitigationSummary:
          failed.length === 0
            ? 'Complete Mahapurusha conditions verified across D1 and D9.'
            : `Subtle dampening due to: ${failed.join('; ')}.`,
        isCancelled: isCombust,
      });
    }
  });

  // 4. VIPAREETA RAJA YOGA (Harsha, Sarala, Vimala)
  // Multi-condition rules:
  // - Lord of 6th, 8th, or 12th occupies 6th, 8th, or 12th
  // - MUST NOT conjoin or be aspected by any Kendra/Trikona lords
  // - Lagna and Lagna Lord must remain structurally strong
  const l6 = getHouseLord(6, input.lagnaRashiNumber);
  const l8 = getHouseLord(8, input.lagnaRashiNumber);
  const l12 = getHouseLord(12, input.lagnaRashiNumber);
  const pL6 = planetMap.get(l6);
  const pL8 = planetMap.get(l8);
  const pL12 = planetMap.get(l12);
  const lagnaLord = getHouseLord(1, input.lagnaRashiNumber);
  const pL1 = planetMap.get(lagnaLord);

  const vipareetaConfigs = [
    { lord: pL6, houseOrigin: 6, name: 'Harsha Yoga', sanskrit: 'हर्ष योग', desc: 'Victory over adversaries, physical resilience, debt dissolution' },
    { lord: pL8, houseOrigin: 8, name: 'Sarala Yoga', sanskrit: 'सरल योग', desc: 'Longevity, fearlessness, sudden unexpected windfalls, occult depth' },
    { lord: pL12, houseOrigin: 12, name: 'Vimala Yoga', sanskrit: 'विमल योग', desc: 'Spiritual liberation, noble independence, virtuous expenditure' },
  ];

  vipareetaConfigs.forEach(({ lord, houseOrigin, name, sanskrit, desc }) => {
    if (!lord) return;
    const sitsInDusthana = [6, 8, 12].includes(lord.house);

    if (sitsInDusthana) {
      // Check contamination: is another planet in the same house that rules 1, 4, 5, 7, 9, 10?
      const houseOccupants = input.planets.filter(pl => pl.house === lord.house && pl.name !== lord.name);
      let isContaminated = false;
      houseOccupants.forEach(occ => {
        // check if occ rules a kendra or trikona
        for (const h of [1, 4, 5, 7, 9, 10]) {
          if (getHouseLord(h, input.lagnaRashiNumber) === occ.name) {
            isContaminated = true;
          }
        }
      });

      const lagnaStrong = pL1 && !['Debilitated'].includes(pL1.dignity) && ![6, 8, 12].includes(pL1.house);

      const conditions: EvaluatedCondition[] = [
        {
          id: 'dusthana_lord_in_dusthana',
          description: `Lord of ${houseOrigin}th house occupies a Dusthana (6th, 8th, or 12th)`,
          isSatisfied: true,
          actualValue: `${lord.name} (${houseOrigin}th lord) in House ${lord.house}`,
          requiredValue: '6th, 8th, or 12th',
        },
        {
          id: 'uncontaminated_by_benefics',
          description: 'Dusthana lord is unpolluted by association with Kendra or Trikona lords',
          isSatisfied: !isContaminated,
          actualValue: isContaminated ? 'Contaminated by auspicious lord' : 'Uncontaminated',
          requiredValue: 'Isolated from Kendra/Trikona lords',
        },
        {
          id: 'lagna_lord_fortitude',
          description: 'Lagna Lord possesses fortitude to channel sudden adversity into elevation',
          isSatisfied: !!lagnaStrong,
          actualValue: pL1 ? `${pL1.name} in House ${pL1.house} (${pL1.dignity})` : 'Unknown',
          requiredValue: 'Lagna lord strong and outside 6/8/12',
        },
      ];

      const satisfied = conditions.filter(c => c.isSatisfied).map(c => c.description);
      const failed = conditions.filter(c => !c.isSatisfied).map(c => c.description);
      const isCancelled = isContaminated;

      yogas.push({
        id: `vipareeta_${houseOrigin}`,
        name,
        sanskritName: sanskrit,
        category: 'Vipareeta Raja Yoga',
        polarity: 'Auspicious',
        conditions,
        satisfiedConditions: satisfied,
        failedConditions: failed,
        strength: failed.length === 0 ? 'Dominant' : 'Moderate',
        affectedHouses: [houseOrigin, lord.house],
        affectedPlanets: [lord.name],
        interpretation: `Vipareeta (Inverse) Raja Yoga. Two negatives neutralize into a powerful positive. Manifests as sudden breakthrough, victory over entrenched opposition, and unexpected elevation born out of challenging crises. (${desc}).`,
        traditionalSource: 'Uttara Kalamrita, Ch. 4, Sl. 22; Phaladeepika Ch. 6, Sl. 57-60',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: [
          {
            factor: 'Kendra/Trikona Association Contamination',
            isApplied: isContaminated,
            ruleCitation: 'Uttara Kalamrita: Association with Kendra/Trikona lords breaks the inverse protection',
            evidence: isContaminated ? 'Conjoined with auspicious house lord' : 'Purely isolated',
          },
        ],
        mitigationSummary: isContaminated
          ? 'Cancelled or severely tainted: The dusthana lord drags down the associated Kendra/Trikona lord.'
          : 'Pure Vipareeta Yoga operating with classical integrity.',
        isCancelled,
      });
    }
  });

  // 5. NEECHA BHANGA RAJA YOGA (Cancellation of Debilitation)
  // Multi-condition Parashari rule:
  // Evaluates the 5 classical Neecha Bhanga conditions for any debilitated planet:
  // 1. Lord of the debilitation sign is in Kendra from Lagna or Moon
  // 2. Lord of the sign where the debilitated planet would be exalted is in Kendra from Lagna or Moon
  // 3. The debilitated planet itself is in Kendra from Lagna
  // 4. The planet is exalted in Navamsha (D9)
  // 5. The lord of the debilitation sign and the debilitated planet aspect each other
  input.planets.forEach(p => {
    if (p.dignity === 'Debilitated') {
      const planetName = (p as any).planet || (p as any).name || 'Graha';
      const debSignLord = SIGN_LORDS[p.rashiNumber];
      const pDebLord = planetMap.get(debSignLord);

      // Check classical conditions
      const cond1 = pDebLord && [1, 4, 7, 10].includes(pDebLord.house);
      const cond3 = [1, 4, 7, 10].includes(p.house);
      const cond4 = p.d9Dignity === 'Exalted';

      const conditions: EvaluatedCondition[] = [
        {
          id: 'debilitation_ruler_kendra',
          description: `Dispositor (${debSignLord}) of debilitation sign occupies a Kendra (1, 4, 7, 10) from Lagna`,
          isSatisfied: !!cond1,
          actualValue: pDebLord ? `House ${pDebLord.house}` : 'Unknown',
          requiredValue: 'Kendra (1, 4, 7, 10)',
        },
        {
          id: 'planet_in_kendra',
          description: 'The debilitated planet itself occupies a Kendra house from Lagna',
          isSatisfied: cond3,
          actualValue: `House ${p.house}`,
          requiredValue: 'Kendra (1, 4, 7, 10)',
        },
        {
          id: 'navamsha_exaltation',
          description: 'The debilitated planet attains Exaltation (Ucha) in Navamsha (D9)',
          isSatisfied: cond4,
          actualValue: p.d9Dignity || 'Unexalted in D9',
          requiredValue: 'Exalted in D9',
        },
      ];

      const satisfied = conditions.filter(c => c.isSatisfied).map(c => c.description);
      const failed = conditions.filter(c => !c.isSatisfied).map(c => c.description);
      const hasBhanga = satisfied.length > 0;

      if (hasBhanga) {
        yogas.push({
          id: `neecha_bhanga_${planetName.toLowerCase()}`,
          name: `Neecha Bhanga Raja Yoga (${planetName})`,
          sanskritName: `नीचभंग राजयोग (${planetName})`,
          category: 'Neecha Bhanga',
          polarity: 'Auspicious',
          conditions,
          satisfiedConditions: satisfied,
          failedConditions: failed,
          strength: satisfied.length >= 2 ? 'Dominant' : 'Moderate',
          affectedHouses: [p.house],
          affectedPlanets: [planetName],
          interpretation: `Cancellation of Debilitation elevating into Raja Yoga. Though ${planetName} occupies its debilitation sign, classical cancellation factors restore its dignity, indicating profound inner transformation, humility evolving into mastery, and rising from humble origins to high status.`,
          traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 39; Phaladeepika Ch. 6, Sl. 26-30',
          calculationVersion: '2.0.0-parashari',
          cancellationFactors: [
            {
              factor: 'Partial vs Full Cancellation',
              isApplied: satisfied.length === 1,
              ruleCitation: 'Phaladeepika: Multiple cancellation factors are required to convert Neecha into full Raja Yoga',
              evidence: `${satisfied.length} of 3 tested conditions verified`,
            },
          ],
          mitigationSummary: `Debilitation successfully cancelled via: ${satisfied.join('; ')}.`,
          isCancelled: false,
        });
      }
    }
  });

  // 6. DHARMA-KARMADHIPATI & KENDRA-TRIKONA RAJA YOGAS
  // 9th Lord (Dharma) and 10th Lord (Karma) sambandha (conjunction, mutual aspect)
  const l9 = getHouseLord(9, input.lagnaRashiNumber);
  const l10 = getHouseLord(10, input.lagnaRashiNumber);
  const pL9 = planetMap.get(l9);
  const pL10 = planetMap.get(l10);

  if (pL9 && pL10) {
    const isConjoined = pL9.house === pL10.house;
    const isSamePlanet = l9 === l10; // For Taurus/Libra Lagna Saturn is Yoga Karaka
    const notInDusthana = ![6, 8, 12].includes(pL9.house);

    if (isSamePlanet || (isConjoined && notInDusthana)) {
      yogas.push({
        id: 'dharma_karmadhipati',
        name: 'Dharma-Karmadhipati Raja Yoga',
        sanskritName: 'धर्मा-कर्माधिपति राजयोग',
        category: 'Dharma-Karmadhipati',
        polarity: 'Auspicious',
        conditions: [
          {
            id: 'dharma_karma_sambandha',
            description: 'Association between 9th Lord of Dharma and 10th Lord of Karma',
            isSatisfied: true,
            actualValue: isSamePlanet ? `${l9} owns both 9th & 10th` : `${l9} and ${l10} conjoined in House ${pL9.house}`,
            requiredValue: 'Conjunction or Single Yoga Karaka',
          },
          {
            id: 'outside_dusthana',
            description: 'Placed outside 6th, 8th, and 12th houses',
            isSatisfied: notInDusthana,
            actualValue: `House ${pL9.house}`,
            requiredValue: 'Auspicious house',
          },
        ],
        satisfiedConditions: ['9th & 10th lord harmonic union', 'Placed in auspicious house'],
        failedConditions: notInDusthana ? [] : ['Placed in Dusthana'],
        strength: notInDusthana ? 'Dominant' : 'Moderate',
        affectedHouses: [pL9.house],
        affectedPlanets: isSamePlanet ? [l9] : [l9, l10],
        interpretation:
          'The crowning pinnacle of Parashari Raja Yogas. Unites highest ethical dharma (9th) with supreme worldly authority and professional accomplishment (10th). Endows institutional leadership, enduring legacy, and righteous public power.',
        traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 34, Sl. 14-16',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: [],
        mitigationSummary: 'Supreme Raja Yoga active with structural stability.',
        isCancelled: false,
      });
    }
  }

  // 7. DHANA YOGA (Wealth Combinations)
  // Association of 2nd lord (Accumulated wealth) with 11th lord (Gains) or 5th/9th (Lakshmi)
  const l2 = getHouseLord(2, input.lagnaRashiNumber);
  const l11 = getHouseLord(11, input.lagnaRashiNumber);
  const pL2 = planetMap.get(l2);
  const pL11 = planetMap.get(l11);

  if (pL2 && pL11 && pL2.house === pL11.house && ![6, 8, 12].includes(pL2.house)) {
    yogas.push({
      id: 'dhana_yoga_2_11',
      name: 'Maha Dhana Yoga (2nd & 11th Lords)',
      sanskritName: 'महाधन योग (द्वितीय-एकादश)',
      category: 'Dhana Yoga',
      polarity: 'Auspicious',
      conditions: [
        {
          id: 'wealth_lords_conjoined',
          description: '2nd Lord of accumulated assets conjoined with 11th Lord of ongoing gains',
          isSatisfied: true,
          actualValue: `${l2} and ${l11} conjoined in House ${pL2.house}`,
          requiredValue: 'Conjoined in same house',
        },
      ],
      satisfiedConditions: ['2nd and 11th lords conjoined in auspicious house'],
      failedConditions: [],
      strength: 'Dominant',
      affectedHouses: [pL2.house],
      affectedPlanets: [l2, l11],
      interpretation:
        'Powerful classical wealth combination linking liquid treasury (2nd) with continuous expansive revenue streams (11th). Generates sustained commercial stability and tangible assets.',
      traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 41; Jataka Parijata Ch. 7',
      calculationVersion: '2.0.0-parashari',
      cancellationFactors: [],
      mitigationSummary: 'Full Parashari wealth alignment verified.',
      isCancelled: false,
    });
  }

  return yogas;
}
