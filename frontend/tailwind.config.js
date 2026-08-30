/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // پالت روشن: کرم / قهوه‌ای / طلایی
        cream: {
          50: '#FDFBF7',
          100: '#F8F2E7',
          200: '#F0E6D2',
          300: '#E5D3B3',
        },
        brown: {
          400: '#A97C50',
          500: '#8B5E3C',
          600: '#6B4226',
          700: '#4E2F1B',
          800: '#3A2313',
        },
        gold: {
          300: '#E8C97A',
          400: '#D4AF37',
          500: '#C9A227',
          600: '#B08A1E',
        },
        // پالت تیره: فقط سرمه‌ای + طلایی + نقره‌ای
        navy: {
          DEFAULT: '#1F2937',
          light: '#2A3646',
          dark: '#161D28',
        },
        silver: {
          200: '#F1F1F1',
          300: '#E6E6E6',
          400: '#C7C7C7',
          500: '#A8A8A8',
        },
        primary: '#C9A227',
        'primary-dark': '#D4AF37',
        secondary: '#6B4226',
        accent: '#F8F2E7',
        dark: '#1F2937',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #C9A227 50%, #B08A1E 100%)',
        'metallic-dark': 'linear-gradient(135deg, #1F2937 0%, #161D28 60%, #2A3646 100%)',
        'hero-gradient': 'linear-gradient(135deg, #4E2F1B 0%, #8B5E3C 40%, #C9A227 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212,175,55,0.35)',
      },
      keyframes: {
        blinkGlow: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 8px rgba(212,175,55,0.6)' },
          '50%': { opacity: '0.55', textShadow: '0 0 2px rgba(212,175,55,0.1)' },
        },
      },
      animation: {
        'blink-glow': 'blinkGlow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}