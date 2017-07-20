'use strict';

const path = require('path');
const spawn = require('cross-spawn');

const builder = require('../lib/builder')
const compiler = builder()

let isFirstBuild = true;
compiler.plugin('done', stats => {
  if (stats.hasErrors() || !isFirstBuild) return;
  isFirstBuild = false;
  spawn('node', [path.resolve('build', 'server', 'main')], { stdio: 'inherit' })
});
compiler.watch({}, () => {});
