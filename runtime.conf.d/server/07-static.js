import fs from 'fs'
import path from 'path'
import koaStatic from 'koa-static'

const appDirectory = fs.realpathSync(process.cwd())

// TODO: pay attention to basename
// const basename = process.env.SUBDIRECTORY || '/'

let serveStatic
if (__WATCH__) {
  // Serve static files directly from src (no need to copy again and again)
  serveStatic = koaStatic(path.resolve(appDirectory, 'src', 'static'), {
    hidden: true
  })
} else {
  // Serve files from the build folder (includes copied assets)
  serveStatic = koaStatic(path.resolve(appDirectory, 'build', 'client'), {
    hidden: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public,max-age=31536000,immutable')
    }
  })
}

export const serverMiddleware = serveStatic
