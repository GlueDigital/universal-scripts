import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit'
import { fetchReducer } from 'ruse-fetch'
import { intlReducer, requestReducer } from './slices'

// @ts-ignore
import reducerList from 'src/store/reducers'

const addClientAutoReducers = (userReducers: Reducer<{}, never, Partial<{}>>) => {
  const autoReducers = {
    intl: intlReducer,
    useFetch: fetchReducer,
  }
  return combineReducers({...autoReducers, ...userReducers})
}

const addServerAutoReducers = (userReducers: Reducer<{}, never, Partial<{}>>) => {
  const autoReducers = {
    intl: intlReducer,
    useFetch: fetchReducer,
    req: requestReducer
  }
  return combineReducers({...autoReducers, ...userReducers})
}

// Optional extra middlewares
const extraMiddlewares = (() => {
  const req = require.context('src/store', false, /^\.\/middlewares$/)
  if (req.keys().length) return req(req.keys()[0]).default
  return []
})()

export const createServerStore = () => {
  const reducers = addServerAutoReducers(reducerList)

  const middlewares = extraMiddlewares()

  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middlewares),
    preloadedState: {}
  })

  if (module.hot) {
    module.hot.accept('src/store/reducers', () => {
      const newReducers = addServerAutoReducers(require('src/store/reducers').default)
      store.replaceReducer(newReducers)
    })
  }

  return store
}

export const createClientStore = (initialState: any) => {
  const reducers = addClientAutoReducers(reducerList)

  const store = configureStore({
    reducer: reducers,
    // middleware: middlewares,
    preloadedState: initialState
  })

  if (module.hot) {
    module.hot.accept('src/store/reducers', () => {
      const newReducers = addClientAutoReducers(require('src/store/reducers').default)
      store.replaceReducer(newReducers)
    })
  }

  return store
}
