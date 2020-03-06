import React from 'react'
import { Provider, updateIntl } from 'react-intl-redux'
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
  ctx.store && ctx.store.dispatch(updateIntl({
    locale: lang,
    messages: langs[lang]
  }))

  return next()
}

export const clientInit = addClientIntl

const renderIntlProvider = async (ctx, next) =>
  <Provider store={ctx.store}>
    {await next()}
  </Provider>

export const reactRoot = renderIntlProvider
