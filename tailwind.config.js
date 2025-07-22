/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        'logo-fade': {
          '0%': { opacity: '0', transform: 'scale(0.9) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        }
      },
      animation: {
        'logo-fade': 'logo-fade 1.2s ease-out forwards',
        'logo-pulse': 'pulse 6s infinite'
      }
    }
  },
  plugins: [],
}
