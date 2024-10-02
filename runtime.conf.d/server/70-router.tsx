import { NextFunction, Request, Response } from 'express'

let StaticRouter
let isV6 = true

try {
  // Import v6
  StaticRouter = require('react-router-dom/server').StaticRouter
} catch (error) {
  isV6 = false
  // Try to import v5
  StaticRouter = require('react-router-dom').StaticRouter
}

const App = __SSR__ && require('src/routes').default

const routerRoot = (req: Request, res: Response, next: NextFunction) => {
  if (!App) return null

  const url = req.url

  if (isV6) {
    return (
      <StaticRouter location={url} >
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
