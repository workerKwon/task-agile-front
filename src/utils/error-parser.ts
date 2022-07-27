import { AxiosError } from 'axios'
import bus from '../event-bus'
import i18n from '../i18n/i18n'

export default {
  parse(error: AxiosError) {
    if (error.message) {
      const status = error.response?.status
      const data: any = error.response?.data

      if (status === 400) {
        if (data && data.message) {
          return new Error(data.message)
        } else {
          return new Error(i18n.t('error.request.bad'))
        }
      } else if (status === 401) {
        bus.emit('user.unauthenticated')
        return new Error('unauthenticated error')
      }
    }
  }
}