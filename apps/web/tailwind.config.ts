import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f8ff',
          100: '#e0f0fe',
          500: '#7cb9e8', // Pastel blue
          600: '#5c9bd1',
          700: '#3e7eb9',
        },
        background: '#f4f9ff', // Light pastel background
      },
      fontFamily: {
        sans: [
          '"SF Pro"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Sukhumvit Set"',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        marker: ['var(--font-marker)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
