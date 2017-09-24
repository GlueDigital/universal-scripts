import Helmet from 'react-helmet'
import React from 'react'
import chalk from 'chalk'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-intl-redux'

import renderHtmlLayout from './render-html-layout'
import { createStore } from '../../lib/store'
import { waitForPromises } from '../../lib/fetchData'

import fs from 'fs'
import path from 'path'

import langs from 'src/locales'
import createRoutes from 'src/routes'

let chunks = []
if (!__WATCH__) {
  const fname = path.resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(fs.readFileSync(fname)).assets
}

// Optional server-only routes hook
let handleServerRoutes = false
if (fs.existsSync(path.resolve('src', 'routes', 'serverRoutes.js'))) {
  handleServerRoutes = require('src/routes/serverRoutes').default
}

const handleServerError = (ctx, error) => {
  console.error(chalk.red('Error during render:\n') + error.stack)
  ctx.status = 500
  if (__DEV__) {
    // Provide some better feedback for errors during DEV
    ctx.body =
      '<h1>Internal Server Error</h1>\n' +
      '<p>An exception was caught during page rendering:</p>\n' +
      '<pre>' + error.stack + '</pre>'
  }
}

export default async (ctx, next) => {
  if (handleServerRoutes) {
    await handleServerRoutes(ctx, next)
  } else {
    await next()
  }

  // If any middleware answered successfully before, do nothing.
  if ((ctx.body || ctx.status !== 404) && ctx.req.url !== '/') return

  // These will hold the scripts and styles that will be included on the page.
  const scripts = []
  const styles = []

  // If the DEV middleware got some assets, add them.
  let assets = []
  if (!__WATCH__) {
    assets = chunks
  } else if (ctx.state.webpackStats) {
    assets = Object.keys(ctx.state.webpackStats.stats[0].compilation.assets)
  }
  for (const asset of assets) {
    if (asset.endsWith('.js')) {
      scripts.unshift(<script key={asset} src={'/' + asset} />)
    } else if (asset.endsWith('.css')) {
      styles.unshift(<link key={asset} rel="stylesheet" href={'/' + asset} />)
    }
  }

  // Run the router matcher
  const renderProps = await new Promise((resolve, reject) => {
    const matcher = { routes: createRoutes(), location: ctx.req.url }
    match(matcher, (error, redirectLocation, renderProps) => {
      error ? reject(error) : resolve(renderProps)
    })
  })
  if (!renderProps) return // TODO: What happened?

  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = ctx.request.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = ctx.cookies.get('lang')
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  // Create store
  const initialState = {
    intl: {
      locale: lang,
      messages: langs[lang]
    }
  }
  const store = createStore(initialState)

  // Call fetchData methods and wait for them to finish
  let fetchResult
  try {
    fetchResult = await waitForPromises(renderProps, store)
  } catch (e) {
    return handleServerError(ctx, e)
  }

  // Trigger any secondary effects from fetchData functions
  if (fetchResult.__serverDirectives) {
    const directives = fetchResult.__serverDirectives
    // Cookies
    if (directives.cookies && directives.cookies.forEach) {
      directives.cookies.forEach(({name, value, ...options}) => {
        ctx.cookies.set(name, value, options)
      })
    }
    // Redirects
    if (directives.redirect) {
      ctx.redirect(directives.redirect)
      ctx.body = ''
      return
    }
  }

  // Actual rendering
  let renderOutput
  if (renderProps) {
    try {
      renderOutput = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )
    } catch (e) {
      return handleServerError(ctx, e)
    }
  } else {
    // TODO: Handle 404
  }

  // Clean up the resulting state
  const state = store.getState()
  delete state.intl.messages

  // Send store contents along the page
  const storeOutput = JSON.stringify(state)
  const storeCode = { __html: '___INITIAL_STATE__=' + storeOutput }
  scripts.unshift(
    <script key="store" dangerouslySetInnerHTML={storeCode} />
  )

  // Get the headers from react-helmet
  const head = Helmet.rewind()

  // Set the response
  ctx.status = 200
  ctx.body = renderHtmlLayout(head, renderOutput, scripts, styles)
}
