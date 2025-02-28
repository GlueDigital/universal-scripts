import 'dotenv/config'
import chalk from 'chalk'
import express from 'express'
import mw from '../../universal-scripts/server/serverMiddleware.js'
import cookieParser from 'cookie-parser'

import fs from 'fs'
import { resolve, join } from 'path'

const routes = [
  { path: '/', name: 'index' },
  { path: '/vessels', name: 'vessels' }
]
const appDirectory = fs.realpathSync(process.cwd())

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

const makeRequests = async () => {
  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:3001/${route.path}`)
      const data = await response.text()
      const path = resolve(appDirectory, 'static-sites')
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
      fs.writeFileSync(join(path, `${route.name}.html`), data, {
        encoding: 'utf-8'
      })
    } catch (error) {
      console.error(`Error requesting ${route.path}:`, error)
    }
  }
}

const serve = () => {
  console.log(chalk.green('Starting server to generate files.'))

  const app = express()

  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(express.json())

  // // await startup()

  app.use(groupMiddlewares(mw))

  const server = app.listen(3001)

  makeRequests().then(() => server.close())
}

serve()
