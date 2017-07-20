'use strict';

const path = require('path');

let baseConfig = require('./webpack.config.base.js');

baseConfig = Object.assign({}, baseConfig);
baseConfig.output = Object.assign({}, baseConfig.output);
baseConfig.output.path = path.resolve(baseConfig.output.path, 'client');

module.exports = baseConfig
