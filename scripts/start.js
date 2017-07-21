'use strict';

const path = require('path');
const spawn = require('cross-spawn');

const builder = require('../lib/builder')
const compiler = builder()

const server = require('../server/main')
server(compiler)
