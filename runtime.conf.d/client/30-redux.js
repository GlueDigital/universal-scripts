import { createStore } from '../../lib/store'

const clientRedux = (ctx, next) => {
  // Create store using server data (if available)
  const initialState = window.___INITIAL_STATE__ || {}
  const store = createStore(initialState)

  // Make it available through the context
  ctx.store = store

  // We now expose the store through window
  // This is useful for debugging, and for some special cases where
  // the store is needed from outside react (ie: index.js, ...).
  // It should NOT be a substitute to connect or the other Redux utils.
  // Use with caution.
  window.store = store

  // Run any other middlewares
  return next()
}

export const clientInit = clientRedux
