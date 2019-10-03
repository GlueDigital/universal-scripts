import { Switch, Route } from "react-router-dom"
import Home from './Home'

const App = () =>
  <Switch>
    <Route path="/" exact={true}>
      <Home />
    </Route>
  </Switch>

export default App
