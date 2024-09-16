import React from 'react'
import { IntlProvider } from 'react-intl'
import { useSelector } from 'react-redux'
import { setLang } from 'universal-scripts'
import langs from 'src/locales'

const addIntl = async (req, res, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = req.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = req.cookies['lang']
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  // Set it
  req.store && req.store.dispatch(setLang(lang))

  return await next()
}

export const serverMiddleware = addIntl

const ReduxIntlProvider = ({ children }) => {
  const intl = useSelector(s => s.intl)
  return (
    <IntlProvider key={intl.locale} {...intl}>
      {children}
    </IntlProvider>
  )
}

const renderIntlProvider = async (req, res, next) =>
  <ReduxIntlProvider>
    {await next()}
  </ReduxIntlProvider>

export const reactRoot = renderIntlProvider
