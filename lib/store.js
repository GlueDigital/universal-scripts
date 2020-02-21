import {
  applyMiddleware,
  compose,
  combineReducers,
  createStore as rCreateStore
} from 'redux'
import thunk from 'redux-thunk'
import { intlReducer } from 'react-intl-redux'
import { fetchReducer } from 'ruse-fetch'

import reducerList from 'src/store/reducers'

import { CLEANUP, REQUEST_INIT } from 'universal-scripts'

const requestReducer = (state = null, action) => {
  if (action.type === CLEANUP) return null
  if (action.type === REQUEST_INIT) return action.payload
  return state
}

const cleanableIntlReducer = (state, action) =>
  action.type === CLEANUP ? { locale: state.locale } : intlReducer(state, action)

const addAutoReducers = (userReducers) => {
  const autoReducers = {
    intl: cleanableIntlReducer,
    useFetch: fetchReducer
  }
  if (__SERVER__) {
    autoReducers.req = requestReducer
  }
  return Object.assign({}, userReducers, autoReducers)
}

// Optional extra middlewares
const extraMiddlewares = (() => {
  const req = require.context('src/store', false, /^\.\/middlewares$/)
  if (req.keys().length) return req(req.keys()[0]).default
  return []
})()

export const createStore = (initialState = {}) => {
  const middlewares = [thunk, ...extraMiddlewares]
  const enhancers = []

  const reducers = addAutoReducers(reducerList)

  const store = rCreateStore(
    combineReducers(reducers),
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  )

  if (module.hot) {
    module.hot.accept('src/store/reducers', () => {
      const newReducers = addAutoReducers(require('src/store/reducers').default)
      store.replaceReducer(combineReducers(newReducers))
    })
  }

  return store
}
