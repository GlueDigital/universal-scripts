'use strict'

import { config } from 'dotenv'

config()

process.env.NODE_ENV = 'test'

process.on('unhandledRejection', (err) => {
  throw err
})

import getConfig from '../config.js'
import chalk from 'chalk'

const configs = await getConfig('test')
const testRunner = configs.test.reduce((cfg, enhancer) => enhancer({}, cfg), {})

if (typeof testRunner !== 'function') {
  console.warn(
    chalk.yellow(
      `${chalk.bold('⚠️ Error')}: No test runner configuration found. Please create a config or install ${chalk.underline('universal-plugin-jest')}.`
    )
  )
} else {
  testRunner()
}
