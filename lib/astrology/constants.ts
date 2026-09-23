import { GrahaName, TraditionalGraha, RashiName, WesternZodiac, NakshatraName, DignityType } from '@/types/astrology';

export interface RashiInfo {
  index: number; // 0-11
  number: number; // 1-12
  name: RashiName;
  english: WesternZodiac;
  sanskrit: string;
  element: 'Agni' | 'Prithvi' | 'Vayu' | 'Jala'; // Fire, Earth, Air, Water
  modality: 'Chara' | 'Sthira' | 'Dvisvabhava'; // Movable, Fixed, Dual
  lord: TraditionalGraha;
  symbol: string;
}

export const RASHIS: RashiInfo[] = [
  { index: 0, number: 1, name: 'Mesha', english: 'Aries', sanskrit: 'मेष', element: 'Agni', modality: 'Chara', lord: 'Mangala', symbol: '♈' },
  { index: 1, number: 2, name: 'Vrishabha', english: 'Taurus', sanskrit: 'वृषभ', element: 'Prithvi', modality: 'Sthira', lord: 'Shukra', symbol: '♉' },
  { index: 2, number: 3, name: 'Mithuna', english: 'Gemini', sanskrit: 'मिथुन', element: 'Vayu', modality: 'Dvisvabhava', lord: 'Budha', symbol: '♊' },
  { index: 3, number: 4, name: 'Karka', english: 'Cancer', sanskrit: 'कर्क', element: 'Jala', modality: 'Chara', lord: 'Chandra', symbol: '♋' },
  { index: 4, number: 5, name: 'Simha', english: 'Leo', sanskrit: 'सिंह', element: 'Agni', modality: 'Sthira', lord: 'Surya', symbol: '♌' },
  { index: 5, number: 6, name: 'Kanya', english: 'Virgo', sanskrit: 'कन्या', element: 'Prithvi', modality: 'Dvisvabhava', lord: 'Budha', symbol: '♍' },
  { index: 6, number: 7, name: 'Tula', english: 'Libra', sanskrit: 'तुला', element: 'Vayu', modality: 'Chara', lord: 'Shukra', symbol: '♎' },
  { index: 7, number: 8, name: 'Vrishchika', english: 'Scorpio', sanskrit: 'वृश्चिक', element: 'Jala', modality: 'Sthira', lord: 'Mangala', symbol: '♏' },
  { index: 8, number: 9, name: 'Dhanu', english: 'Sagittarius', sanskrit: 'धनु', element: 'Agni', modality: 'Dvisvabhava', lord: 'Guru', symbol: '♐' },
  { index: 9, number: 10, name: 'Makara', english: 'Capricorn', sanskrit: 'मकर', element: 'Prithvi', modality: 'Chara', lord: 'Shani', symbol: '♑' },
  { index: 10, number: 11, name: 'Kumbha', english: 'Aquarius', sanskrit: 'कुम्भ', element: 'Vayu', modality: 'Sthira', lord: 'Shani', symbol: '♒' },
  { index: 11, number: 12, name: 'Meena', english: 'Pisces', sanskrit: 'मीन', element: 'Jala', modality: 'Dvisvabhava', lord: 'Guru', symbol: '♓' }
];

