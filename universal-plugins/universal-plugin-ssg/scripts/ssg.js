'use strict'
import 'dotenv/config'
import spawn from 'cross-spawn'
import { realpathSync } from 'fs'

// Babel will complain if no NODE_ENV. Set it if needed.
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

import chalk from 'chalk'

import fs from 'fs-extra'

fs.remove('./build/')

global.__WATCH__ = false // Signal to server that we are not doing HMR
global.__SSG__ = true

const builder = (await import('universal-scripts/lib/builder.js')).default

const compiler = await builder({
  ssg: true
})

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
  const appDirectory = realpathSync(process.cwd())
  const result = spawn.sync(
    'node',
    [`${appDirectory}/build/server/server.js`],
    {
      stdio: 'inherit'
    }
  )
  process.exit(result.status)
})
