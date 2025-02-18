import { ClientRoot } from '../../lib/redux/types'
import { BrowserRouter } from 'react-router-dom'
// @ts-ignore
import App from 'src/routes'

const routerRoot: ClientRoot = () => {
  // On the client, just use BrowserRouter
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export const reactRoot = routerRoot
