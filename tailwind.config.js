const { join } = require('path');

module.exports = {
  important: true,
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),

  ],
  theme: {
    extend: {},
  },
  plugins: [],
};