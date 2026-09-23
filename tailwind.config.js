/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#061411',
        kaalika: {
          bg: '#061411',
          'bg-mid': '#0B211B',
          'bg-deep': '#102A23',
          surface: '#0B211B',
          'surface-deep': '#102A23',
          'surface-deeper': '#102A23',
          peacock: '#006B5B',
          'peacock-mid': '#006B5B',
          emerald: '#009B77',
          gold: '#D4AF37',
          'gold-soft': '#F2D675',
          text: '#F5F4EC',
          'text-secondary': '#AABDB7',
          'text-muted': '#AABDB7',
        },
        surface: {
          DEFAULT: '#0B211B',
          deep: '#102A23',
        },
        peacock: {
          DEFAULT: '#006B5B',
          mid: '#006B5B',
          dark: '#061411',
        },
        emerald: {
          DEFAULT: '#009B77',
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#F2D675',
          muted: 'rgba(212, 175, 55, 0.4)',
        },
        vedic: {
          bg: '#061411',
          secondary: '#0B211B',
          surface: '#102A23',
          peacock: '#006B5B',
          emerald: '#009B77',
          muted: '#AABDB7',
          gold: '#D4AF37',
          'gold-soft': '#F2D675',
          text: '#F5F4EC',
          'text-secondary': '#AABDB7',
        },
      },
      borderColor: {
        'glass-border': 'rgba(255, 255, 255, 0.16)',
        'glass-gold': 'rgba(212, 175, 55, 0.28)',
        'vedic-gold-border': 'rgba(212, 175, 55, 0.20)',
        'vedic-gold-border-bright': 'rgba(212, 175, 55, 0.45)',
        gold: 'rgba(212, 175, 55, 0.25)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'liquid-dock': '0 20px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        'liquid-card': '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(212, 175, 55, 0.22)',
        'center-orb': '0 0 35px rgba(212, 175, 55, 0.25), 0 8px 24px rgba(0, 0, 0, 0.6)',
        'vedic-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.16)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.18)',
      },
      borderRadius: {
        'dock': '32px',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
