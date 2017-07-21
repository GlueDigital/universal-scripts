'use strict';

const path = require('path');

let baseConfig = require('./webpack.config.base.js');

baseConfig = Object.assign({}, baseConfig);
baseConfig.name = 'server';
baseConfig.target = 'node';
baseConfig.entry = baseConfig.entry.slice();
baseConfig.entry[baseConfig.entry.length - 1] =
  path.resolve(__dirname, '..', 'server', 'lib', 'routerMiddleware');
baseConfig.output = Object.assign({}, baseConfig.output);
baseConfig.output.path = path.resolve(baseConfig.output.path, 'server');
baseConfig.output.filename = 'server.js';

module.exports = baseConfig
