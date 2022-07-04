import api from '../../axios/api'
import errorParser from '../../utils/error-parser'

type MyData = {
  user: { name: string, authenticated: boolean},
  teams: [],
  boards: []
}

export default {
  signOut () {
    return new Promise((resolve, reject) => {
      api.post('/me/logout')
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
      api.get('/me')
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(errorParser.parse(error))
        })
    })
  }
}