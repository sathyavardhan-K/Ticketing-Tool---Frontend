/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        lavender: '#E6E6FA', // Light lavender color
        'lavender-dark': '#D8BFD8', // Darker lavender color
      },
    },
  },
  plugins: [],
}