/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées Yazaki
        yazaki: {
          primary: '#1e40af',    // Bleu principal
          secondary: '#3b82f6',  // Bleu secondaire
          accent: '#f59e0b',     // Orange accent
          dark: '#1f2937',       // Gris foncé
          light: '#f3f4f6',      // Gris clair
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
