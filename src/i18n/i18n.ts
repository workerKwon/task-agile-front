import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import i18nEn from './messages/en.json'
import i18nKo from './messages/ko.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: { translation: i18nEn },
      ko: { translation: i18nKo }
    },

    /**
     * if you're using a language detector, do not define the lng option
     * 로컬스토리지에 language를 저장해놓는 경우 우선적으로 불러오도록
     */
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })

export default i18n
