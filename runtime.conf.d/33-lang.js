import React from 'react'
import { Provider, updateIntl } from 'react-intl-redux'
import langs, { localeData } from 'src/locales'
import { addLocaleData } from 'react-intl'

const addIntl = (ctx, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = ctx.request.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = ctx.cookies.get('lang')
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  // Set it
  ctx.store && ctx.store.dispatch(updateIntl({
    locale: lang,
    messages: langs[lang]
  }))

  return next()
}

export const serverMiddleware = addIntl

const addClientIntl = (ctx, next) => {
  // Add locale data
  addLocaleData(localeData)

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
