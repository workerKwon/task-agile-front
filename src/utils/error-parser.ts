import { AxiosError } from 'axios'
import bus from '../event-bus'

export default {
  parse(error: AxiosError) {
    if (error.message) {
      const status = error.response?.status

      if (status === 401) {
        bus.emit('user.unauthenticated')
        return new Error('unauthenticated error')
      }
    }
  }
}