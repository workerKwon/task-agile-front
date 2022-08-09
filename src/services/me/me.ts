import errorParser from '../../utils/error-parser'
import axios from 'axios'
import globalBus from '../../event-bus'

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
          globalBus.$emit('myDataFetched', data)
        })
        .catch((error) => {
          reject(errorParser.parse(error))
        })
    })
  },
  getSearchedItem(text: string) {
    return new Promise<{boards: [], cards: []}>((resolve, reject) => {
      axios.get('/search/' + text)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(errorParser.parse(error))
        })
    })
  }
}