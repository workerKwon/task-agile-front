import api from '../../axios/api'

export default {
  authenticate(detail: LoginForm) {
    return new Promise((resolve, reject) => {
      api.post('/authentications', detail)
        .then((res) => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}