import React from 'react'

let StaticRouter

try {
  // Import v6
  StaticRouter = require('react-router-dom/server').StaticRouter
} catch (error) {
  // Try to import v5
  StaticRouter = require('react-router-dom').StaticRouter
}

const App = __SSR__ && require('src/routes').default

const routerRoot = (ctx) => {
  if (!App) return null
  // On the server, pass the URL from context, and use StaticRouter
  const url = ctx.req.url
  ctx.renderCtx = {}
  return (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}

export const reactRoot = routerRoot
