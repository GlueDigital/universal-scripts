import Helmet from 'react-helmet'
import React from 'react'
import chalk from 'chalk'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-intl-redux'
import jsesc from 'jsesc'

import renderHtmlLayout from './render-html-layout'
import { createStore } from '../../lib/store'
import { waitForPromises } from '../../lib/fetchData'
import defaultHeaders from '../../lib/header'

import { CLEANUP, REQUEST_INIT } from 'universal-scripts'

import fs from 'fs'
import path from 'path'

import langs from 'src/locales'
import createRoutes from 'src/routes'

let chunks = []
if (!__WATCH__) {
  const fname = path.resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(fs.readFileSync(fname)).entrypoints
}

// Optional server-only routes hook
const handleServerRoutes = (() => {
  const req = require.context('src/routes', false, /^\.\/serverRoutes$/)
  if (req.keys().length) return req(req.keys()[0]).default
})()

// Optional error 500 page
const customError500 = (() => {
  const req = require.context('src/routes', false, /^\.\/index$/)
  const keys = req(req.keys()[0])
  if (keys.error500 && fs.existsSync(keys.error500)) {
    return fs.readFileSync(keys.error500, 'utf-8')
  }
})()

const handleServerError = (ctx, error) => {
  console.error(chalk.red('Error during render:\n') + error.stack)
  ctx.status = 500
  if (customError500) {
    // Use the user-provided error page
    ctx.body = customError500
  } else if (__DEV__) {
    // Provide some better feedback for errors during DEV
    ctx.body =
      '<h1>Internal Server Error</h1>\n' +
      '<p>An exception was caught during page rendering:</p>\n' +
      '<pre>' + error.stack + '</pre>'
  }
}

export default async (ctx, next) => {
  // We are the ones in charge of changing the location according to basename
  // because neither koa-static nor react-router handle it. Note that the dev
  // middleware does handle it, but it will run before us anyway.
  const basename = process.env.SUBDIRECTORY || '/'
  if (ctx.req.url.startsWith(basename)) {
    ctx.req.url = ctx.req.url.substr(basename.length - 1)
  }

  // Give other middlewares a chance to run
  if (handleServerRoutes) {
    await handleServerRoutes(ctx, next)
  } else {
    await next()
  }

  // If any middleware answered successfully before, do nothing.
  if ((ctx.body || ctx.status !== 404) && ctx.req.url !== '/') return
  ctx.status = 200

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

  // Dispatch a init event with the request data
  store.dispatch({
    type: REQUEST_INIT,
    payload: {
      headers: ctx.request.headers,
      origin: ctx.request.origin,
      path: ctx.request.path,
      ip: ctx.request.ip
    }
  })

  // Are we using the router?
  let renderPage
  if (!process.env.DISABLE_ROUTER) {
    // Run the router matcher
    const renderProps = await new Promise((resolve, reject) => {
      const matcher = {
        routes: createRoutes(),
        location: ctx.req.url,
        basename: basename !== '/' && basename
      }
      match(matcher, (error, redirectLocation, renderProps) => {
        error ? reject(error) : resolve(renderProps)
      })
    })
    if (!renderProps) return // TODO: What happened?

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
        directives.cookies.forEach(({ name, value, ...options }) => {
          ctx.cookies.set(name, value, options)
        })
      }
      // Redirects
      if (directives.redirect) {
        ctx.redirect(directives.redirect)
        ctx.body = ''
        return
      }
      // Status
      if (directives.status >= 100 && directives.status < 600) {
        ctx.status = directives.status
      }
    }
    renderPage = <RouterContext {...renderProps} />
  } else {
    // No router: answer all requests with the root component at routes/index.js
    renderPage = createRoutes()
  }

  // Set helmet defaults
  renderToString(defaultHeaders(store))

  // Actual rendering
  let renderOutput
  try {
    renderOutput = renderToString(
      <Provider store={store}>
        {renderPage}
      </Provider>
    )
  } catch (e) {
    return handleServerError(ctx, e)
  }

  // Clean up the resulting state
  store.dispatch({ type: CLEANUP })
  const state = store.getState()
  delete state.req // This reducer doesn't exist client-side

  // Send store contents along the page
  const storeOutput = jsesc(state, { isScriptContext: true })
  const storeCode = { __html: '___INITIAL_STATE__=' + storeOutput }
  scripts.unshift(
    <script key="store" dangerouslySetInnerHTML={storeCode} />
  )

  // Get the headers from react-helmet
  const head = Helmet.renderStatic()

  // Set the response
  ctx.body = renderHtmlLayout(head, renderOutput, scripts, styles)
}
