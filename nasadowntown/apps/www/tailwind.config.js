const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        black: 'var(--color-black)',
        'lavender-web': 'var(--color-lavender-web)',
        jet: 'var(--color-jet)',
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
        smooch: ['Smooch Sans', 'serif'],
      },
    },
  },
  plugins: [],
};
