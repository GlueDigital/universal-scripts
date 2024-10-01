
import { BrowserRouter } from 'react-router-dom'
// @ts-ignore
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
