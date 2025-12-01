import { useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route }from 'react-router-dom'
import Homepage from './pages/Homepage'

function App() {

  return (
    <Router>
      <div className='w-max-[1800px] h-full'>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
