import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#212A31',
          800: '#2E3944',
          600: '#124E66',
          400: '#748D92',
          100: '#D3D9D4',
        },
      },
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
