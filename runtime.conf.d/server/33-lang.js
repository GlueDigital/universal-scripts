import React from 'react'
import { IntlProvider } from 'react-intl'
import { useSelector } from 'react-redux'
import { updateIntl } from '../../lib/redux/slices'
import langs from 'src/locales'

const addIntl = async (req, res, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = req.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = req.cookies['lang']
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  // Set it
  req.store && req.store.dispatch(updateIntl({ lang, messages: langs[lang] }))

  return await next()
}

export const serverMiddleware = addIntl

const ReduxIntlProvider = ({ children }) => {
  const intl = useSelector(s => s.intl)
  return (
    <IntlProvider key={intl.lang} locale={intl.lang} messages={intl.messages}>
      {children}
    </IntlProvider>
  )
}

const renderIntlProvider = async (req, res, next) =>
  <ReduxIntlProvider>
    {await next()}
  </ReduxIntlProvider>

export const reactRoot = renderIntlProvider
