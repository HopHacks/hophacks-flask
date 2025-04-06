/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'recap-gold': '#ffb51f',
        'recap-gray': '#D9D9D9',
        'recap-gold-light': '#FFE194'
      },
      fontFamily: {
        'anton-sc': ['"Anton SC"', 'sans-serif']
      }
    }
  },
  plugins: []
};
