import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n/i18n'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.headers.common.Accept = 'application/json'
axios.interceptors.response.use(
  response => response,
  (error) => {
    return Promise.reject(error)
  }
)


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
