import errorParser from '../../utils/error-parser'
import axios from 'axios'

type MyData = {
  user: { name: string, authenticated: boolean},
  teams: [],
  boards: []
}

export default {
  signOut () {
    return new Promise((resolve, reject) => {
      axios.post('/me/logout')
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getMyData () {
    return new Promise<MyData>((resolve, reject) => {
      axios.get('/me')
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(errorParser.parse(error))
        })
    })
  }
}