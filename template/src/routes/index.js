import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'

const App = () =>
  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>
  </Switch>

export default App
