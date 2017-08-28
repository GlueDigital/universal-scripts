import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import { Provider, updateIntl } from 'react-intl-redux'
import { addLocaleData } from 'react-intl'

import locales, { localeData } from 'src/locales'
import routes from 'src/routes'

import { createStore } from '../lib/store'
import { fetchMiddleware } from '../lib/fetchData'

const MOUNT_NODE = document.getElementById('root')

// Configure history
const history = browserHistory

// Initialize store
const initialState = window.___INITIAL_STATE__
initialState.intl.messages = locales[initialState.intl.locale]
const store = createStore(initialState)

// Hook so user can add other locale data
addLocaleData(localeData)

// Configure router middlewares
const middlewares = applyRouterMiddleware(fetchMiddleware(store))

// Render function
let render = (routerKey = null) => {
  ReactDOM.render(
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