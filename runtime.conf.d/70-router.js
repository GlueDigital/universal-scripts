import React from 'react'
import { BrowserRouter, StaticRouter } from 'react-router-dom'
import App from 'src/routes'

const routerRoot = (ctx) => {
  // We don't really need next: we can't have children
  if (__CLIENT__) {
    // On the client, just use BrowserRouter
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
  } else {
    // On the server, pass the URL from context, and use StaticRouter
    const url = ctx.req.url
    return (
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    )
  }
}

export const reactRoot = routerRoot
