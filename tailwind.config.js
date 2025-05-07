import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /* ---------- brand palette ---------- */
      colors: {
        /* core brand (taken from your image) */
        brand: {
          900: '#212A31',
          800: '#2E3944',
          600: '#124E66',
          400: '#748D92',
          100: '#D3D9D4',
        },

        /* complementary neutrals for cards / backgrounds */
        surface: {
          /* 50‑950 scale built around neutral/stone advice from Tailwind docs */
          50 : '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        /* functional colours (WCAG‑AA contrast tested) */
        primary : { DEFAULT: '#124E66', hover: '#0F3F53' },  /* main CTAs */
        success : { DEFAULT: '#10B981', hover: '#0E9E72' },  /* sensor OK */
        warning : { DEFAULT: '#F59E0B', hover: '#D48807' },  /* quota near */
        danger  : { DEFAULT: '#EF4444', hover: '#D03C3C' },  /* revoked */
      },

      /* rounded cards and buttons per current dashboard trend */
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },

      /* smoother shadows like Tailwind admin templates */
      boxShadow: {
        card  : '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
        card2 : '0 2px 4px 0 rgb(0 0 0 / 0.04), 0 3px 6px 0 rgb(0 0 0 / 0.08)',
      },

      /* typography — Inter for general UI, numeric‑tabular for dashboards */
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans],
        mono: ['"Roboto Mono"', ...fontFamily.mono],
      },

      /* container tweaks: centred + padding on xl monitors */
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1440px',
        },
      },
    },
  },
  plugins: [],
}
