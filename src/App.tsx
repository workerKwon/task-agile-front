// import { useState } from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import BoardPage from './pages/BoardPage'
import RegisterPage from './pages/RegisterPage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

library.add(faUserSecret)

const App = () => {
  // const [count, setCount] = useState(0)

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/board' element={<BoardPage />} />
          <Route path='/card/:cardId/:cardTitle' element={<BoardPage />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
