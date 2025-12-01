/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yazaki-blue': '#003DA5',
        'yazaki-orange': '#FF6B35',
        'yazaki-light-blue': '#0066CC',
        'yazaki-dark-blue': '#002B73',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
