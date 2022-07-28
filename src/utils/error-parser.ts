import _ from 'lodash'
import { AxiosError } from 'axios'
import globalBus from '../event-bus'
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
        globalBus.emit('user.unauthenticated')
        return new Error('unauthenticated error')
      } else if (status === 403) {
        return new Error(i18n.t('error.request.forbidden'))
      } else if (status === 404) {
        return new Error(i18n.t('error.request.notFound'))
      } else if (status === 500) {
        if (data && data.message) {
          return new Error(data.message)
        } else {
          return new Error(i18n.t('error.request.unknownServerError'))
        }
      } else {
        return new Error(i18n.t('error.request.failed'))
      }
    } else if (error.request) {
      return new Error(i18n.t('error.request.noResponse'))
    } else {
      return _.isError(error) ? error : new Error(error)
    }
  }
}