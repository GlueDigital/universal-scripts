'use strict'

const builder = require('../lib/builder')
const compiler = builder({ isWatch: true })

global.__WATCH__ = true // Signal to server that we're doing HMR
const server = require('../server/main')
server(compiler)
