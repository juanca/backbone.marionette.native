webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};
webpackConfig.plugins = [];

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Chrome', 'PhantomJS'],

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
