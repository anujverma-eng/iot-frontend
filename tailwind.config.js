// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Royal Blue Theme
        primary: {
          50: '#e8f1ff',
          100: '#d0e0ff',
          200: '#a8c7ff',
          300: '#7aa8ff',
          400: '#4d88ff',
          500: '#1f69ff',
          600: '#004de6',
          700: '#003cb3',
          800: '#002b80',
          900: '#001a4d',
        },
        // Complementary Colors
        secondary: colors.indigo,
        accent: colors.teal,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
        // Dark Theme Surface Colors
        surface: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1e21',
        },
      },
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans],
        mono: ['"Roboto Mono"', ...fontFamily.mono],
        heading: ['"Space Grotesk"', ...fontFamily.sans],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      boxShadow: {
        'depth-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'depth-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'inner-xl': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.15)',
      },
      letterSpacing: {
        tight: '-0.025em',
        tighter: '-0.05em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    function({ addComponents }) {
      addComponents({
        '.dashboard-card': {
          '@apply bg-white dark:bg-surface-800 rounded-xl p-6 shadow-depth-1 hover:shadow-depth-2 transition-shadow': {},
        },
        '.data-widget': {
          '@apply dashboard-card p-4 bg-gradient-to-br from-primary-700/10 to-primary-400/5': {},
        },
        '.nav-link': {
          '@apply flex items-center px-4 py-3 text-sm rounded-lg hover:bg-surface-200/50 dark:hover:bg-surface-700 transition-colors': {},
        },
        '.sensor-status': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
      })
    },
  ],
}