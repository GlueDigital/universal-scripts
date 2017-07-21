'use strict';

const path = require('path');

let baseConfig = require('./webpack.config.base.js');

baseConfig = Object.assign({}, baseConfig);
baseConfig.name = 'client';
baseConfig.entry = baseConfig.entry.slice();
baseConfig.entry.unshift('webpack-hot-middleware/client?name=client');
baseConfig.output = Object.assign({}, baseConfig.output);
baseConfig.output.path = path.resolve(baseConfig.output.path, 'client');

module.exports = baseConfig
