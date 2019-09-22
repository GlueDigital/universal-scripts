require('dotenv').config()
const chalk = require('chalk')
const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const requireFromString = require('require-from-string')
const config = require('../config')

const appDirectory = fs.realpathSync(process.cwd())
const port = process.env.PORT || 3000

// Do we need HMR?
let configureHMR
if (__WATCH__) {
  // We need to hot-reload routerMiddleware, but we're the ones building it.
  const koaWebpack = require('koa-webpack')
  let routerMiddleware = null

  const routerMiddlewareProxy = (ctx, next) => {
    if (routerMiddleware) {
      return routerMiddleware(ctx, next)
    } else {
      console.log('Request received, but no middleware loaded yet')
    }
  }

  configureHMR = async (app, compiler) => {
    // Enable DEV middleware
    const koaWebpackInstance = await koaWebpack({
      compiler: compiler,
      devMiddleware: {
        publicPath: '/',
        serverSideRender: true,
        logLevel: 'warn',
        stats: false
      },
      hotClient: {
        logLevel: 'warn'
      }
    })
    app.use(koaWebpackInstance)

    // Add hook to compiler to reload router middleware on rebuild
    const mfs = koaWebpackInstance.devMiddleware.fileSystem
    const plugin = { name: 'universal-scripts' }
    compiler.hooks.done.tap(plugin, stats => {
      const fname = path.resolve(appDirectory, 'build', 'server', 'server.js')
      try {
        const newMiddleware = mfs.readFileSync(fname).toString()
        routerMiddleware = requireFromString(newMiddleware).default
      } catch (e) {
        console.warn(chalk.red.bold('Couldn\'t load middleware.'))
        console.log(chalk.red('Please fix any build errors above, and ' +
          'it will auto-reload.'))
        console.log('Details:', e)
      }
    })

    // Finally add the router middleware too (through proxy so it can reload)
    app.use(routerMiddlewareProxy)
  }
}

const serve = async (compiler) => {
  console.log(chalk.green('Starting server.'))
  const app = new Koa()

  if (__WATCH__) {
    // Add the HMR and Dev Server middleware
    await configureHMR(app, compiler)
  } else {
    // Add the server-side rendering middleware (no HMR)
    app.use(require('./lib/routerMiddleware').default)
  }

  // Run anything on the `app` hook
  config.app.forEach(f => f(app))

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
