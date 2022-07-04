// import { useState } from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import BoardPage from './pages/BoardPage'
import RegisterPage from './pages/RegisterPage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import bus from './event-bus'

library.add(faUserSecret)

const App = () => {
  const navigate = useNavigate()
  bus.on('user.unauthenticated', () => {
    navigate('/login')
  })

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/board/:boardId' element={<BoardPage />} />
      <Route path='/card/:cardId/:cardTitle' element={<BoardPage />} />
    </Routes>
  )
}

export default App
