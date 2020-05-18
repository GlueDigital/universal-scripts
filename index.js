// Exports for user-code
import langs from 'src/locales'
// import { updateIntl } from 'react-intl-redux'

export const CLEANUP = '@@universal-scripts/cleanup'
export const REQUEST_INIT = '@@universal-scripts/request-init'
export const CLIENT_INIT = '@@universal-scripts/client-init'
export const UPDATE_INTL = '@@intl/UPDATE'

export const setLang = lang => ({
  type: UPDATE_INTL,
  payload: {
    locale: lang,
    messages: langs[lang]
  }
})
