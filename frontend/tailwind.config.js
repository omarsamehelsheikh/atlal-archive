/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EAB308', // Atlal Yellow
        dark: '#0A0A0A',    // Atlal Black
      }
    },
  },
  plugins: [],
}