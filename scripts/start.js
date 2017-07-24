'use strict'

const builder = require('../lib/builder')
const compiler = builder()

const server = require('../server/main')
server(compiler)
