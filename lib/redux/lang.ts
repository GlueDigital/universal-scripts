import { updateIntl } from './slices'
const locales = require('src/locales').default

export function setLang (lang: string, setCookie = true) {
  if (setCookie) document.cookie = `lang=${lang}`
  return updateIntl({
    lang,
    messages: locales[lang]
  })
}