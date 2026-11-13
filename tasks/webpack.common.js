const webpack = require('webpack');

module.exports = {
  entry: [
    './oidc.js'
  ],
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: false,
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['chrome >= 39']
            },
            modules: false
          }]
        ],
        plugins: [
          ['babel-plugin-polyfill-corejs3', {
            method: 'usage-global',
            version: '3.51'
          }]
        ]
      }
    }]
  },
  externals: ['Origo'],
  resolve: {
    extensions: ['*', '.js', '.scss']
  }
};
