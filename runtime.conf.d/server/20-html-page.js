import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import path from 'path'
import fs from 'fs'
import defaultHeaders from '../../lib/header'
import renderHtmlLayout from '../../lib/render-html-layout'

const basename = process.env.SUBDIRECTORY || '/'

let chunks = []
if (!__WATCH__) {
  const fname = path.resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(fs.readFileSync(fname)).entrypoints
}

let index = false
if (!__WATCH__ && !__SSR__) {
  const fname = path.resolve('build', 'client', 'index.htm')
  index = fs.readFileSync(fname)
}

const generateHtml = async (ctx, next) => {
  // These will hold the scripts and styles that will be included on the page.
  const scripts = []
  const styles = []
  const reqBasename = ctx.basename || basename

  // If the DEV middleware got some assets, add them.
  let assets = []
  if (!__WATCH__) {
    assets = chunks
  } else if (ctx.state.webpackStats) {
    ctx.state.webpackStats.stats[0].compilation.entrypoints.forEach(e => {
      e.chunks.forEach(c => { assets = assets.concat(c.files) })
    })
  }
  for (const asset of assets) {
    if (asset.endsWith('.js') && asset !== 'polyfills.js') {
      scripts.push(reqBasename + asset)
    } else if (asset.endsWith('.css')) {
      styles.push(`<link rel="stylesheet" href="${reqBasename + asset}" />`)
    }
  }

  // Make our lists visible for inner middlewares too
  ctx.assets = { scripts, styles }
  ctx.status = 200

  ctx.helmetContext = {}

  // Run any other middlewares
  await next()

  // Get the headers from react-helmet
  const head = ctx.helmetContext.helmet
  ctx.res.write(renderHtmlLayout(head, styles))

  // Add the stream, if any, from render
  if (ctx.stream) {
    ctx.respond = false
    ctx.res.statusCode = 200
    ctx.response.set('content-type', 'text/html')
    ctx.stream.pipe(ctx.res)
    ctx.res.end()
  }
}

const staticHtml = async (ctx, next) => {
  // We just use a prebuilt html
  await next()
  ctx.type = 'text/html'
  ctx.body = index
}

export const serverMiddleware = index ? staticHtml : generateHtml

const addDefaultHeaders = async (ctx, next) =>
  <HelmetProvider context={ctx.helmetContext}>
    {defaultHeaders(ctx.store)}
    {await next()}
  </HelmetProvider>

export const reactRoot = addDefaultHeaders
