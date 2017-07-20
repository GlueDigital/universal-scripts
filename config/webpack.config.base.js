'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: [
    // TODO: dev server
    path.resolve(appDirectory, 'src', 'index.js')
  ],
  output: {
    path: path.resolve(appDirectory, 'build'),
    pathinfo: true,
    filename: 'client/main.js',
    publicPath: '/',
  }
};
