const { createAction } = require('@reduxjs/toolkit')

// Exports for user-code
const langs = require('src/locales').default
// import { updateIntl } from 'react-intl-redux'

const cleanup = createAction('@@universal-scripts/cleanup')
const updateIntl = createAction('@@intl/UPDATE')

const setLang = lang => ({
  type: UPDATE_INTL,
  payload: {
    locale: lang,
    messages: langs[lang]
  }
})

module.exports = {
  cleanup,
  updateIntl,
  setLang
}
