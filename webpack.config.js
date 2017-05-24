const path = require('path');

module.exports = {
  entry: {
    simple: './lib/js/simpleRoot.js',
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'bundle.js',
  },
};
