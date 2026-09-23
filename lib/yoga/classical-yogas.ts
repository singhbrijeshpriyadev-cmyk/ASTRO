import { PlanetaryPosition, YogaResult, GrahaName } from '@/types/astrology';

export function detectClassicalYogas(
  planets: PlanetaryPosition[],
  lagnaRashiNumber: number
): YogaResult[] {
  const yogas: YogaResult[] = [];
  const planetMap = new Map<GrahaName, PlanetaryPosition>();
  planets.forEach(p => planetMap.set(p.name, p));

  const sun = planetMap.get('Surya');
  const moon = planetMap.get('Chandra');
  const mars = planetMap.get('Mangala');
  const mercury = planetMap.get('Budha');
  const jupiter = planetMap.get('Guru');
  const venus = planetMap.get('Shukra');
  const saturn = planetMap.get('Shani');

  // 1. Budhaditya Yoga: Sun + Mercury in same Rashi
  if (sun && mercury && sun.rashiNumber === mercury.rashiNumber) {
    yogas.push({
      name: 'Budhaditya Yoga',
      sanskritName: 'बुधादित्य योग',
      category: 'Auspicious',
      beneficence: 'positive',
      planetsInvolved: ['Surya', 'Budha'],
      housesInvolved: [sun.house],
      description: 'Conjunction of the Sun (Surya) and Mercury (Budha) in the same sign.',
      effects: 'Bestows sharp intellect, administrative capabilities, eloquence, and intellectual distinction.',
    });
  }

  // 2. Gaja Kesari Yoga: Jupiter in Kendra (1, 4, 7, 10) from Moon
  if (moon && jupiter) {
    const moonHouse = moon.house;
    const jupHouse = jupiter.house;
    const diff = ((jupiter.rashiNumber - moon.rashiNumber + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(diff)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        sanskritName: 'गजकेसरी योग',
        category: 'Auspicious',
        beneficence: 'positive',
        planetsInvolved: ['Guru', 'Chandra'],
        housesInvolved: [moonHouse, jupHouse],
        description: 'Jupiter occupies a Kendra house (1st, 4th, 7th, or 10th) from the Moon.',
        effects: 'Produces noble character, lasting reputation, high ethical standing, wisdom, and material resilience.',
      });
    }
  }

  // 3. Chandra-Mangala Yoga: Moon + Mars in same Rashi
  if (moon && mars && moon.rashiNumber === mars.rashiNumber) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      sanskritName: 'चन्द्र-मंगल योग',
      category: 'Dhana',
      beneficence: 'positive',
      planetsInvolved: ['Chandra', 'Mangala'],
      housesInvolved: [moon.house],
      description: 'Conjunction of the Moon and Mars.',
      effects: 'Enhances commercial drive, enterprise, tangible wealth accumulation, and industrious momentum.',
    });
  }

  // 4. Pancha Mahapurusha Yogas
  // Ruchaka (Mars in own/exalt in Kendra)
  if (mars && [1, 4, 7, 10].includes(mars.house) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(mars.dignity)) {
    yogas.push({
      name: 'Ruchaka Yoga',
      sanskritName: 'रुचक योग',
      category: 'Mahapurusha',
      beneficence: 'positive',
      planetsInvolved: ['Mangala'],
      housesInvolved: [mars.house],
      description: 'Mars is exalted or in own sign occupying a Kendra house.',
      effects: 'Commands courage, physical vigor, leadership prowess, authority, and tactical acumen.',
    });
  }

  // Bhadra (Mercury in own/exalt in Kendra)
  if (mercury && [1, 4, 7, 10].includes(mercury.house) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(mercury.dignity)) {
    yogas.push({
      name: 'Bhadra Yoga',
      sanskritName: 'भद्र योग',
      category: 'Mahapurusha',
      beneficence: 'positive',
      planetsInvolved: ['Budha'],
      housesInvolved: [mercury.house],
      description: 'Mercury is exalted or in own sign in a Kendra house.',
      effects: 'Grants exceptional communicative power, scholarship, strategic counsel, and longevity.',
    });
  }

  // Hamsa (Jupiter in own/exalt in Kendra)
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(jupiter.dignity)) {
    yogas.push({
      name: 'Hamsa Yoga',
      sanskritName: 'हंस योग',
      category: 'Mahapurusha',
      beneficence: 'positive',
      planetsInvolved: ['Guru'],
      housesInvolved: [jupiter.house],
      description: 'Jupiter is exalted or in own sign in a Kendra house.',
      effects: 'Endows profound spiritual wisdom, benevolence, public reverence, and philosophical nobility.',
    });
  }

  // Malavya (Venus in own/exalt in Kendra)
  if (venus && [1, 4, 7, 10].includes(venus.house) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(venus.dignity)) {
    yogas.push({
      name: 'Malavya Yoga',
      sanskritName: 'मालव्य योग',
      category: 'Mahapurusha',
      beneficence: 'positive',
      planetsInvolved: ['Shukra'],
      housesInvolved: [venus.house],
      description: 'Venus is exalted or in own sign in a Kendra house.',
      effects: 'Endows aesthetic grace, refined artistic taste, marital concord, luxuries, and magnetic charm.',
    });
  }

  // Sasa (Saturn in own/exalt in Kendra)
  if (saturn && [1, 4, 7, 10].includes(saturn.house) && ['Exalted', 'Own Sign', 'Moolatrikona'].includes(saturn.dignity)) {
    yogas.push({
      name: 'Sasa Yoga',
      sanskritName: 'शश योग',
      category: 'Mahapurusha',
      beneficence: 'positive',
      planetsInvolved: ['Shani'],
      housesInvolved: [saturn.house],
      description: 'Saturn is exalted or in own sign in a Kendra house.',
      effects: 'Yields commanding organizational authority, mastery over masses, endurance, and unyielding fortitude.',
    });
  }

  // 5. Amala Yoga: Natural Benefic (Guru, Shukra, Budha) in 10th house
  const beneficsIn10 = [jupiter, venus, mercury].filter(p => p && p.house === 10);
  if (beneficsIn10.length > 0) {
    yogas.push({
      name: 'Amala Yoga',
      sanskritName: 'अमल योग',
      category: 'Raja',
      beneficence: 'positive',
      planetsInvolved: beneficsIn10.map(p => p!.name),
      housesInvolved: [10],
      description: 'Unblemished natural benefic residing in the 10th house of profession.',
      effects: 'Brings spotless public reputation, ethical enterprise, enduring career honors, and humanitarian legacy.',
    });
  }

  return yogas;
}
