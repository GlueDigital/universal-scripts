import React from 'react'
import PropTypes from 'prop-types'
import { IntlProvider } from 'react-intl'
import { useSelector } from 'react-redux'
import { setLang } from 'universal-scripts'
import langs from 'src/locales'

const addClientIntl = (ctx, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  const storeIntl = ctx.store && ctx.store.getState().intl
  let lang = storeIntl && storeIntl.locale
  if (!lang) {
    lang = document.documentElement.lang ||
      window.navigator.language || window.navigator.userLanguage
  }
  lang = availableLangs.indexOf(lang) !== -1 ? lang : availableLangs[0]

  // Set it
  ctx.store && ctx.store.dispatch(setLang(lang))

  return next()
}

export const clientInit = addClientIntl

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
