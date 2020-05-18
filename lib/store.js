import {
  applyMiddleware,
  compose,
  combineReducers,
  createStore as rCreateStore
} from 'redux'
import thunk from 'redux-thunk'
import { fetchReducer } from 'ruse-fetch'

import reducerList from 'src/store/reducers'

import { CLEANUP, REQUEST_INIT, UPDATE_INTL } from 'universal-scripts'

const requestReducer = (state = null, action) => {
  if (action.type === CLEANUP) return null
  if (action.type === REQUEST_INIT) return action.payload
  return state
}

const intlReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_INTL:
      return { ...state, ...action.payload }
    case CLEANUP:
      return { locale: state.locale }
    default:
      return state || { locale: 'en', messages: {} }
  }
}

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
