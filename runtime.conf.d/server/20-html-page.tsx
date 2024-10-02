import { HelmetProvider } from 'react-helmet-async'
import path from 'node:path'
import fs from 'node:fs'
import defaultHeaders from '../../lib/header'
import renderHtmlLayout from '../../lib/render-html-layout'
import { NextFunction, Request, Response } from 'express'

const basename = process.env.SUBDIRECTORY || '/'

let chunks: { name: string, size?: number }[] = []

if (!__WATCH__) {
  const fname = path.resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(fs.readFileSync(fname, 'utf8')).entrypoints
}

let index = ''
if (!__WATCH__ && !__SSR__) {
  const fname = path.resolve('build', 'client', 'index.htm')
  index = fs.readFileSync(fname, 'utf8')
}

const generateHtml = async (req: Request, res: Response, next: NextFunction) => {

  if (req.originalUrl.endsWith('.json')
      || req.originalUrl.endsWith('.js')) {
    return res.status(404).end()
  }

  // Scripts and styles of the page
  const scripts: string[] = []
  const styles: string[] = []
  const reqBasename: string = req.basename || basename

  // Add assets from build process or from client stats in watch mode
  let assets: string[] = []
  if (!__WATCH__) {
    assets = chunks.map((chunk) => chunk.name)
  } else if (req.clientStats) {
    req.clientStats.entrypoints.main.assets.forEach(asset => {
      if (asset.name.includes('hot-update')) return
      assets = assets.concat(asset.name)
    })
  }

  for (const asset of assets) {
    if (asset.endsWith('.js')) {
      scripts.push(reqBasename + asset)
    } else if (asset.endsWith('.css')) {
      styles.push(`<link rel="stylesheet" href="${reqBasename + asset}" />`)
    }
  }

  // Hacer visibles nuestros recursos para otros middlewares también
  req.assets = { scripts, styles }
  res.status(200)

  req.helmetContext = null

  await next()

  // Obtain headers from React Helmet
  const head = req.helmetContext.helmet
  res.write(renderHtmlLayout(head, styles))

  // Send stream to client
  if (req.stream) {
    res.status(200)
    req.stream.pipe(res)
    res.end()
  } else {
    res.end()
  }
}

const staticHtml = async (req, res, next) => {
  // Use Static HTML template
  await next()
  res.type('text/html')
  res.send(index) // 'index' debe ser el HTML preconstruido
}

export const serverMiddleware = index ? staticHtml : generateHtml

const addDefaultHeaders = async (req, res, next) =>
  <HelmetProvider context={req.helmetContext}>
    {defaultHeaders(req.store)}
    {await next()}
  </HelmetProvider>

export const reactRoot = addDefaultHeaders
