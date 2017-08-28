import {
  applyMiddleware,
  compose,
  combineReducers,
  createStore as rCreateStore
} from 'redux'
import thunk from 'redux-thunk'
import { intlReducer } from 'react-intl-redux'

import reducerList from 'src/store/reducers'

const addAutoReducers = (userReducers) => {
  return Object.assign({}, userReducers, {
    intl: intlReducer
  })
}

export const createStore = (initialState = {}) => {
  const middlewares = [thunk]
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