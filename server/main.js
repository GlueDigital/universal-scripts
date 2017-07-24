const chalk = require('chalk')
const fs = require('fs')
const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')

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

  configureHMR = (app, compiler) => {
    // Enable DEV middleware
    const koaWebpackInstance = koaWebpack({
      compiler: compiler,
      dev: {
        publicPath: '/',
        quiet: true,
        serverSideRender: true
      }
    })
    app.use(koaWebpackInstance)

    // Add hook to compiler to reload router middleware on rebuild
    const mfs = koaWebpackInstance.dev.fileSystem
    compiler.plugin('done', stats => {
      const fname = path.resolve(appDirectory, 'build', 'server', 'server.js')
      let newMiddleware = mfs.readFileSync(fname).toString()
      routerMiddleware =
        eval(newMiddleware).default // eslint-disable-line no-eval
    })

    // Finally add the router middleware too (through proxy so it can reload)
    app.use(routerMiddlewareProxy)
  }
}

const serve = (compiler) => {
  console.log(chalk.green('Starting server.'))
  const app = new Koa()

  // Serve static files (but a file server would be better)
  app.use(koaStatic(path.resolve(appDirectory, 'src', 'static'), {}))

  // Add our server-side-rendering middleware
  if (__WATCH__) {
    configureHMR(app, compiler)
  } else {
    app.use(require('./lib/routerMiddleware').default)
  }

  // Wrap it up
  app.listen(port)
  console.log(
    chalk.green('Server running at:'),
    chalk.cyan.bold('http://localhost:' + port)
  )
}

module.exports = serve

if (!__WATCH__) {
  // On static build, this is the entry point, so for it to actually run,
  // we must call the exported function
  serve()
}
