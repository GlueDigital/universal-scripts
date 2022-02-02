// Exports for user-code
const langs = require('src/locales').default
// import { updateIntl } from 'react-intl-redux'

const CLEANUP = '@@universal-scripts/cleanup'
const REQUEST_INIT = '@@universal-scripts/request-init'
const CLIENT_INIT = '@@universal-scripts/client-init'
const UPDATE_INTL = '@@intl/UPDATE'

const setLang = lang => ({
  type: UPDATE_INTL,
  payload: {
    locale: lang,
    messages: langs[lang]
  }
})

module.exports = {
  CLEANUP,
  REQUEST_INIT,
  CLIENT_INIT,
  UPDATE_INTL,
  setLang
}
