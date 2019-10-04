// Exports for user-code
import { useFetch } from './lib/hooks'
import langs from 'src/locales'
import { updateIntl } from 'react-intl-redux'

export const CLEANUP = '@@universal-scripts/cleanup'
export const REQUEST_INIT = '@@universal-scripts/request-init'
export const CLIENT_INIT = '@@universal-scripts/client-init'

export const setLang = lang => updateIntl({
  locale: lang,
  messages: langs[lang]
})

export { useFetch }
