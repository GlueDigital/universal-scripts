import { combineReducers, configureStore, ReducersMapObject } from '@reduxjs/toolkit'
import { fetchReducer } from 'ruse-fetch'
import { intlReducer, requestReducer } from './slices'

// @ts-ignore
import reducerList from 'src/store/reducers'

const addClientAutoReducers = (userReducers: ReducersMapObject) => {
  const autoReducers = {
    intl: intlReducer,
    useFetch: fetchReducer,
  }
  return combineReducers({...autoReducers, ...userReducers})
}

const addServerAutoReducers = (userReducers: ReducersMapObject) => {
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

const createStore = (
  reducers: ReducersMapObject,
  initialState: Record<string, any> | undefined = undefined,
  isServer: boolean
) => {
  const autoReducers = isServer
    ? addServerAutoReducers(reducers)
    : addClientAutoReducers(reducers);

  const store = configureStore({
    reducer: autoReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(extraMiddlewares),
    preloadedState: initialState,
  });

  // Hot Module Replacement (HMR)
  if (module.hot) {
    module.hot.accept('src/store/reducers', async () => {
      // @ts-ignore
      const updatedReducers = (await import('src/store/reducers')).default;
      const newAutoReducers = isServer
        ? addServerAutoReducers(updatedReducers)
        : addClientAutoReducers(updatedReducers);
      store.replaceReducer(newAutoReducers);
    });
  }

  return store;
};



export const createServerStore = () => createStore(reducerList, undefined, true)

export const createClientStore = (initialState: any) => createStore(reducerList, initialState, false)


