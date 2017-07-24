const chalk = require('chalk')
const fs = require('fs')
const Koa = require('koa')
const koaStatic = require('koa-static')
const koaWebpack = require('koa-webpack')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())
const port = process.env.PORT || 3000

// We need to hot-reload routerMiddleware, but we're the ones building it.
let routerMiddleware = null
const initRouterMiddleware = (compiler, koaWebpackInstance) => {
  const mfs = koaWebpackInstance.dev.fileSystem
  compiler.plugin('done', stats => {
    const filename = path.resolve(appDirectory, 'build', 'server', 'server.js')
    let newMiddleware = mfs.readFileSync(filename).toString()
    routerMiddleware =
      eval(newMiddleware).default // eslint-disable-line no-eval
  })
}
const routerMiddlewareProxy = (ctx, next) => {
  if (routerMiddleware) {
    return routerMiddleware(ctx, next)
  } else {
    console.log('Request received, but no middleware loaded yet')
  }
}

module.exports = (compiler, appPath) => {
  console.log(chalk.green('Starting server.'))
  const app = new Koa()

  // Enable DEV middlewares, and add watcher to update our routerMiddleware
  const koaWebpackInstance = koaWebpack({
    compiler: compiler,
    dev: {
      publicPath: '/',
      quiet: true,
      serverSideRender: true
    }
  })
  app.use(koaWebpackInstance)
  initRouterMiddleware(compiler, koaWebpackInstance)

  // Serve static files (but a file server would be better)
  app.use(koaStatic(path.resolve(appDirectory, 'src', 'static'), {}))

  // Add our server-side-rendering middleware
  app.use(routerMiddlewareProxy)

  // Wrap it up
  app.listen(port)
  console.log(
    chalk.green('Server running at:'),
    chalk.cyan.bold('http://localhost:' + port)
  )
}
