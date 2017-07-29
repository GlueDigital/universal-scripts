import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import routes from 'src/routes'

import { createStore } from '../lib/store'

const MOUNT_NODE = document.getElementById('root')

// Configure history
const history = browserHistory

// Initialize store
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState)

// Render function
let render = (routerKey = null) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} key={routerKey}>
        {routes()}
      </Router>
    </Provider>,
    MOUNT_NODE
  )
}

// Enable HMR for routes
if (module.hot) {
  module.hot.accept(['src/routes'], () => render(Math.random()))
}

// Initial render
render()
