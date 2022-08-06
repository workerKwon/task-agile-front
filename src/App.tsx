import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
import { useEffect, useLayoutEffect, useRef } from 'react'

library.add(fas)

const App = () => {
  const navigate = useNavigate()

  const location = useLocation()

  useLayoutEffect(() => {
    globalBus.$on('myDataFetched', (myData: { settings: { realTimeServerUrl: string }; user: { token: string } }) => {
      realTimeClient.init(myData.settings.realTimeServerUrl, myData.user.token)
    })
    globalBus.$on('user.unauthenticated', () => {
      navigate('/login')
    })
  }, [])

  const fromRouteRef = useRef('')
  const fromBoardIdRef = useRef<string>()

  useEffect(() => {
    if (fromBoardIdRef.current) {
      if (location.pathname.match('board') && fromRouteRef.current.match('board')) {
        realTimeClient.unsubscribe('/board/' + fromBoardIdRef.current, (data) => onRealTimeUpdated(data))
      }

      if (!location.pathname.match('card')) {
        realTimeClient.unsubscribe('/board/' + fromBoardIdRef.current, (data) => onRealTimeUpdated(data))
      }
    }

    fromRouteRef.current = location.pathname
    if (location.pathname.match('board')) {
      fromBoardIdRef.current = location.pathname.split('/')[2]
    }
  }, [location])

  function onRealTimeUpdated (update: { type: string; card: Card; cardList: CardList }) {
    console.log('[BoardPage] Real time update received', update)
  }

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/board/:boardId' element={<BoardPage />} />
      <Route path='/card/:cardId/:cardTitle' element={<BoardPage />} />
    </Routes>
  )
}

export default App
