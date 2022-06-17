import api from '../../axios/api'

interface RegisterForm {
  username: string
  emailAddress: string
  firstName: string
  lastName: string
  password: string
}

export default {
  register(form: RegisterForm) {
    return new Promise((resolve, reject) => {
      api.post('/registrations', form)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}