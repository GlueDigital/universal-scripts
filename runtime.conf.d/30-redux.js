import React from 'react'
import { createStore } from '../lib/store'
import { CLEANUP, REQUEST_INIT } from 'universal-scripts'
import jsesc from 'jsesc'

const addRedux = async (ctx, next) => {
  // Create store
  const initialState = {}
  const store = createStore(initialState)

  // Dispatch a init event with the request data
  store.dispatch({
    type: REQUEST_INIT,
    payload: {
      headers: ctx.request.headers,
      origin: ctx.request.origin,
      path: ctx.request.path,
      ip: ctx.request.ip
    }
  })

  // Make it available through the context
  ctx.store = store

  // Run any other middlewares
  await next()

  // Clean up the resulting state
  store.dispatch({ type: CLEANUP })
  const state = store.getState()
  delete state.req // This reducer doesn't exist client-side

  // Send store contents along the page
  const storeOutput = jsesc(state, { isScriptContext: true })
  const storeCode = { __html: '___INITIAL_STATE__=' + storeOutput }
  ctx.assets && ctx.assets.scripts && ctx.assets.scripts.unshift(
    <script key="store" dangerouslySetInnerHTML={storeCode} />
  )
}

export const serverMiddleware = addRedux
