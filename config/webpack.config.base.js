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
    extensions: ['.js', 'jsx', 'es6'],
    modules: [
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(appDirectory, 'node_modules'),
      appDirectory
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ quiet: true }),
    new webpack.NamedModulesPlugin()
  ]
};
