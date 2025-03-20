import 'dotenv/config'
import chalk from 'chalk'
import fs from 'fs'
import express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import path from 'path'
import cookieParser from 'cookie-parser'
import requireFromString from 'require-from-string'

const appDirectory = fs.realpathSync(process.cwd())
const port = process.env.PORT || 3000

// Group and an array of middlewares into a single one, because express doesnt support promises on next functions
const groupMiddlewares = (serverMiddleware) => async (req, res, nxt) => {
  const copy = [...serverMiddleware]
  const next = (err) => {
    // With our custom next we dont pass err arg to express. So we need this workaround
    if (err) return nxt(err)
    const mw = copy.shift()
    return !mw ? null : mw(req, res, next)
  }
  await next()
}

// Group and an array of middlewares into a single one, because express doesnt support promises on next functions
const groupErrorMiddlewares =
  (serverErrorMiddleware) => async (err, req, res) => {
    const copy = [...serverErrorMiddleware]
    const next = () => {
      const mw = copy.shift()
      return !mw ? null : mw(err, req, res, next)
    }
    await next()
  }

let configureHMR
let config

if (__WATCH__) {
  // We need to hot-reload serverMiddleware, but we're the ones building it.
  let serverMiddleware = null
  let serverErrorMiddleware = null
  let clientStats = null

  const loadServerMiddlewareProxy = (req, res, next) => {
    if (serverMiddleware !== null && serverMiddleware.length) {
      return groupMiddlewares(serverMiddleware)(req, res, next)
    } else {
      console.log('Request received, but no middleware loaded yet')
    }
  }

  const loadServerErrorMiddlewareProxy = (err, req, res, next) => {
    if (serverErrorMiddleware !== null && serverErrorMiddleware.length) {
      return groupErrorMiddlewares(serverErrorMiddleware)(err, req, res, next)
    } else {
      console.log('Request received, but no error middleware loaded yet')
    }
  }

  configureHMR = (app, compiler) => {
    // Enable DEV middleware
    const devMiddleware = webpackDevMiddleware(compiler, {
      stats: 'summary',
      publicPath: '/',
      serverSideRender: true
    })

    const hotMiddleware = webpackHotMiddleware(compiler.compilers[0])

    compiler.compilers[0].webpackHotMiddleware = hotMiddleware

    app.use(devMiddleware)
    app.use(hotMiddleware)

    app.use((req, res, next) => {
      req.clientStats = clientStats
      next()
    })

    // Add hook to compiler to reload server middleware on rebuild
    const mfs = devMiddleware.context.outputFileSystem
    const plugin = { name: 'universal-scripts' }

    compiler.hooks.done.tap(plugin, async () => {
      clientStats = devMiddleware.context.stats.toJson().children[0]
      const fname = path.resolve(appDirectory, 'build', 'server', 'server.js')

      try {
        const newMiddleware = mfs.readFileSync(fname).toString()
        const mw = requireFromString(newMiddleware, fname)
        config = mw.rawConfig

        if (config.app) config.app.forEach((f) => f(app))
        await mw.startup()
        serverMiddleware = mw.default
        serverErrorMiddleware = mw.rawConfig.serverErrorMiddleware
      } catch (e) {
        console.warn(chalk.red.bold("Couldn't load middleware."))
        console.log(
          chalk.red(
            'Please fix any build errors above, and ' + 'it will auto-reload.'
          )
        )
        console.log('Details:', e)
      }
    })

    app.use(loadServerMiddlewareProxy)
    app.use(loadServerErrorMiddlewareProxy)
  }
}

const serve = async (compiler) => {
  console.log(chalk.green('Starting server.'))
  const app = express()

  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(express.json())

  if (__WATCH__) {
    // Add the HMR and Dev Server middleware
    await configureHMR(app, compiler)
  } else {
    const mw = await import('./serverMiddleware.js')

    config = mw.rawConfig

    // Run anything on the `app` hook
    if (config.app) config.app.forEach((f) => f(app))
    // Add the server-side rendering middleware (no HMR)
    await mw.startup()
    app.use(groupMiddlewares(mw.default))
    app.use(groupErrorMiddlewares(mw.rawConfig.serverErrorMiddleware))
  }

  // Wrap it up
  const server = app.listen(port)

  // Run anything on the `app` hook
  if (config && config.appAfter) config.appAfter.forEach((f) => f(server))

  console.log(
    chalk.green('Server running at:'),
    chalk.cyan.bold('http://localhost:' + port)
  )
}

if (!__WATCH__) {
  // On static build, this is the entry point, so for it to actually run,
  // we must call the exported function
  serve()
}

export default serve
