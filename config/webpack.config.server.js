'use strict';

const path = require('path');

let baseConfig = require('./webpack.config.base.js');

baseConfig = Object.assign({}, baseConfig);
baseConfig.target = 'node';
baseConfig.entry = baseConfig.entry.slice();
baseConfig.entry[baseConfig.entry.length - 1] =
  path.resolve(__dirname, '..', 'server', 'main');
baseConfig.output = Object.assign({}, baseConfig.output);
baseConfig.output.filename = 'server/main.js';

module.exports = baseConfig