export interface NakshatraInfo {
  index: number; // 0-26
  number: number; // 1-27
  name: NakshatraName;
  sanskrit: string;
  lord: TraditionalGraha;
  deity: string;
  startDegree: number; // 0 to 360
  endDegree: number;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, number: 1, name: 'Ashwini', sanskrit: 'अश्विनी', lord: 'Ketu', deity: 'Ashwini Kumaras', startDegree: 0, endDegree: 13.333333 },
  { index: 1, number: 2, name: 'Bharani', sanskrit: 'भरणी', lord: 'Shukra', deity: 'Yama', startDegree: 13.333333, endDegree: 26.666667 },
  { index: 2, number: 3, name: 'Krittika', sanskrit: 'कृत्तिका', lord: 'Surya', deity: 'Agni', startDegree: 26.666667, endDegree: 40.0 },
  { index: 3, number: 4, name: 'Rohini', sanskrit: 'रोहिणी', lord: 'Chandra', deity: 'Brahma', startDegree: 40.0, endDegree: 53.333333 },
  { index: 4, number: 5, name: 'Mrigashira', sanskrit: 'मृगशिरा', lord: 'Mangala', deity: 'Soma', startDegree: 53.333333, endDegree: 66.666667 },
  { index: 5, number: 6, name: 'Ardra', sanskrit: 'आर्द्रा', lord: 'Rahu', deity: 'Rudra', startDegree: 66.666667, endDegree: 80.0 },
  { index: 6, number: 7, name: 'Punarvasu', sanskrit: 'पुनर्वसु', lord: 'Guru', deity: 'Aditi', startDegree: 80.0, endDegree: 93.333333 },
  { index: 7, number: 8, name: 'Pushya', sanskrit: 'पुष्य', lord: 'Shani', deity: 'Brihaspati', startDegree: 93.333333, endDegree: 106.666667 },
  { index: 8, number: 9, name: 'Ashlesha', sanskrit: 'आश्लेषा', lord: 'Budha', deity: 'Sarpa', startDegree: 106.666667, endDegree: 120.0 },
  { index: 9, number: 10, name: 'Magha', sanskrit: 'मघा', lord: 'Ketu', deity: 'Pitris', startDegree: 120.0, endDegree: 133.333333 },
  { index: 10, number: 11, name: 'Purva Phalguni', sanskrit: 'पूर्व फाल्गुनी', lord: 'Shukra', deity: 'Bhaga', startDegree: 133.333333, endDegree: 146.666667 },
  { index: 11, number: 12, name: 'Uttara Phalguni', sanskrit: 'उत्तर फाल्गुनी', lord: 'Surya', deity: 'Aryaman', startDegree: 146.666667, endDegree: 160.0 },
  { index: 12, number: 13, name: 'Hasta', sanskrit: 'हस्त', lord: 'Chandra', deity: 'Savitr', startDegree: 160.0, endDegree: 173.333333 },
  { index: 13, number: 14, name: 'Chitra', sanskrit: 'चित्रा', lord: 'Mangala', deity: 'Tvashtar', startDegree: 173.333333, endDegree: 186.666667 },
  { index: 14, number: 15, name: 'Swati', sanskrit: 'स्वाती', lord: 'Rahu', deity: 'Vayu', startDegree: 186.666667, endDegree: 200.0 },
  { index: 15, number: 16, name: 'Vishakha', sanskrit: 'विशाखा', lord: 'Guru', deity: 'Indragni', startDegree: 200.0, endDegree: 213.333333 },
  { index: 16, number: 17, name: 'Anuradha', sanskrit: 'अनुराधा', lord: 'Shani', deity: 'Mitra', startDegree: 213.333333, endDegree: 226.666667 },
  { index: 17, number: 18, name: 'Jyeshtha', sanskrit: 'ज्येष्ठा', lord: 'Budha', deity: 'Indra', startDegree: 226.666667, endDegree: 240.0 },
  { index: 18, number: 19, name: 'Mula', sanskrit: 'मूल', lord: 'Ketu', deity: 'Nirriti', startDegree: 240.0, endDegree: 253.333333 },
  { index: 19, number: 20, name: 'Purva Ashadha', sanskrit: 'पूर्वाषाढ़ा', lord: 'Shukra', deity: 'Apas', startDegree: 253.333333, endDegree: 266.666667 },
  { index: 20, number: 21, name: 'Uttara Ashadha', sanskrit: 'उत्तराषाढ़ा', lord: 'Surya', deity: 'Vishvedevas', startDegree: 266.666667, endDegree: 280.0 },
  { index: 21, number: 22, name: 'Shravana', sanskrit: 'श्रवण', lord: 'Chandra', deity: 'Vishnu', startDegree: 280.0, endDegree: 293.333333 },
  { index: 22, number: 23, name: 'Dhanishta', sanskrit: 'धनिष्ठा', lord: 'Mangala', deity: 'Vasus', startDegree: 293.333333, endDegree: 306.666667 },
  { index: 23, number: 24, name: 'Shatabhisha', sanskrit: 'शतभिषा', lord: 'Rahu', deity: 'Varuna', startDegree: 306.666667, endDegree: 320.0 },
  { index: 24, number: 25, name: 'Purva Bhadrapada', sanskrit: 'पूर्वभाद्रपदा', lord: 'Guru', deity: 'Aja Ekapada', startDegree: 320.0, endDegree: 333.333333 },
  { index: 25, number: 26, name: 'Uttara Bhadrapada', sanskrit: 'उत्तरभाद्रपदा', lord: 'Shani', deity: 'Ahir Budhnya', startDegree: 333.333333, endDegree: 346.666667 },
  { index: 26, number: 27, name: 'Revati', sanskrit: 'रेवती', lord: 'Budha', deity: 'Pushan', startDegree: 346.666667, endDegree: 360.0 }
];

