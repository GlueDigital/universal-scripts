import { Routes, Route } from 'react-router'
import Home from './Home/Home'

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} index />
  </Routes>
)

export default App
