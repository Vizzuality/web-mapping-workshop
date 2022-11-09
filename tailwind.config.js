const aspectRatio = require('@tailwindcss/aspect-ratio');
const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');

/**
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  content: ['./src/components/**/*.@(tsx|ts)', './src/exercises/**/*.@(tsx|ts)'],
  plugins: [aspectRatio, forms, lineClamp],
};
