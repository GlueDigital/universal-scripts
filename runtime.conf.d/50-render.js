import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-intl-redux'
import defaultHeaders from '../lib/header'

const renderMiddleware = async (ctx, next) => {
  // Set helmet defaults
  renderToString(defaultHeaders(ctx.store))

  // Run any other middlewares
  await next()

  // Actual rendering
  const renderOutput = renderToString(
    <Provider store={ctx.store}>
      {ctx.renderChildren || <React.Fragment />}
    </Provider>
  )

  ctx.body = renderOutput
}

export const serverMiddleware = renderMiddleware
