import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes from 'src/routes'

const MOUNT_NODE = document.getElementById('root')

// Configure history
const history = browserHistory

// Render function
let render = (routerKey = null) => {
  ReactDOM.render(
    <Router history={history} key={routerKey}>
      {routes()}
    </Router>,
    MOUNT_NODE
  )
}

// Enable HMR
if (module.hot) {
  module.hot.accept(['src/routes'], () => render(Math.random()))
}

// Initial render
render()
