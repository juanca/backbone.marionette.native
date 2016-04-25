webpack = require('webpack');

module.exports = {
  entry: {
    dist: './backbone.native.entry.js',
  },
  output: {
    path: __dirname,
    filename: 'backbone.native.js',
    libraryTarget: 'var',
    library: ['Backbone', 'Native'],
  },
};
