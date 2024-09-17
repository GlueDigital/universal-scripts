require('dotenv').config()
const chalk = require('chalk')
const fs = require('fs')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const path = require('path')
const requireFromString = require('require-from-string')
const config = require('../config')
const cookieParser = require('cookie-parser');

const appDirectory = fs.realpathSync(process.cwd())
const port = process.env.PORT || 3000

// Do we need HMR?
let configureHMR
if (__WATCH__) {
  // We need to hot-reload serverMiddleware, but we're the ones building it.
  let serverMiddleware = null

  const loadServerMiddlewareProxy = (app) => {
    if (serverMiddleware) {
      app.use(serverMiddleware.shift())
      app.use(serverMiddleware.shift())
      async function myAwesomeMiddleware(req, res) {
        const copy = [...serverMiddleware]
        const next = () => {
          const mw = copy.shift()
          return !mw ? null : mw(req, res, next)
        }
        await next()
      }
      app.use(myAwesomeMiddleware)
    } else {
      console.log('Request received, but no middleware loaded yet')
    }
  }

  configureHMR = (app, compiler) => {
    // Enable DEV middleware
    const devMiddleware = webpackDevMiddleware(compiler, {
      stats: 'normal',
      publicPath: '/',
      serverSideRender: true,
    })

    const hotMiddleware = webpackHotMiddleware(compiler.compilers[0])

    app.use(devMiddleware)
    app.use(hotMiddleware)

    app.use((req, res, next) => {
      req.clientStats = devMiddleware.context.stats.toJson().children[0]
      next()
    })

    // Add hook to compiler to reload server middleware on rebuild
    const mfs = devMiddleware.context.outputFileSystem
    const plugin = { name: 'universal-scripts' }
    compiler.hooks.done.tap(plugin, async stats => {
      const fname = path.resolve(appDirectory, 'build', 'server', 'server.js')
      try {
        const newMiddleware = mfs.readFileSync(fname).toString()
        const mw = requireFromString(newMiddleware, fname)
        await mw.startup()
        serverMiddleware = mw.default
        loadServerMiddlewareProxy(app)
      } catch (e) {
        console.warn(chalk.red.bold('Couldn\'t load middleware.'))
        console.log(chalk.red('Please fix any build errors above, and ' +
          'it will auto-reload.'))
        console.log('Details:', e)
      }
    })
  }
}

const serve = async (compiler) => {
  console.log(chalk.green('Starting server.'))
  const app = express()

  app.use(cookieParser())

  // Run anything on the `app` hook
  config.app && config.app.forEach(f => f(app))

  if (__WATCH__) {
    // Add the HMR and Dev Server middleware
    await configureHMR(app, compiler)
  } else {
    // Add the server-side rendering middleware (no HMR)
    const mw = require('./serverMiddleware')
    await mw.startup()
    app.use(mw.default)
  }

  // Wrap it up
  app.listen(port)
  console.log(
    chalk.green('Server running at:'),
    chalk.cyan.bold('http://localhost:' + port)
  )
}

if (!__WATCH__) {
  // On static build, this is the entry point, so for it to actually run,
  // we must call the exported function
  serve()
} else {
  module.exports = serve
}
