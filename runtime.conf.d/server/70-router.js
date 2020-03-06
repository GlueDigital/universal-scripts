import React from 'react'
import { StaticRouter } from 'react-router-dom'
import App from 'src/routes'

const routerRoot = (ctx) => {
  // On the server, pass the URL from context, and use StaticRouter
  const url = ctx.req.url
  return (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}

export const reactRoot = routerRoot
