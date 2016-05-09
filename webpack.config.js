webpack = require('webpack');

module.exports = {
  entry: {
    dist: './backbone.marionette.native.entry.js',
  },
  externals: {
    backbone: 'Backbone'
  },
  output: {
    path: __dirname,
    filename: 'backbone.marionette.native.js',
    libraryTarget: 'window',
    library: 'jQuery',
  },
  plugins: [
    new webpack.ProvidePlugin({
      Backbone: 'backbone'
    }),
  ],
};
