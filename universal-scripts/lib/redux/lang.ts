import { updateIntl } from './slices'
// Imported from the project, so it only resolves there, as in store.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import locales from 'src/locales'

export function setLang(lang: string, setCookie = true) {
  if (setCookie) document.cookie = `lang=${lang}`
  return updateIntl({
    lang,
    messages: locales[lang]
  })
}
