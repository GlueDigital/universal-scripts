import { Provider } from 'react-redux'
import { createClientStore } from '../../lib/redux/store'
import { clientInit as clientInitAction } from '../../lib/redux/actions'
import { ClientInit, ClientRoot } from '../../lib/redux/types'

const clientRedux: ClientInit = (ctx, next) => {
  // Create store using server data (if available)
  const initialState = window.___INITIAL_STATE__ || {}
  const store = createClientStore(initialState)

  // Make it available through the context
  ctx.store = store

  // We now expose the store through window
  // This is useful for debugging, and for some special cases where
  // the store is needed from outside react (ie: index.js, ...).
  // It should NOT be a substitute to connect or the other Redux utils.
  // Use with caution.
  window.store = store

  // Dispatch a CLIENT_INIT action to give middlewares, etc. a chance of
  // updating the store before render
  store.dispatch(clientInitAction())

  // Run any other middlewares
  return next()
}

export const clientInit = clientRedux

const renderIntlProvider: ClientRoot = async (ctx, next) => (
  <Provider store={ctx.store}>{await next()}</Provider>
)

export const reactRoot = renderIntlProvider
