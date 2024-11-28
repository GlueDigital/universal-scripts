import locales from 'src/locales'
import { cleanup, clientInit } from './lib/redux/actions.ts'
import { updateIntl, requestInit } from './lib/redux/slices.ts'
import { useAppDispatch, useAppSelector } from './lib/redux/selector.ts'

const setLang = (lang, setCookie = true) => {
  if (setCookie) document.cookie = `lang=${lang}`
  updateIntl({
    lang,
    messages: locales[lang]
  })
}

export {
  cleanup,
  clientInit,
  updateIntl,
  requestInit,
  useAppDispatch,
  useAppSelector,
  setLang
}