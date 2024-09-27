import { configureStore } from '@reduxjs/toolkit'
import { fetchReducer } from 'ruse-fetch'
import { intlReducer, requestReducer } from './slices'

import reducerList from 'src/store/reducers'

const addAutoReducers = (userReducers) => {
  const autoReducers = {
    intl: intlReducer,
    useFetch: fetchReducer
  }
  if (__SERVER__) {
    autoReducers.req = requestReducer
  }
  return Object.assign({}, autoReducers, userReducers)
}

// Optional extra middlewares
const extraMiddlewares = (() => {
  const req = require.context('src/store', false, /^\.\/middlewares$/)
  if (req.keys().length) return req(req.keys()[0]).default
  return []
})()

export const createStore = (initialState = {}) => {
  const middlewares = extraMiddlewares

  const reducers = addAutoReducers(reducerList)

  const store = configureStore({
    reducer: reducers,
    // middleware: middlewares,
    preloadedState: initialState
  })

  if (module.hot) {
    module.hot.accept('src/store/reducers', () => {
      const newReducers = addAutoReducers(require('src/store/reducers').default)
      store.replaceReducer(newReducers)
    })
  }

  return store
}
