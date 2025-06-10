// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './node_modules/react-toastify/dist/ReactToastify.css',
  ],
  theme: {
    extend: {
      colors: {
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
        'neon-blue': '#1f51ff',
        'neon-green': '#39ff14',
        'neon-pink': '#ff007f',
        'neon-purple': '#9400d3',
        'neon-orange': '#ff4500',
        'neon-yellow': '#ffff33',
        'dark-bg': '#0f172a',
        'darker-bg': '#0a0f1f',
      },

      
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        neon: '0 0 10px currentColor, 0 0 20px currentColor',
        'neon-blue': '0 0 10px #1f51ff, 0 0 20px #1f51ff',
        'neon-green': '0 0 10px #39ff14, 0 0 20px #39ff14',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s infinite alternate',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
