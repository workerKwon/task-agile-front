import api from '../../axios/api'

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
  }
}