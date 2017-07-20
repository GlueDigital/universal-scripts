'use strict';

const path = require('path');
const spawn = require('cross-spawn');

const builder = require('../lib/builder')
const compiler = builder()

let isFirstBuild = true;
compiler.plugin('done', stats => {
  if (stats.hasErrors() || !isFirstBuild) return;
  isFirstBuild = false;
  const entryPoint = path.resolve('build', 'server', 'main');
  const child = spawn('node', [entryPoint], { stdio: 'inherit' });
  child.on('exit', (code) => {
    console.log('Child process exited with code:', code);
  });
});
compiler.watch({}, () => {});
