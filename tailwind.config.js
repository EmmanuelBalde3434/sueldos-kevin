/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,   // 👈 fuerza modo claro, sin importar tu sistema
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#5458e6',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
