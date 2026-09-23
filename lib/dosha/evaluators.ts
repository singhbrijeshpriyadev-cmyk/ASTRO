import { DetectedDosha, DoshaEngineInput, EvaluatedCondition, CancellationFactor } from './types';
import { GrahaName } from '@/types/astrology';

const RASHI_NAMES: Record<number, string> = {
  1: 'Mesha (Aries)',
  2: 'Vrishabha (Taurus)',
  3: 'Mithuna (Gemini)',
  4: 'Karka (Cancer)',
  5: 'Simha (Leo)',
  6: 'Kanya (Virgo)',
  7: 'Tula (Libra)',
  8: 'Vrishchika (Scorpio)',
  9: 'Dhanu (Sagittarius)',
  10: 'Makara (Capricorn)',
  11: 'Kumbha (Aquarius)',
  12: 'Meena (Pisces)',
};

export function normalizeToDoshaInput(input: any): DoshaEngineInput {
  if (input.lagnaRashiNumber && input.moonRashiNumber && input.venusRashiNumber && input.planets) {
    return input as DoshaEngineInput;
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
  let moonRashi = 1;
  let venusRashi = 1;

  const mapped = rawPlanets.map((p: any) => {
    const rawName = p.name || p.planet || 'Surya';
    const gName = GRAHA_NAME_MAP[rawName] || (rawName as GrahaName);
    const rashiNum = p.rashiNumber || (p.signIndex !== undefined ? p.signIndex + 1 : 1);
    if (gName === 'Chandra') moonRashi = rashiNum;
    if (gName === 'Shukra') venusRashi = rashiNum;

    return {
      name: gName,
      planet: p.planet || rawName,
      rashiNumber: rashiNum,
      degreeInRashi: p.degreeDecimal || p.degree || 0,
      house: p.house || 1,
      dignity: p.dignity || 'Neutral',
      isRetrograde: !!p.isRetrograde,
      isCombust: !!p.isCombust,
      nakshatra: p.nakshatra,
      pada: p.pada,
    };
  });

  return {
    lagnaRashiNumber: lagnaRashi,
    moonRashiNumber: moonRashi,
    venusRashiNumber: venusRashi,
    planets: mapped,
  };
}

export function evaluateAllDoshas(rawInput: DoshaEngineInput | any): DetectedDosha[] {
  const input = normalizeToDoshaInput(rawInput);
  const doshas: DetectedDosha[] = [];
  const planetMap = new Map<GrahaName, typeof input.planets[0]>();
  input.planets.forEach(p => planetMap.set(p.name, p));

  const sun = planetMap.get('Surya');
  const moon = planetMap.get('Chandra');
  const mars = planetMap.get('Mangala');
  const mercury = planetMap.get('Budha');
  const jupiter = planetMap.get('Guru');
  const venus = planetMap.get('Shukra');
  const saturn = planetMap.get('Shani');
  const rahu = planetMap.get('Rahu');
  const ketu = planetMap.get('Ketu');

  // ==========================================
  // 1. MANGLIK DOSHA (KUJA DOSHA)
  // ==========================================
  // Classical positions: Mars in 1st, 2nd (South Indian), 4th, 7th, 8th, or 12th from Lagna, Moon, or Venus
  if (mars) {
    const lagnaDiff = mars.house; // 1-12 from Lagna
    const moonDiff = moon ? ((mars.rashiNumber - moon.rashiNumber + 12) % 12) + 1 : 0;
    const venusDiff = venus ? ((mars.rashiNumber - venus.rashiNumber + 12) % 12) + 1 : 0;

    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const isFromLagna = manglikHouses.includes(lagnaDiff);
    const isFromMoon = manglikHouses.includes(moonDiff);
    const isFromVenus = manglikHouses.includes(venusDiff);

    if (isFromLagna || isFromMoon || isFromVenus) {
      // Classical Parashari & Muhurta Chintamani Cancellation Rules:
      // 1. Mars in Aries in 1st house -> Cancelled
      // 2. Mars in Scorpio in 4th house -> Cancelled
      // 3. Mars in Capricorn (exalted) in 7th or 8th house -> Cancelled
      // 4. Mars in Sagittarius or Pisces in 12th house -> Cancelled
      // 5. Mars in Leo or Aquarius in 8th house -> Cancelled
      // 6. Conjoined or aspected by Jupiter -> Cancelled / Strong Mitigation
      // 7. Conjoined or aspected by Moon -> Cancelled / Mitigated (Chandra-Mangala)
      // 8. Saturn occupying 1st, 4th, 7th, 8th, or 12th balances out Kuja dosha
      const cancelAries1st = mars.rashiNumber === 1 && lagnaDiff === 1;
      const cancelScorpio4th = mars.rashiNumber === 8 && lagnaDiff === 4;
      const cancelCapri7or8 = mars.rashiNumber === 10 && [7, 8].includes(lagnaDiff);
      const cancelSagPis12 = [9, 12].includes(mars.rashiNumber) && lagnaDiff === 12;
      const cancelLeoAqu8 = [5, 11].includes(mars.rashiNumber) && lagnaDiff === 8;

      // Jupiter aspect or conjunction:
      const jupWithMars = jupiter && jupiter.house === mars.house;
      const jupAspectsMars = jupiter && [5, 7, 9].includes(((mars.house - jupiter.house + 12) % 12) + 1);
      const jupiterMitigation = jupWithMars || jupAspectsMars;

      // Moon conjunction
      const moonWithMars = moon && moon.house === mars.house;

      // Saturn in Kendra/Dusthana balance
      const saturnBalance = saturn && [1, 4, 7, 8, 12].includes(saturn.house);

      const cancellations: CancellationFactor[] = [
        {
          factor: 'Mars in Aries in 1st House (Swakshetra)',
          isApplied: cancelAries1st,
          ruleCitation: 'Muhurta Chintamani: Mars in own sign Aries in Lagna dispels Kuja affliction',
          evidence: `Mars in sign ${mars.rashiNumber} in house ${lagnaDiff}`,
        },
        {
          factor: 'Mars in Scorpio in 4th House (Swakshetra)',
          isApplied: cancelScorpio4th,
          ruleCitation: 'BPHS: Mars in Scorpio in the 4th produces domestic fortitude rather than discord',
          evidence: `Mars in sign ${mars.rashiNumber} in house ${lagnaDiff}`,
        },
        {
          factor: 'Mars in Capricorn in 7th or 8th House (Ucha / Exalted)',
          isApplied: cancelCapri7or8,
          ruleCitation: 'BPHS: An exalted Mars in 7th/8th acts with noble restraint and strength',
          evidence: `Mars in sign ${mars.rashiNumber} in house ${lagnaDiff}`,
        },
        {
          factor: 'Mars in Jupiterian Signs (Dhanu/Meena) in 12th',
          isApplied: cancelSagPis12,
          ruleCitation: 'Deva Keralam: 12th house Kuja in Jupiter sign channels energy into spiritual Tapas',
          evidence: `Mars in sign ${mars.rashiNumber} in house ${lagnaDiff}`,
        },
        {
          factor: 'Mars in Leo or Aquarius in 8th House',
          isApplied: cancelLeoAqu8,
          ruleCitation: 'Muhurta Chintamani: 8th house Kuja in Simha or Kumbha is classically exempt',
          evidence: `Mars in sign ${mars.rashiNumber} in house ${lagnaDiff}`,
        },
        {
          factor: 'Jupiter Conjunction or Aspect (Guru Drishti)',
          isApplied: !!jupiterMitigation,
          ruleCitation: 'Brihat Parashara: Guru aspecting Kuja converts volcanic heat into righteous purpose',
          evidence: jupiterMitigation ? 'Jupiter conjoins or casts aspect upon Mars' : 'No direct Jupiter aspect',
        },
        {
          factor: 'Chandra-Mangala Conjunction',
          isApplied: !!moonWithMars,
          ruleCitation: 'Phaladeepika: Moon conjoined with Mars dissolves marital hostility into commercial drive',
          evidence: moonWithMars ? 'Moon conjoins Mars' : 'Moon is separate',
        },
        {
          factor: 'Saturnian Counterbalance',
          isApplied: !!saturnBalance,
          ruleCitation: 'Classical tradition: Saturn placed in 1, 4, 7, 8, 12 provides karmic counterweight',
          evidence: saturnBalance ? `Saturn in house ${saturn?.house}` : 'Saturn not in counterweight house',
        },
      ];

      const appliedCancellations = cancellations.filter(c => c.isApplied);
      const isFullyCancelled = appliedCancellations.some(c => 
        ['Mars in Aries in 1st House (Swakshetra)', 'Mars in Scorpio in 4th House (Swakshetra)', 'Mars in Capricorn in 7th or 8th House (Ucha / Exalted)', 'Jupiter Conjunction or Aspect (Guru Drishti)'].includes(c.factor)
      );
      const hasMitigation = appliedCancellations.length > 0;

      const conditions: EvaluatedCondition[] = [
        {
          id: 'lagna_manglik',
          description: 'Mars occupies 1st, 2nd, 4th, 7th, 8th, or 12th from Lagna',
          isSatisfied: isFromLagna,
          actualValue: `House ${lagnaDiff} from Lagna`,
          requiredValue: '1, 2, 4, 7, 8, 12',
        },
        {
          id: 'moon_manglik',
          description: 'Mars occupies 1st, 2nd, 4th, 7th, 8th, or 12th from Moon',
          isSatisfied: isFromMoon,
          actualValue: `${moonDiff}th house from Moon`,
          requiredValue: '1, 2, 4, 7, 8, 12',
        },
        {
          id: 'venus_manglik',
          description: 'Mars occupies 1st, 2nd, 4th, 7th, 8th, or 12th from Venus',
          isSatisfied: isFromVenus,
          actualValue: `${venusDiff}th house from Venus`,
          requiredValue: '1, 2, 4, 7, 8, 12',
        },
      ];

      const satisfied = conditions.filter(c => c.isSatisfied).map(c => c.description);
      const failed = conditions.filter(c => !c.isSatisfied).map(c => c.description);

      doshas.push({
        id: 'manglik_dosha',
        name: 'Manglik Analysis (Kuja Dosha)',
        sanskritName: 'मांगलिक दोष (भौम विचार)',
        category: 'Manglik',
        polarity: isFullyCancelled ? 'Mitigated' : 'Challenging',
        conditions,
        satisfiedConditions: satisfied,
        failedConditions: failed,
        strength: isFullyCancelled ? 'Cancelled' : hasMitigation ? 'Mitigated' : 'Moderate',
        affectedHouses: [lagnaDiff],
        affectedPlanets: ['Mangala'],
        interpretation:
          isFullyCancelled
            ? 'While Mars occupies a classical Kuja position, specific Parashari cancellation rules nullify the destructive potential, redirecting martial drive into passionate commitment, leadership, and enterprise.'
            : hasMitigation
            ? 'Mars exerts significant direct assertiveness in partnership vectors; however, active mitigating factors soften the friction. Open communication and balanced pacing resolve misunderstandings.'
            : 'Mars occupies an active fire vector relative to partnership houses. Demands conscious awareness of impulsive reactions, emotional patience, and mutual respect for personal space in committed alliances.',
        traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 81; Muhurta Chintamani',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: cancellations,
        mitigationSummary: isFullyCancelled
          ? `Fully Cancelled by classical rule: ${appliedCancellations.map(c => c.factor).join(', ')}.`
          : hasMitigation
          ? `Mitigated by: ${appliedCancellations.map(c => c.factor).join(', ')}.`
          : 'No standard classical cancellation factors detected; awareness recommended.',
        isCancelled: isFullyCancelled,
        hasMitigation,
      });
    }
  }

  // ==========================================
  // 2. KAAL SARPA DOSHA
  // ==========================================
  // All 7 planets enclosed between Rahu and Ketu axis
  if (rahu && ketu) {
    const rahuHouse = rahu.house;
    const ketuHouse = ketu.house;

    // Check whether all 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)
    // lie on one side of the Rahu-Ketu axis
    const classicalPlanets = [sun, moon, mars, mercury, jupiter, venus, saturn].filter(Boolean) as typeof input.planets;

    // Calculate clockwise distance from Rahu to each planet
    let inArc1 = 0; // between Rahu and Ketu (clockwise)
    let inArc2 = 0; // between Ketu and Rahu (clockwise)

    classicalPlanets.forEach(p => {
      const distFromRahu = ((p.house - rahuHouse + 12) % 12);
      if (distFromRahu > 0 && distFromRahu < 6) {
        inArc1++;
      } else if (distFromRahu > 6) {
        inArc2++;
      }
    });

    const isFullKaalSarpa = (inArc1 === 7 && inArc2 === 0) || (inArc2 === 7 && inArc1 === 0);
    const isPartialKaalSarpa = (inArc1 >= 6 || inArc2 >= 6) && !isFullKaalSarpa;

    if (isFullKaalSarpa || isPartialKaalSarpa) {
      const KAAL_SARPA_NAMES: Record<number, { name: string; sanskrit: string; theme: string }> = {
        1: { name: 'Ananta Kaal Sarpa', sanskrit: 'अनंत कालसर्प', theme: '1st/7th axis: Identity & Relationship friction' },
        2: { name: 'Kulika Kaal Sarpa', sanskrit: 'कुलिक कालसर्प', theme: '2nd/8th axis: Financial speech & sudden fluctuations' },
        3: { name: 'Vasuki Kaal Sarpa', sanskrit: 'वासुकी कालसर्प', theme: '3rd/9th axis: Initiative & Dharmic struggles' },
        4: { name: 'Shankhapala Kaal Sarpa', sanskrit: 'शंखपाल कालसर्प', theme: '4th/10th axis: Domestic peace & Professional zenith' },
        5: { name: 'Padma Kaal Sarpa', sanskrit: 'पद्म कालसर्प', theme: '5th/11th axis: Intellect, Progeny & Social circles' },
        6: { name: 'Mahapadma Kaal Sarpa', sanskrit: 'महापद्म कालसर्प', theme: '6th/12th axis: Health, Debt & Foreign travels' },
        7: { name: 'Takshaka Kaal Sarpa', sanskrit: 'तक्षक कालसर्प', theme: '7th/1st axis: Partnerships & Public life' },
        8: { name: 'Karkotaka Kaal Sarpa', sanskrit: 'कर्कोटक कालसर्प', theme: '8th/2nd axis: Hidden transformations & Inheritance' },
        9: { name: 'Shankhachuda Kaal Sarpa', sanskrit: 'शंखचूड़ कालसर्प', theme: '9th/3rd axis: Spiritual fortune & Ancestral karma' },
        10: { name: 'Ghataka Kaal Sarpa', sanskrit: 'घातक कालसर्प', theme: '10th/4th axis: Executive career & Public stature' },
        11: { name: 'Vishadhara Kaal Sarpa', sanskrit: 'विषधर कालसर्प', theme: '11th/5th axis: Ambitions & Creative investments' },
        12: { name: 'Sheshanaga Kaal Sarpa', sanskrit: 'शेषनाग कालसर्प', theme: '12th/6th axis: Solitude, Foreign lands & Moksha' },
      };

      const typeInfo = KAAL_SARPA_NAMES[rahuHouse] || {
        name: 'Kaal Sarpa Formation',
        sanskrit: 'कालसर्प योग',
        theme: 'Nodal containment axis',
      };

      // Mitigation factors:
      // 1. Jupiter aspecting Rahu or Ketu
      // 2. Benefic in Kendra from Lagna
      // 3. Partial hemming (one planet escaping)
      const jupInKendra = jupiter && [1, 4, 7, 10].includes(jupiter.house);
      const lagnaLordKendra = [1, 4, 7, 10].includes(input.planets.find(p => p.house === 1)?.house || 0);

      const cancellations: CancellationFactor[] = [
        {
          factor: 'Partial Nodal Axis (Escaped Planet)',
          isApplied: isPartialKaalSarpa,
          ruleCitation: 'Classical tradition: A single planet outside the axis breaks the complete enclosing circle',
          evidence: isPartialKaalSarpa ? 'One or more planets break the nodal hemisphere' : 'All 7 planets enclosed',
        },
        {
          factor: 'Jupiter in Angular Kendra',
          isApplied: !!jupInKendra,
          ruleCitation: 'BPHS: Guru in Kendra dispels the serpent shadow through divine wisdom',
          evidence: jupInKendra ? `Jupiter placed in angular house ${jupiter?.house}` : 'Jupiter outside Kendras',
        },
      ];

      const conditions: EvaluatedCondition[] = [
        {
          id: 'nodal_containment',
          description: 'Classical planets enclosed within the Rahu-Ketu nodal hemisphere',
          isSatisfied: true,
          actualValue: isFullKaalSarpa ? 'Complete Containment (7 of 7)' : 'Partial Containment (6 of 7)',
          requiredValue: 'All 7 planets enclosed',
        },
      ];

      doshas.push({
        id: 'kaal_sarpa',
        name: typeInfo.name,
        sanskritName: typeInfo.sanskrit,
        category: 'Kaal Sarpa',
        polarity: isPartialKaalSarpa || jupInKendra ? 'Mitigated' : 'Challenging',
        conditions,
        satisfiedConditions: [isFullKaalSarpa ? 'All 7 planets hemmed in nodal axis' : 'Partial nodal hemming'],
        failedConditions: isPartialKaalSarpa ? ['Incomplete containment'] : [],
        strength: isFullKaalSarpa && !jupInKendra ? 'Moderate' : 'Mitigated',
        affectedHouses: [rahuHouse, ketuHouse],
        affectedPlanets: ['Rahu', 'Ketu'],
        interpretation: `Nodal containment along the ${typeInfo.theme}. Creates intense karmic compression and early struggle that typically yields remarkable breakthrough, perseverance, and uncommon public elevation in the second half of life.`,
        traditionalSource: 'Jataka Parijata; classical Nodal treatises',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: cancellations,
        mitigationSummary: isPartialKaalSarpa
          ? 'Partial Kaal Sarpa (Khanda / Ardha): Containment is broken, dissipating full severity.'
          : jupInKendra
          ? 'Mitigated by Jupiter residing in Kendra, granting resilience and protection.'
          : 'Active nodal axis providing strong developmental discipline.',
        isCancelled: false,
        hasMitigation: isPartialKaalSarpa || !!jupInKendra,
      });
    }
  }

  // ==========================================
  // 3. KEMADRUMA DOSHA
  // ==========================================
  // 2nd and 12th houses from Moon unoccupied by planets (excluding Sun, Rahu, Ketu)
  if (moon) {
    const h2FromMoon = ((moon.house) % 12) + 1;
    const h12FromMoon = ((moon.house - 2 + 12) % 12) + 1;

    // Check occupants of 2nd and 12th from Moon
    const nonLuminaries = ['Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
    const pIn2nd = input.planets.filter(p => p.house === h2FromMoon && nonLuminaries.includes(p.name));
    const pIn12th = input.planets.filter(p => p.house === h12FromMoon && nonLuminaries.includes(p.name));

    if (pIn2nd.length === 0 && pIn12th.length === 0) {
      // Classical Kemadruma Bhanga (Cancellations):
      // 1. Planets in Kendra (1, 4, 7, 10) from Lagna
      // 2. Planets in Kendra from Moon
      // 3. Moon aspected by Jupiter
      const kendraFromLagnaPlanets = input.planets.filter(p => [1, 4, 7, 10].includes(p.house) && nonLuminaries.includes(p.name));
      const jupAspectsMoon = jupiter && [1, 4, 7, 10].includes(((moon.house - jupiter.house + 12) % 12) + 1);

      const hasBhanga = kendraFromLagnaPlanets.length > 0 || !!jupAspectsMoon;

      const cancellations: CancellationFactor[] = [
        {
          factor: 'Kemadruma Bhanga: Planets in Kendra from Lagna',
          isApplied: kendraFromLagnaPlanets.length > 0,
          ruleCitation: 'Saravali Ch. 13: Planets in Kendra from Lagna dissolve Kemadruma isolation',
          evidence: `${kendraFromLagnaPlanets.map(p => p.name).join(', ')} occupy Kendras`,
        },
        {
          factor: 'Jupiterian Aspect on Moon',
          isApplied: !!jupAspectsMoon,
          ruleCitation: 'BPHS: Jupiter casting divine gaze on solitary Moon removes all blemish',
          evidence: jupAspectsMoon ? 'Jupiter aspects Moon' : 'No direct Jupiter aspect',
        },
      ];

      doshas.push({
        id: 'kemadruma_dosha',
        name: hasBhanga ? 'Kemadruma Bhanga (Cancellation)' : 'Kemadruma Dosha',
        sanskritName: hasBhanga ? 'केमद्रुम भंग योग' : 'केमद्रुम दोष',
        category: 'Kemadruma',
        polarity: hasBhanga ? 'Mitigated' : 'Challenging',
        conditions: [
          {
            id: 'unflanked_moon',
            description: '2nd and 12th houses from the Moon have no physical planets (excluding Sun/Nodes)',
            isSatisfied: true,
            actualValue: '2nd and 12th from Moon unoccupied',
            requiredValue: 'Flanked by planets',
          },
        ],
        satisfiedConditions: ['No planets flanking Moon in 2nd/12th'],
        failedConditions: [],
        strength: hasBhanga ? 'Cancelled' : 'Moderate',
        affectedHouses: [moon.house],
        affectedPlanets: ['Chandra'],
        interpretation: hasBhanga
          ? 'Kemadruma Bhanga: While the Moon is initially solitary, cancellation factors from Kendra anchors transmute initial feelings of isolation into deep emotional self-reliance, independence, and meditative depth.'
          : 'Solitary Moon. Indicates periodic feelings of emotional isolation or psychological independence. Teaches profound self-anchoring rather than relying on external validation.',
        traditionalSource: 'Brihat Parashara Hora Shastra, Ch. 13; Saravali Ch. 13',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: cancellations,
        mitigationSummary: hasBhanga
          ? `Fully Cancelled into Kemadruma Bhanga via: ${cancellations.filter(c => c.isApplied).map(c => c.factor).join('; ')}.`
          : 'No immediate cancellation detected; cultivation of inner tranquility recommended.',
        isCancelled: hasBhanga,
        hasMitigation: hasBhanga,
      });
    }
  }

  // ==========================================
  // 4. GRAHAN DOSHA (Eclipse Conjunction)
  // ==========================================
  // Sun or Moon closely conjoined with Rahu or Ketu in same house
  const checkGrahan = (luminary: typeof sun, luminaryName: 'Surya' | 'Chandra') => {
    if (!luminary) return;
    const conjoinedNode = [rahu, ketu].find(n => n && n.house === luminary.house);
    if (conjoinedNode) {
      const orb = Math.abs(luminary.degreeInRashi - conjoinedNode.degreeInRashi);
      const isSevere = orb <= 5.0;
      const isModerate = orb > 5.0 && orb <= 12.0;

      const jupAspect = jupiter && [5, 7, 9].includes(((luminary.house - jupiter.house + 12) % 12) + 1);

      doshas.push({
        id: `grahan_${luminaryName.toLowerCase()}`,
        name: `Grahan Dosha (${luminaryName})`,
        sanskritName: `ग्रहण दोष (${luminaryName === 'Surya' ? 'सूर्य' : 'चन्द्र'})`,
        category: 'Grahan',
        polarity: jupAspect || !isSevere ? 'Mitigated' : 'Challenging',
        conditions: [
          {
            id: 'luminary_node_conjunction',
            description: `${luminaryName} conjoined with shadow node ${conjoinedNode.name} in House ${luminary.house}`,
            isSatisfied: true,
            actualValue: `Orb of separation: ${orb.toFixed(2)}°`,
            requiredValue: 'Same sign/house',
          },
        ],
        satisfiedConditions: [`${luminaryName} conjoined with ${conjoinedNode.name}`],
        failedConditions: [],
        strength: isSevere && !jupAspect ? 'Moderate' : 'Mitigated',
        affectedHouses: [luminary.house],
        affectedPlanets: [luminaryName, conjoinedNode.name],
        interpretation: `Shadow node affliction on ${luminaryName === 'Surya' ? 'the Sun (Vitality, Soul, Father)' : 'the Moon (Mind, Emotions, Mother)'}. Indicates psychological or karmic sensitivity in themes of identity and perception, often awakening profound esoteric insight when channeled through conscious meditation.`,
        traditionalSource: 'Brihat Parashara Hora Shastra; Jataka Parijata',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: [
          {
            factor: 'Wide Separation Orb (> 5°)',
            isApplied: !isSevere,
            ruleCitation: 'Classical orb doctrine: Affliction intensity diminishes beyond 5 degrees',
            evidence: `Conjunction orb is ${orb.toFixed(2)}°`,
          },
          {
            factor: 'Jupiter Aspect / Relief',
            isApplied: !!jupAspect,
            ruleCitation: 'Phaladeepika: Jupiterian aspect cleanses eclipse impurities',
            evidence: jupAspect ? 'Jupiter aspects the afflicted luminary' : 'No direct Jupiter aspect',
          },
        ],
        mitigationSummary: !isSevere
          ? `Mild eclipse shadow: Orb of ${orb.toFixed(2)}° is wide, significantly mitigating adverse effects.`
          : jupAspect
          ? 'Mitigated by protective Jupiterian aspect.'
          : 'Close nodal conjunction; daily Gayatri or solar/lunar meditation beneficial.',
        isCancelled: false,
        hasMitigation: !isSevere || !!jupAspect,
      });
    }
  };

  checkGrahan(sun, 'Surya');
  checkGrahan(moon, 'Chandra');

  // ==========================================
  // 5. GURU CHANDAL DOSHA
  // ==========================================
  // Jupiter conjoined with Rahu or Ketu
  if (jupiter && (rahu || ketu)) {
    const nodeConjoined = [rahu, ketu].find(n => n && n.house === jupiter.house);
    if (nodeConjoined) {
      const orb = Math.abs(jupiter.degreeInRashi - nodeConjoined.degreeInRashi);
      const inOwnOrExalted = ['Exalted', 'Own Sign'].includes(jupiter.dignity);

      doshas.push({
        id: 'guru_chandal_dosha',
        name: `Guru Chandal Formation (${nodeConjoined.name})`,
        sanskritName: 'गुरु चांडाल योग',
        category: 'Guru Chandal',
        polarity: inOwnOrExalted || orb > 8 ? 'Mitigated' : 'Challenging',
        conditions: [
          {
            id: 'jupiter_node_conjunction',
            description: `Jupiter conjoined with ${nodeConjoined.name} in House ${jupiter.house}`,
            isSatisfied: true,
            actualValue: `Orb of separation: ${orb.toFixed(2)}° (${RASHI_NAMES[jupiter.rashiNumber]})`,
            requiredValue: 'Same sign/house',
          },
        ],
        satisfiedConditions: [`Jupiter conjoined with ${nodeConjoined.name}`],
        failedConditions: [],
        strength: inOwnOrExalted ? 'Mitigated' : orb <= 5 ? 'Moderate' : 'Mild',
        affectedHouses: [jupiter.house],
        affectedPlanets: ['Guru', nodeConjoined.name],
        interpretation:
          'Conjunction of Jupiter (Wisdom, Tradition, Dharma) with the rebellious shadow node. Rather than blind conformity, it fosters an unorthodox, questioning intellect that challenges dogma to arrive at deeper philosophical truth.',
        traditionalSource: 'Brihat Parashara Hora Shastra; Saravali',
        calculationVersion: '2.0.0-parashari',
        cancellationFactors: [
          {
            factor: 'Jupiter in Swakshetra / Ucha (Own or Exalted Sign)',
            isApplied: inOwnOrExalted,
            ruleCitation: 'BPHS: Jupiter in Sagittarius, Pisces, or Cancer absorbs and civilizes Rahu',
            evidence: `Jupiter dignity is ${jupiter.dignity}`,
          },
          {
            factor: 'Separation Orb > 8 Degrees',
            isApplied: orb > 8.0,
            ruleCitation: 'Classical distance doctrine: Beyond 8 degrees, the shadow loses disruptive grip',
            evidence: `Current separation is ${orb.toFixed(2)}°`,
          },
        ],
        mitigationSummary: inOwnOrExalted
          ? 'Strongly mitigated: Jupiter sits in its own or exalted sign, commanding the nodal influence into original philosophical scholarship.'
          : orb > 8.0
          ? 'Mild: Wide separation ensures the shadow does not obscure ethical judgment.'
          : 'Unorthodox philosophical bent; independent inquiry favored over dogma.',
        isCancelled: inOwnOrExalted,
        hasMitigation: inOwnOrExalted || orb > 8.0,
      });
    }
  }

  return doshas;
}
