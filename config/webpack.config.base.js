'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: [
    path.resolve(appDirectory, 'src', 'index.js')
  ],
  output: {
    path: path.resolve(appDirectory, 'build'),
    pathinfo: true,
    filename: 'main.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      'any-promise': 'core-js/fn/promise' // Prevents warning on webpack
    },
    extensions: ['.js', 'jsx'],
    modules: [
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(appDirectory, 'node_modules'),
      appDirectory
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ quiet: true }),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [require.resolve('babel-preset-react-app')],
          cacheDirectory: true,
        }
      }
    ]
  }
};
