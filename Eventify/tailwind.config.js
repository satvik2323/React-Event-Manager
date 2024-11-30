module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Dark blue
        secondary: '#3B82F6', // Light blue
        accent: '#F59E0B', // Yellow
        background: '#F3F4F6', // Light gray
        textPrimary: '#111827', // Dark gray
        textSecondary: '#6B7280', // Gray
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
