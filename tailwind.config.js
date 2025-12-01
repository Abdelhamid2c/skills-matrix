/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs Yazaki basées sur le logo
        'yazaki-red': '#E31E24',
        'yazaki-dark-red': '#B91C1C',
        'yazaki-black': '#1F2937',
        'yazaki-gray': '#6B7280',
        'yazaki-light-gray': '#F3F4F6',

        // Anciennes couleurs (gardées pour compatibilité)
        'yazaki-blue': '#003DA5',
        'yazaki-orange': '#FF6B35',
        'yazaki-light-blue': '#0066CC',
        'yazaki-dark-blue': '#002B73',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'yazaki': '0 4px 6px -1px rgba(227, 30, 36, 0.1), 0 2px 4px -1px rgba(227, 30, 36, 0.06)',
      },
    },
  },
  plugins: [],
}
