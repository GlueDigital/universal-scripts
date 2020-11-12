import { renderToStringAsync } from 'react-async-ssr'

// import { renderToStringAsync } from 'react-async-ssr'

const renderMiddleware = async (ctx, next) => {
  // Run any other middlewares
  await next()

  // Run the render hook to get the root element
  const children = await ctx.triggerHook('reactRoot')(ctx, false)

  // Actual rendering
  ctx.body = await renderToStringAsync(children)
  ctx.type = 'text/html'

  if (ctx.renderCtx && ctx.renderCtx.url) {
    // There was a redirect
    ctx.redirect(ctx.renderCtx.url)
  }
}

export const serverMiddleware = renderMiddleware