export interface GrahaMeta {
  name: GrahaName;
  english: string;
  sanskrit: string;
  symbol: string;
  naturalBenefic: boolean;
  exaltedRashi: RashiName;
  exaltedDegree: number;
  debilitatedRashi: RashiName;
  debilitatedDegree: number;
  moolatrikonaRashi: RashiName;
  ownRashis: RashiName[];
  friends: TraditionalGraha[];
  enemies: TraditionalGraha[];
  neutrals: TraditionalGraha[];
  vimshottariYears: number;
}

export const GRAHA_METADATA: Record<TraditionalGraha, GrahaMeta> & Record<string, GrahaMeta> = {
  Surya: {
    name: 'Surya',
    english: 'Sun',
    sanskrit: 'सूर्य',
    symbol: '☉',
    naturalBenefic: false,
    exaltedRashi: 'Mesha',
    exaltedDegree: 10,
    debilitatedRashi: 'Tula',
    debilitatedDegree: 10,
    moolatrikonaRashi: 'Simha',
    ownRashis: ['Simha'],
    friends: ['Chandra', 'Mangala', 'Guru'],
    enemies: ['Shukra', 'Shani'],
    neutrals: ['Budha'],
    vimshottariYears: 6
  },
  Chandra: {
    name: 'Chandra',
    english: 'Moon',
    sanskrit: 'चन्द्र',
    symbol: '☽',
    naturalBenefic: true,
    exaltedRashi: 'Vrishabha',
    exaltedDegree: 3,
    debilitatedRashi: 'Vrishchika',
    debilitatedDegree: 3,
    moolatrikonaRashi: 'Vrishabha',
    ownRashis: ['Karka'],
    friends: ['Surya', 'Budha'],
    enemies: [],
    neutrals: ['Mangala', 'Guru', 'Shukra', 'Shani'],
    vimshottariYears: 10
  },
  Mangala: {
    name: 'Mangala',
    english: 'Mars',
    sanskrit: 'मंगल',
    symbol: '♂',
    naturalBenefic: false,
    exaltedRashi: 'Makara',
    exaltedDegree: 28,
    debilitatedRashi: 'Karka',
    debilitatedDegree: 28,
    moolatrikonaRashi: 'Mesha',
    ownRashis: ['Mesha', 'Vrishchika'],
    friends: ['Surya', 'Chandra', 'Guru'],
    enemies: ['Budha'],
    neutrals: ['Shukra', 'Shani'],
    vimshottariYears: 7
  },
  Budha: {
    name: 'Budha',
    english: 'Mercury',
    sanskrit: 'बुध',
    symbol: '☿',
    naturalBenefic: true,
    exaltedRashi: 'Kanya',
    exaltedDegree: 15,
    debilitatedRashi: 'Meena',
    debilitatedDegree: 15,
    moolatrikonaRashi: 'Kanya',
    ownRashis: ['Mithuna', 'Kanya'],
    friends: ['Surya', 'Shukra'],
    enemies: ['Chandra'],
    neutrals: ['Mangala', 'Guru', 'Shani'],
    vimshottariYears: 17
  },
  Guru: {
    name: 'Guru',
    english: 'Jupiter',
    sanskrit: 'गुरु',
    symbol: '♃',
    naturalBenefic: true,
    exaltedRashi: 'Karka',
    exaltedDegree: 5,
    debilitatedRashi: 'Makara',
    debilitatedDegree: 5,
    moolatrikonaRashi: 'Dhanu',
    ownRashis: ['Dhanu', 'Meena'],
    friends: ['Surya', 'Chandra', 'Mangala'],
    enemies: ['Budha', 'Shukra'],
    neutrals: ['Shani'],
    vimshottariYears: 16
  },
  Shukra: {
    name: 'Shukra',
    english: 'Venus',
    sanskrit: 'शुक्र',
    symbol: '♀',
    naturalBenefic: true,
    exaltedRashi: 'Meena',
    exaltedDegree: 27,
    debilitatedRashi: 'Kanya',
    debilitatedDegree: 27,
    moolatrikonaRashi: 'Tula',
    ownRashis: ['Vrishabha', 'Tula'],
    friends: ['Budha', 'Shani'],
    enemies: ['Surya', 'Chandra'],
    neutrals: ['Mangala', 'Guru'],
    vimshottariYears: 20
  },
  Shani: {
    name: 'Shani',
    english: 'Saturn',
    sanskrit: 'शनि',
    symbol: '♄',
    naturalBenefic: false,
    exaltedRashi: 'Tula',
    exaltedDegree: 20,
    debilitatedRashi: 'Mesha',
    debilitatedDegree: 20,
    moolatrikonaRashi: 'Kumbha',
    ownRashis: ['Makara', 'Kumbha'],
    friends: ['Budha', 'Shukra'],
    enemies: ['Surya', 'Chandra', 'Mangala'],
    neutrals: ['Guru'],
    vimshottariYears: 19
  },
  Rahu: {
    name: 'Rahu',
    english: 'North Node',
    sanskrit: 'राहु',
    symbol: '☊',
    naturalBenefic: false,
    exaltedRashi: 'Vrishabha',
    exaltedDegree: 20,
    debilitatedRashi: 'Vrishchika',
    debilitatedDegree: 20,
    moolatrikonaRashi: 'Mithuna',
    ownRashis: ['Kumbha'],
    friends: ['Shukra', 'Shani', 'Budha'],
    enemies: ['Surya', 'Chandra', 'Mangala'],
    neutrals: ['Guru'],
    vimshottariYears: 18
  },
  Ketu: {
    name: 'Ketu',
    english: 'South Node',
    sanskrit: 'केतु',
    symbol: '☋',
    naturalBenefic: false,
    exaltedRashi: 'Vrishchika',
    exaltedDegree: 20,
    debilitatedRashi: 'Vrishabha',
    debilitatedDegree: 20,
    moolatrikonaRashi: 'Dhanu',
    ownRashis: ['Vrishchika'],
    friends: ['Mangala', 'Guru'],
    enemies: ['Surya', 'Chandra', 'Budha'],
    neutrals: ['Shukra', 'Shani'],
    vimshottariYears: 7
  },
  Sun: null as any,
  Moon: null as any,
  Mars: null as any,
  Mercury: null as any,
  Jupiter: null as any,
  Venus: null as any,
  Saturn: null as any,
};

GRAHA_METADATA.Sun = GRAHA_METADATA.Surya;
GRAHA_METADATA.Moon = GRAHA_METADATA.Chandra;
GRAHA_METADATA.Mars = GRAHA_METADATA.Mangala;
GRAHA_METADATA.Mercury = GRAHA_METADATA.Budha;
GRAHA_METADATA.Jupiter = GRAHA_METADATA.Guru;
GRAHA_METADATA.Venus = GRAHA_METADATA.Shukra;
GRAHA_METADATA.Saturn = GRAHA_METADATA.Shani;

export const VIMSHOTTARI_SEQUENCE: TraditionalGraha[] = [
  'Ketu',
  'Shukra',
  'Surya',
  'Chandra',
  'Mangala',
  'Rahu',
  'Guru',
  'Shani',
  'Budha'
];

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

export const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

export const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];
