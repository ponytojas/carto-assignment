import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Flow } from './components/flow/Flow'
import { Map } from './pages/map/Map'
import { Toaster } from 'sonner'

function App (): JSX.Element {
  return (
    <>
      <Toaster richColors position='top-center' />
      <Router>
        <Routes>
          <Route path='/' element={<Flow />} />
          <Route path='/flow' element={<Flow />} />
          <Route path='/map' element={<Map />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
