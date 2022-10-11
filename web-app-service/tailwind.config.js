module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
