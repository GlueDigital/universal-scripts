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

const routerRoot = (req, res, next) => {
  if (!App) return null
  // On the server, pass the URL from context, and use StaticRouter
  req.renderCtx = {}

  const url = req.url

  return (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )

}

export const reactRoot = routerRoot
