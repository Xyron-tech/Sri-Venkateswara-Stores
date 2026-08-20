import { Routes, Route } from 'react-router-dom'
import Invoice from './components/Invoice'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Invoice />} />
    </Routes>
  )
}

export default App