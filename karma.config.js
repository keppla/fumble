var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],

    reporters: ['spec'],

    port: 9876,
    colors: false,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      {
        pattern: '**/*.ts',
        type: 'js'  // to silence the warning. Means load with <script> tag
      },
    ],

    preprocessors: {
//      './dist/bundle.js': ['webpack'],
      './spec/*.ts': ['karma-typescript'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  });
}
