'use strict'
process.env.NODE_ENV = 'test'

process.on('unhandledRejection', err => { throw err })

require('dotenv').config()

const jest = require('jest')
const getConfig = require('../config')
const argv = process.argv.slice(2)

const configs = getConfig('test')
const config = configs.test.reduce((cfg, enhancer) => enhancer({}, cfg), {})

argv.push('--config', JSON.stringify(config))

jest.run(argv)
