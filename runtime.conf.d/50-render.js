import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'

const renderMiddleware = async (ctx, next) => {
  // Run any other middlewares
  await next()

  // Run the render hook to get the root element
  const children = await ctx.triggerHook('reactRoot')(ctx, false)

  // Actual rendering
  ctx.body = renderToString(children)
}

export const serverMiddleware = renderMiddleware

const clientRender = async (ctx) => {
  const rootNode = document.getElementById('root')
  const children = await ctx.triggerHook('reactRoot')(ctx, false)
  ReactDOM.hydrate(children, rootNode)
}

export const clientInit = clientRender
