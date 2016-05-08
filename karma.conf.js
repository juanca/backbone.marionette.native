webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};
webpackConfig.externals = {};
webpackConfig.plugins = [];

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: [],

    files: [
      './specs/helpers.js',
      './specs/**/*.js'
    ],

    preprocessors: {
      './specs/**/*.js': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
