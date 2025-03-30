/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/home/Team.jsx',
    './src/components/recap.jsx',
    './src/components/user_auth/Login.jsx',
    './src/components/flashback/*.jsx'
  ],
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
