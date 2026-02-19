/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '!./src/components/team/OrganizerCard.jsx'],
  theme: {
    extend: {
      colors: {
        'recap-gold': '#ffb51f',
        'recap-gray': '#D9D9D9',
        'recap-gold-light': '#FFE194',
        hopBlue: '#29A0E2'
      },
      fontFamily: {
        'anton-sc': ['"Anton SC"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif']
      }
    }
  },
  plugins: []
};
