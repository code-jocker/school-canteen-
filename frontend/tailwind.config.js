/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rwanda: {
          blue: '#002B7F',
          yellow: '#FFD100',
          green: '#007A33',
          light: '#F5F5F5',
          dark: '#212121',
        }
      }
    },
  },
  plugins: [],
}
