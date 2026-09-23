import { motionTokens } from './animationTokens';

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: motionTokens.duration.medium,
      ease: motionTokens.ease.standard,
    }
  },
  exit: { 
    opacity: 0, 
    y: -6,
    transition: {
      duration: 0.18,
      ease: motionTokens.ease.fast,
    }
  },
};

export const cardHoverTransition = {
  rest: {
    y: 0,
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.40)',
    borderColor: 'rgba(212, 175, 55, 0.22)',
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.standard,
    },
  },
  hover: {
    y: -2,
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.50), 0 0 20px rgba(212, 175, 55, 0.08)',
    borderColor: 'rgba(212, 175, 55, 0.40)',
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.standard,
    },
  },
};

export const modalBackdropTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalPanelTransition = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 240,
      damping: 24,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 8,
    transition: { duration: 0.18, ease: motionTokens.ease.fast }
  },
};

export const chartViewTransition = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: motionTokens.duration.medium,
      ease: motionTokens.ease.elegant,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.985,
    transition: {
      duration: 0.2,
      ease: motionTokens.ease.fast,
    }
  },
};
