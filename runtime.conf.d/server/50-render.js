import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'

// Optional error 500 page
const ErrorHandler = __SSR__ && (() => {
  const req = require.context('src/routes', false, /^\.\/index$/)
  const keys = req(req.keys()[0])
  return keys.ErrorHandler
})()

const render = (req, res, root) => new Promise((resolve, reject) => {
  const stream = renderToPipeableStream(root, {
    bootstrapScripts: req.assets?.scripts,
    onAllReady: () => {
      if (req.renderCtx && req.renderCtx.url) {
        // There was a redirect
        res.redirect(req.renderCtx.url)
      } else {
        res.set('Content-Type', 'text/html; charset=utf-8')
        req.stream = stream
      }
      resolve()
    },
    onError: (e) => {
      reject(e)
    }
  })
})

const renderMiddleware = async (req, res, next) => {
  // Run any other middlewares
  await next()

  // Run the render hook to get the root element
  const children = await req.triggerHook('reactRoot')(req, res, false)

  // Actual rendering
  try {
    await render(req, res, children)
  } catch (err) {
    if (ErrorHandler) {
      await render(req, res, <ErrorHandler error={err} />)
    } else {
      await render(req, res, false)
    }
    res.status = err.status || 500
  }
}

export const serverMiddleware = renderMiddleware
