import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import renderHtmlLayout from '../../lib/render-html-layout'
import { NextFunction, Request, Response } from 'express'

const basename = process.env.SUBDIRECTORY || '/'

let chunks: { name: string; size?: number }[] = []

if (!__WATCH__) {
  const fname = resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(readFileSync(fname, 'utf8')).entrypoints
}

let index = ''
if (!__WATCH__ && !__SSR__) {
  const fname = resolve('build', 'client', 'index.html')
  index = readFileSync(fname, 'utf8')
}

const generateHtml = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.originalUrl.endsWith('.json') || req.originalUrl.endsWith('.js')) {
    return res.status(404).end()
  }

  // Scripts and styles of the page
  const scripts: string[] = []
  const styles: string[] = []
  const reqBasename: string = basename

  // Add assets from build process or from client stats in watch mode
  let assets: string[] = []
  if (!__WATCH__) {
    assets = chunks.map((chunk) => chunk.name)
  } else if (req.clientStats) {
    req.clientStats.entrypoints.main.assets.forEach((asset) => {
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

  await next()
  // Obtain headers from React Helmet
  const head = await req.triggerHook('extraHead')(req, res, {
    title: '',
    meta: '',
    base: '',
    link: '',
    script: '',
    style: '',
    htmlAttributes: ''
  })
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

const envKeys = Object.keys(process.env).filter((key) =>
  key.startsWith('PUBLIC_')
)

const staticHtml = async (req: Request, res: Response, next: NextFunction) => {
  // Use Static HTML template
  await next()
  const envFragment = `<script>__ENV_VARS__=${JSON.stringify(envKeys)}</script>`
  const newIndex = index.replace('<!-- ENV -->', envFragment)
  res.type('text/html')
  res.send(newIndex) // 'index' debe ser el HTML preconstruido
}

export const serverMiddleware = index ? staticHtml : generateHtml
