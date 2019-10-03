import React from 'react'
import { Provider, updateIntl } from 'react-intl-redux'
import langs from 'src/locales'

const addIntl = (ctx, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = ctx.request.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = ctx.cookies.get('lang')
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  ctx.store && ctx.store.dispatch(updateIntl({
    locale: lang,
    messages: langs[lang]
  }))

  return next()
}

export const serverMiddleware = addIntl

const renderIntlProvider = async (ctx, next) =>
  <Provider store={ctx.store}>
    {await next()}
  </Provider>

export const reactRoot = renderIntlProvider
