import { renderToStringAsync } from 'react-async-ssr'

// import { renderToStringAsync } from 'react-async-ssr'

const renderMiddleware = async (ctx, next) => {
  // Run any other middlewares
  await next()

  // Run the render hook to get the root element
  const children = await ctx.triggerHook('reactRoot')(ctx, false)

  // Actual rendering
  ctx.body = await renderToStringAsync(children)
}

export const serverMiddleware = renderMiddleware
