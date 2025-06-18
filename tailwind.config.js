/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        chakra: ['"Chakra Petch"', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-3deg)' }
        },
        'slide-left': {
          '0%': { transform: 'translateX(25%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(-25%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'slide-left': 'slide-left 0.15s ease-out',
        'slide-right': 'slide-right 0.15s ease-out'
      },
      transitionProperty: {
        'transform': 'transform',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}