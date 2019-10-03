import React from 'react'
import Helmet from 'react-helmet'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import defaultHeaders from '../lib/header'
import renderHtmlLayout from '../lib/render-html-layout'

const basename = process.env.SUBDIRECTORY || '/'

let chunks = []
if (!__WATCH__) {
  const fname = path.resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(fs.readFileSync(fname)).entrypoints
}

const generateHtml = async (ctx, next) => {
  // These will hold the scripts and styles that will be included on the page.
  const scripts = []
  const styles = []

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
      scripts.push(<script key={asset} src={basename + asset} />)
    } else if (asset.endsWith('.css')) {
      styles.push(<link key={asset} rel="stylesheet" href={basename + asset} />)
    }
  }

  // Make our lists visible for inner middlewares too
  ctx.assets = { scripts, styles }
  ctx.status = 200

  // Run any other middlewares
  await next()

  // Get the headers from react-helmet
  const head = Helmet.renderStatic()

  // Set the response
  const renderOutput = ctx.body // Set from inside
  ctx.body = renderHtmlLayout(head, renderOutput, scripts, styles)
}

export const serverMiddleware = generateHtml

const addDefaultHeaders = (ctx, next) => {
  renderToString(defaultHeaders(ctx.store))
  return next()
}

export const reactRoot = addDefaultHeaders
