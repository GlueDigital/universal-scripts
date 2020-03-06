import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from 'src/routes'

const routerRoot = (ctx) => {
  // On the client, just use BrowserRouter
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export const reactRoot = routerRoot
