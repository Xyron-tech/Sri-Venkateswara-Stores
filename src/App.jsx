import { Routes, Route } from 'react-router-dom'
import Invoice from './components/Invoice'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Invoice />} />
      {/* <Route path="/preview" element={<PdfGenerate />} /> */}
    </Routes>
  )
}

export default App