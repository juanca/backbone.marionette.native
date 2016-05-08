webpack = require('webpack');

module.exports = {
  entry: {
    dist: './backbone.native.entry.js',
  },
  externals: {
    backbone: 'Backbone'
  },
  output: {
    path: __dirname,
    filename: 'backbone.native.js',
    libraryTarget: 'window',
    library: 'jQuery',
  },
  plugins: [
    new webpack.ProvidePlugin({
      Backbone: 'backbone'
    }),
  ],
};
