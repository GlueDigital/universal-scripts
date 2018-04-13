'use strict'

// Babel will complain if no NODE_ENV. Set it if needed.
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const chalk = require('chalk')

const builder = require('../lib/builder')

const compiler = builder()
compiler.run((err, stats) => {
  let hasErrors = err
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
