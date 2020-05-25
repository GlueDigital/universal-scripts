import React from 'react'
import PropTypes from 'prop-types'
import { IntlProvider } from 'react-intl'
import { useSelector } from 'react-redux'
import { setLang } from 'universal-scripts'
import langs from 'src/locales'

const addIntl = (ctx, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = ctx.request.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = ctx.cookies.get('lang')
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  // Set it
  ctx.store && ctx.store.dispatch(setLang(lang))

  return next()
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

ReduxIntlProvider.propTypes = {
  children: PropTypes.node
}

const renderIntlProvider = async (ctx, next) =>
  <ReduxIntlProvider>
    {await next()}
  </ReduxIntlProvider>

export const reactRoot = renderIntlProvider
