import React from 'react'
import { StaticRouter } from 'react-router-dom'
import App from 'src/routes'

const basename = process.env.SUBDIRECTORY || '/'

const useRouter = async (ctx, next) => {
  await next()
}

export const serverMiddleware = useRouter

const routerRoot = (ctx) => {
  // We don't really need next: we can't have children
  const url = ctx.req.url
  return (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}

export const reactRoot = routerRoot
