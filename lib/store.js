import {
  applyMiddleware,
  compose,
  combineReducers,
  createStore as rCreateStore
} from 'redux'
import thunk from 'redux-thunk'

import reducerList from 'src/store/reducers'

export const createStore = (initialState = {}) => {
  const middlewares = [thunk]
  const enhancers = []

  const store = rCreateStore(
    combineReducers(reducerList),
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  )

  if (module.hot) {
    module.hot.accept('src/store/reducers', () => {
      const reducers = require('src/store/reducers').default
      store.replaceReducer(combineReducers(reducers))
    })
  }

  return store
}
