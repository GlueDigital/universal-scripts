import { ClientRoot } from '../../lib/redux/types'
import { BrowserRouter } from 'react-router'
// @ts-expect-error Imported from the project
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
