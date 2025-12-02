import { useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route }from 'react-router-dom'
import Homepage from './pages/Homepage'
import ChatsPage from './pages/ChatsPage'
import TextingPage from './pages/TextingPage'


function App() {

  return (
    <Router>
      <div className='w-max-[1800px] h-full'>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/chats' element={<ChatsPage/>}/>
          <Route path='/chats/:roomid' element={<TextingPage/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
