import { Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import BoardPage from './pages/BoardPage'
import RegisterPage from './pages/RegisterPage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import './App.scss'
import globalBus from './event-bus'
import realTimeClient from './real-time-client'
import { useLayoutEffect } from 'react'

library.add(fas)

const App = () => {
  const navigate = useNavigate()

  useLayoutEffect(() => {
    globalBus.$on('myDataFetched', (myData: { settings: { realTimeServerUrl: string }; user: { token: string } }) => {
      realTimeClient.init(myData.settings.realTimeServerUrl, myData.user.token)
    })
    globalBus.$on('user.unauthenticated', () => {
      navigate('/login')
    })
  }, [])

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
