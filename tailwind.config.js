/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d4af7a', // INTI custom gold
        gold: '#d4af7a',
      }
    },
  },
  plugins: [],
}
