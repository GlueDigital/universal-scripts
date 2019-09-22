import React from 'react'
import { match, RouterContext } from 'react-router'
import createRoutes from 'src/routes'
import { waitForPromises } from '../lib/fetchData'

const basename = process.env.SUBDIRECTORY || '/'

const useRouter = async (ctx, next) => {
  // Are we using the router?
  let renderPage
  if (!process.env.DISABLE_ROUTER) {
    // Run the router matcher
    const renderProps = await new Promise((resolve, reject) => {
      const matcher = {
        routes: createRoutes(),
        location: ctx.req.url,
        basename: basename !== '/' && basename
      }
      match(matcher, (error, redirectLocation, renderProps) => {
        error ? reject(error) : resolve(renderProps)
      })
    })
    if (!renderProps) return // TODO: What happened?

    // Call fetchData methods and wait for them to finish
    const fetchResult = await waitForPromises(renderProps, ctx.store)

    // Trigger any secondary effects from fetchData functions
    if (fetchResult.__serverDirectives) {
      const directives = fetchResult.__serverDirectives
      // Cookies
      if (directives.cookies && directives.cookies.forEach) {
        directives.cookies.forEach(({ name, value, ...options }) => {
          ctx.cookies.set(name, value, options)
        })
      }
      // Redirects
      if (directives.redirect) {
        ctx.redirect(directives.redirect)
        ctx.body = ''
        return
      }
      // Status
      if (directives.status >= 100 && directives.status < 600) {
        ctx.status = directives.status
      }
    }
    renderPage = <RouterContext {...renderProps} />
  } else {
    // No router: answer all requests with the root component at routes/index.js
    renderPage = createRoutes()
  }

  ctx.renderChildren = renderPage

  await next()
}

export const serverMiddleware = useRouter
