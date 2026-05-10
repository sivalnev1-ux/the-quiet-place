/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F6F2E8',
        'cream-dark': '#DED6C4',
        green: '#10362D',
        'green-light': '#1a5044',
        'green-dark': '#0a2018',
        gold: '#B08A3B',
        'gold-light': '#d4ae6a',
        'gold-dark': '#8a6a28',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
