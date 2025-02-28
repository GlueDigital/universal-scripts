import { Request } from 'express'

let StaticRouter
let isV6 = true

try {
  // Import v6
  StaticRouter = require('react-router/server').StaticRouter
} catch {
  isV6 = false
  // Try to import v5
  StaticRouter = require('react-router').StaticRouter
}

const App = __SSR__ && require('src/routes').default

const routerRoot = (req: Request) => {
  if (!App) return null

  const url = req.url

  if (isV6) {
    return (
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    )
  }

  req.renderCtx = {}

  return (
    <StaticRouter location={url} context={req.renderCtx}>
      <App />
    </StaticRouter>
  )
}

export const reactRoot = routerRoot
