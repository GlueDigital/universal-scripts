import { Routes, Route } from 'react-router'
import Home from './Home/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} index />
    </Routes>
  )
}
