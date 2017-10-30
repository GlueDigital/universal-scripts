import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import { Provider, updateIntl } from 'react-intl-redux'
import { addLocaleData } from 'react-intl'

import locales, { localeData } from 'src/locales'
import routes from 'src/routes'

import { createStore } from '../lib/store'
import { fetchMiddleware } from '../lib/fetchData'
import defaultHeaders from '../lib/header'

// Used only if we're missing the initial state (e.g. no server-side rendering)
const fakeInitialState = () => {
  const browserLang = window.navigator.language || window.navigator.userLanguage
  const availableLangs = Object.keys(locales)
  const lang =
    availableLangs.indexOf(browserLang) !== -1 ? browserLang : availableLangs[0]
  return { intl: { locale: lang } }
}

const MOUNT_NODE = document.getElementById('root')

// Configure history
const history = browserHistory

// Initialize store
const initialState = window.___INITIAL_STATE__ || fakeInitialState()
initialState.intl.messages = locales[initialState.intl.locale]
const store = createStore(initialState)

// Hook so user can add other locale data
addLocaleData(localeData)

// Configure router middlewares
const middlewares = applyRouterMiddleware(fetchMiddleware(store))

// Initialize react-helmet defaults
// We do it off-DOM because Helmet doesn't mind it, and <Provider> can
// only take one child, so it can't be done there.
ReactDOM.render(defaultHeaders(store), document.createElement('div'))

// Render function
let render = (routerKey = null) => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <Router history={history} key={routerKey} render={middlewares}>
        {routes()}
      </Router>
    </Provider>,
    MOUNT_NODE
  )
}

// Enable HMR
if (module.hot) {
  // Routes (applies to any children too)
  module.hot.accept(['src/routes'], () => render(Math.random()))
  // Intl
  module.hot.accept(['src/locales'], () => {
    const currentLang = store.getState().intl.locale
    store.dispatch(updateIntl({
      locale: currentLang,
      messages: locales[currentLang]
    }))
  })
}

// Initial render
render()
