/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#FF9D10', soft: '#FFB547', deep: '#E07F00' },
        ink: { 950: '#0F1110', 900: '#141615', 800: '#1E201F', 700: '#2A2D2B' },
      },
      fontFamily: {
        display: ['"Krona One"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        ring: { '0%': { transform: 'scale(1)', opacity: '.6' }, '100%': { transform: 'scale(1.8)', opacity: '0' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        ring: 'ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}