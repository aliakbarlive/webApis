module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: [
      'bg-blue-100',
      'text-blue-800',
      'bg-indigo-100',
      'text-indigo-800',
      'bg-purple-100',
      'text-purple-800',
      'bg-pink-100',
      'text-pink-800',
      'bg-yellow-300',
      'bg-yellow-400',
      'text-green',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter'],
        reportText: ['Source Sans Pro'],
        sourceSansPro: ['Source Sans Pro', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'custom-pink': '#fb426f',
        'custom-blue': '#002f5d',
        'custom-yellow': '#f9dc7d',
        'custom-green': '#10b981',
        'custom-red': '#e11d48',
        'custom-dark-blue': '#5f727d',
        'custom-light-green': '#dce9d5',
        'custom-light-pink': '#fee3e9',
        'green-text': '#5ea962',
        'custom-success': '#00966D',
        'custom-error': '#C30000',
        'si-pink': '#FB3767',
      },
      keyframes: {
        'spinner-grow': {
          '0%': {
            opacity: 0,
            transform: 'scale(0)',
          },
          '50%': {
            opacity: 1,
            transform: 'none',
          },
          '100%': {
            opacity: 0,
          },
        },
      },
      animation: {
        'spinner-grow': 'spinner-grow .75s linear infinite',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      display: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
