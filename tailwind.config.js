/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        backgroundImage: {
          'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        },
        sans: ['Inter', 'sans-serif'], // or 'Poppins', etc.
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwind-scrollbar-hide'),
    
  ],
};
