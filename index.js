const locales = require('src/locales').default

const { cleanup, clientInit } = require('./lib/redux/actions')
const { updateIntl, requestInit } = require('./lib/redux/slices')

const { useAppDispatch, useAppSelector } = require('./lib/redux/selector')


const setLang = (lang, setCookie = true) => {
  if (setCookie) document.cookie = `lang=${lang}`
  updateIntl({
    lang,
    messages: locales[lang]
  })
}

module.exports = {
  cleanup,
  clientInit,
  updateIntl,
  requestInit,
  useAppDispatch,
  useAppSelector,
  setLang
}
