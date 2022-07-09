import { renderToPipeableStream } from 'react-dom/server'

// import { renderToStringAsync } from 'react-async-ssr'

const renderMiddleware = async (ctx, next) => {
  // Run any other middlewares
  await next()

  // Run the render hook to get the root element
  const children = await ctx.triggerHook('reactRoot')(ctx, false)

  // Actual rendering
  await new Promise((resolve, reject) => {
    const stream = renderToPipeableStream(children, {
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
}

export const serverMiddleware = renderMiddleware
