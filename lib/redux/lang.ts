import { updateIntl } from './slices'
import locales from 'src/locales'

export function setLang (lang: string, setCookie = true) {
  if (setCookie) document.cookie = `lang=${lang}`
  return updateIntl({
    lang,
    messages: locales[lang]
  })
}