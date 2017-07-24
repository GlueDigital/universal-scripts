import Helmet from 'react-helmet'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'

import renderHtmlLayout from './render-html-layout'
import routes from 'src/routes'

export default async (ctx, next) => {
  await next()

  // If any middleware answered successfully before, do nothing.
  if ((ctx.body || ctx.status !== 404) && ctx.req.url !== '/') return

  // These will hold the scripts and styles that will be included on the page.
  const scripts = []
  const styles = []

  // If the DEV middleware got some assets, add them.
  if (ctx.state.webpackStats) {
    const assets = ctx.state.webpackStats.stats[0].compilation.assets
    for (const asset in assets) {
      if (asset.endsWith('.js')) {
        scripts.unshift(<script key={asset} src={'/' + asset} />)
      } else if (asset.endsWith('.css')) {
        styles.unshift(<link rel="stylesheet" href={'/' + asset} />)
      }
    }
  }

  // Run the router matcher
  const renderProps = await new Promise((resolve, reject) => {
    const matcher = { routes: routes(), location: ctx.req.url }
    match(matcher, (error, redirectLocation, renderProps) => {
      error ? reject(error) : resolve(renderProps)
    })
  })

  // TODO: Create store...
  // TODO: Exec fetchData handlers...

  // Actual rendering
  let renderOutput
  if (renderProps) {
    renderOutput = renderToString(<RouterContext {...renderProps} />)
  } else {
    // TODO: Handle 404
  }

  // Get the headers from react-helmet
  const head = Helmet.rewind()

  // Set the response
  ctx.status = 200
  ctx.body = renderHtmlLayout(head, renderOutput, scripts, styles)
}
