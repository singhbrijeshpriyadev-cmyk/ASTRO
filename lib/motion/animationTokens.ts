/**
 * Centralized Motion Tokens for Kaalika Vedic Observatory
 *
 * System Speed & Easing Standards:
 * - FAST: 120ms-160ms (hover, feedback, opacity)
 * - NORMAL: 180ms-260ms (cards, navigation, tabs, dropdowns)
 * - MEDIUM: 300ms-450ms (panels, page sections, chart transitions)
 * - SLOW: 600ms-1000ms (hero entrance, atmospheric reveals)
 * - VERY SLOW: 15s-30s (celestial background, nebula drift)
 */

export const motionTokens = {
  duration: {
    fast: 0.15,
    normal: 0.22,
    medium: 0.35,
    slow: 0.75,
    celestial: 22,
  },
  ease: {
    fast: [0, 0, 0.2, 1] as const, // easeOut
    standard: [0.22, 1, 0.36, 1] as const, // Default UI curve
    elegant: [0.16, 1, 0.3, 1] as const, // Celestial & luxury transitions
  },
  spring: {
    soft: {
      type: 'spring' as const,
      stiffness: 180,
      damping: 24,
      mass: 0.8,
    },
    medium: {
      type: 'spring' as const,
      stiffness: 220,
      damping: 22,
      mass: 0.7,
    },
    navigation: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 26,
      mass: 0.6,
    },
    gentleOrb: {
      type: 'spring' as const,
      stiffness: 140,
      damping: 18,
      mass: 1,
    },
  },
} as const;
