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
        // ── Page background ───────────────────────────────────────
        background: '#03100A',

        // ── Kaalika 4-color gem token system ─────────────────────
        kaalika: {
          // Backgrounds
          bg:              '#03100A',
          'bg-mid':        '#071A10',
          'bg-deep':       '#0C2218',
          surface:         '#071A10',
          'surface-deep':  '#0C2218',
          'surface-deeper':'#0C2218',

          // Jade Green — primary accent
          jade:            '#00A878',
          'jade-light':    '#2DDBA0',
          'jade-deep':     '#006B4A',

          // Pine Green — secondary accent
          pine:            '#2D6A4F',
          'pine-light':    '#52B788',
          'pine-deep':     '#1B4332',

          // Sapphire Blue — tertiary
          sapphire:        '#0F52BA',
          'sapphire-light':'#7EB8FF',
          'sapphire-deep': '#082060',

          // Slate Blue — quaternary
          slate:           '#3D405B',
          'slate-light':   '#B8ADFF',
          'slate-deep':    '#1A1850',

          // Preserved gold for ornaments/headings
          gold:            '#D4AF37',
          'gold-soft':     '#F2D675',

          // Text
          text:            '#EFF6F2',
          'text-secondary':'#8BB5A8',
          'text-muted':    '#6A9A8C',

          // Legacy aliases (for backward compat with existing components)
          peacock:         '#00A878',   // → jade
          'peacock-mid':   '#00A878',
          emerald:         '#52B788',   // → pine-light
        },

        // ── Standalone aliases ────────────────────────────────────
        surface: {
          DEFAULT: '#071A10',
          deep:    '#0C2218',
        },
        jade: {
          DEFAULT: '#00A878',
          light:   '#2DDBA0',
          dark:    '#006B4A',
        },
        pine: {
          DEFAULT: '#2D6A4F',
          light:   '#52B788',
          dark:    '#1B4332',
        },
        sapphire: {
          DEFAULT: '#0F52BA',
          light:   '#7EB8FF',
          dark:    '#082060',
        },
        'slate-blue': {
          DEFAULT: '#3D405B',
          light:   '#B8ADFF',
          dark:    '#1A1850',
        },
        // Legacy
        peacock: {
          DEFAULT: '#00A878',
          mid:     '#00A878',
          dark:    '#03100A',
        },
        emerald: {
          DEFAULT: '#52B788',
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft:    '#F2D675',
          muted:   'rgba(212, 175, 55, 0.4)',
        },
        vedic: {
          bg:               '#03100A',
          secondary:        '#071A10',
          surface:          '#0C2218',
          peacock:          '#00A878',
          emerald:          '#52B788',
          muted:            '#8BB5A8',
          gold:             '#D4AF37',
          'gold-soft':      '#F2D675',
          text:             '#EFF6F2',
          'text-secondary': '#8BB5A8',
        },
      },
      borderColor: {
        'glass-border':            'rgba(0, 200, 140, 0.18)',
        'glass-jade':              'rgba(0, 168, 120, 0.30)',
        'glass-sapphire':          'rgba(15, 82, 186, 0.30)',
        'glass-gold':              'rgba(212, 175, 55, 0.25)',
        'vedic-gold-border':       'rgba(212, 175, 55, 0.20)',
        'vedic-gold-border-bright':'rgba(212, 175, 55, 0.45)',
        gold:                      'rgba(212, 175, 55, 0.25)',
      },
      fontFamily: {
        serif:     ['Cormorant Garamond', 'Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        cinzel:    ['Cinzel', 'serif'],
        sans:      ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:      ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'liquid-dock': '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,200,140,0.14)',
        'liquid-card': '0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,168,120,0.20)',
        'center-orb':  '0 0 35px rgba(0,168,120,0.28), 0 8px 24px rgba(0,0,0,0.6)',
        'vedic-card':  '0 4px 20px -2px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,168,120,0.18)',
        'jade-glow':   '0 0 25px rgba(0,168,120,0.22)',
        'sapphire-glow':'0 0 25px rgba(15,82,186,0.22)',
        'gold-glow':   '0 0 25px rgba(212,175,55,0.18)',
      },
      borderRadius: {
        dock: '32px',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
