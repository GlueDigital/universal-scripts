import React from 'react'
import { createStore } from '../../lib/store'
import { CLEANUP, REQUEST_INIT } from 'universal-scripts'
import { Provider } from 'react-redux'
import jsesc from 'jsesc'

const addRedux = async (req, res, next) => {
  // Create store
  const initialState = {}
  const store = createStore(initialState)

  // Dispatch a init event with the request data
  store.dispatch({
    type: REQUEST_INIT,
    payload: {
      headers: req.headers,
      origin: req.origin,
      path: req.path,
      ip: req.ip,
      cookies: parseCookies(req.headers.cookie),
      ...req.initExtras // Allow passing in data from previous middlewares
    }
  })

  // Make it available through the context
  req.store = store

  // Run any other middlewares
  await next()

  // Clean up the resulting state
  store.dispatch({ type: CLEANUP })
  const state = store.getState()
  delete state.req // This reducer doesn't exist client-side

  // Send store contents along the page
  const storeOutput = jsesc(state, { isScriptContext: true })
  req.assets?.styles.unshift('<script>___INITIAL_STATE__=' + storeOutput + '</script>')
}

const parseCookies = s => !s ? {} : s
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
    return acc
  }, {})

export const serverMiddleware = addRedux

const renderIntlProvider = async (req, res, next) =>
  <Provider store={req.store}>
    {await next()}
  </Provider>

export const reactRoot = renderIntlProvider
