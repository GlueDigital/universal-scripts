import { createServerStore } from '../../lib/redux/store'
import { Provider } from 'react-redux'
import { cleanup } from '../../lib/redux/actions'
import { requestInit } from '../../lib/redux/slices'
import jsesc from 'jsesc'
import { NextFunction, Request, Response } from 'express'
import { ReactNode } from 'react'

const addRedux = async (req: Request, res: Response, next: NextFunction) => {
  const store = createServerStore()

  store.dispatch(requestInit(
    {
      headers: req.headers,
      origin: req.get('origin'),
      path: req.path,
      ip: req.ip,
      cookies: parseCookies(req.headers.cookie),
      ...req.initExtras // Allow passing in data from previous middlewares
    }
  ))

  // Make it available through the context
  req.store = store

  // Run any other middlewares
  await next()

  // Clean up the resulting state
  store.dispatch(cleanup())
  const state = store.getState()
  const copyState = structuredClone(state)
  delete copyState.req // This reducer doesn't exist client-side

  // Send store contents along the page
  const storeOutput = jsesc(copyState, { isScriptContext: true })
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

const renderIntlProvider = async (req: Request, res: Response, next: () => Promise<ReactNode>) =>
  <Provider store={req.store}>
    {await next()}
  </Provider>

export const reactRoot = renderIntlProvider
