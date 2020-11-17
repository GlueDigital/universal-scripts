import React from 'react'
import { StaticRouter } from 'react-router-dom'

const App = __SSR__ && require('src/routes').default

const routerRoot = (ctx) => {
  if (!App) return null
  // On the server, pass the URL from context, and use StaticRouter
  const url = ctx.req.url
  ctx.renderCtx = {}
  return (
    <StaticRouter location={url} context={ctx.renderCtx}>
      <App />
    </StaticRouter>
  )
}

export const reactRoot = routerRoot
