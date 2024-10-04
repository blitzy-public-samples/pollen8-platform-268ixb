const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // Purge unused styles in production
  purge: [
    './src/frontend/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',
  ],
  
  // Enable dark mode (using class strategy for more control)
  darkMode: 'class',
  
  // Extend and customize the default Tailwind theme
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          100: '#F7F7F7',
          200: '#E6E6E6',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Proxima Nova', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
    },
  },
  
  // Extend the default variants
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'group-focus'],
      textColor: ['active', 'group-focus'],
      borderColor: ['active', 'group-focus'],
    },
  },
  
  // Include additional plugins
  plugins: [
    require('@tailwindcss/forms'),
  ],
};