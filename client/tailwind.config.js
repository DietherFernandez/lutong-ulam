/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e7',
          100: '#fde2c4',
          200: '#fbc28a',
          300: '#f9a050',
          400: '#f67f17',
          500: '#e0660d',
          600: '#bf4f08',
          700: '#993c08',
          800: '#7a310b',
          900: '#64280d',
        },
        accent: {
          50: '#fef6e7',
          100: '#fee9c0',
          200: '#fcd089',
          300: '#fbb351',
          400: '#f99326',
          500: '#ef7c11',
          600: '#d65f08',
          700: '#b14808',
          800: '#90390e',
          900: '#74300f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}