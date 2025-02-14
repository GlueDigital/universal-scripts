'use strict'
import { config } from 'dotenv'

config()

// Babel will complain if no NODE_ENV. Set it if needed.
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

import chalk from 'chalk'

import fs from 'fs-extra'
fs.remove('./build/')

const builder = (await import('../lib/builder.js')).default

const compiler = await builder()
compiler.run((err, stats) => {
  let hasErrors = err
  if (!stats) {
    console.log(err)
    console.log(chalk.red.bold('\nBuild failed.\n'))
    process.exit(1)
  }
  for (const build of stats.stats) {
    if (build.compilation.errors && build.compilation.errors.length) {
      hasErrors = true
      break
    }
  }
  if (hasErrors) {
    console.log(chalk.red.bold('\nBuild failed.\n'))
    process.exit(1)
  }
})
