'use strict'
require('dotenv').config()

// Babel will complain if no NODE_ENV. Set it if needed.
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const builder = require('../lib/builder')
const compiler = builder({ isWatch: true })

global.__WATCH__ = true // Signal to server that we're doing HMR
const server = require('../server/main')
server(compiler)
