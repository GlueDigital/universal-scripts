const fs = require('fs')
const path = require('path')
const koaStatic = require('koa-static')

const appDirectory = fs.realpathSync(process.cwd())
// const basename = process.env.SUBDIRECTORY || '/'

const appEnhancer = (app) => {
  // TODO: pay attention to basename
  if (__WATCH__) {
    // Serve static files directly from src (no need to copy again and again)
    app.use(koaStatic(path.resolve(appDirectory, 'src', 'static'), {}))
  } else {
    // Serve files from the build folder (includes copied assets)
    app.use(koaStatic(path.resolve(appDirectory, 'build', 'client'), {
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public,max-age=31536000,immutable')
      }
    }))
  }
}

module.exports = {
  app: appEnhancer
}
