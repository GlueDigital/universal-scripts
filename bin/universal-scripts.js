#!/usr/bin/env node

'use strict';

// This script just executes the appropiate script on the scripts folder.
const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);

const result = spawn.sync(
  'node',
  [require.resolve('../scripts/' + script)].concat(args),
  { stdio: 'inherit' }
);
process.exit(result.status);
