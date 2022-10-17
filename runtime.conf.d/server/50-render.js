import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'

// Optional error 500 page
const ErrorHandler = __SSR__ && (() => {
  const req = require.context('src/routes', false, /^\.\/index$/)
  const keys = req(req.keys()[0])
  return keys.ErrorHandler
})()

const render = (ctx, root) => new Promise((resolve, reject) => {
  const stream = renderToPipeableStream(root, {
    bootstrapScripts: ctx.assets?.scripts,
    onAllReady: () => {
      if (ctx.renderCtx && ctx.renderCtx.url) {
        // There was a redirect
        ctx.redirect(ctx.renderCtx.url)
      } else {
        ctx.set('Content-Type', 'text/html; charset=utf-8')
        ctx.stream = stream
      }
      resolve()
    },
    onError: (e) => {
      reject(e)
    }
  })
})

const renderMiddleware = async (ctx, next) => {
  // Run any other middlewares
  await next()

  // Run the render hook to get the root element
  const children = await ctx.triggerHook('reactRoot')(ctx, false)

  // Actual rendering
  try {
    await render(ctx, children)
  } catch (err) {
    if (ErrorHandler) {
      await render(ctx, <ErrorHandler error={err} />)
    } else {
      await render(ctx, false)
    }
    ctx.status = err.status || 500
  }
}

export const serverMiddleware = renderMiddleware
