import { IntlProvider } from 'react-intl'
import { updateIntl } from '../../lib/redux/slices'
// @ts-ignore
import langs from 'src/locales'
import { useClientSelector } from 'lib/redux/selector'
import { ClientInit } from 'lib/redux/types'


const addClientIntl: ClientInit = (ctx, next) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  const storeIntl = ctx.store && ctx.store.getState().intl
  let lang = storeIntl && storeIntl.lang

  if (!lang) {
    lang = document.documentElement.lang ||
      window.navigator.language
  }
  lang = availableLangs.indexOf(lang) !== -1 ? lang : availableLangs[0]

  // Set it
  ctx.store && ctx.store.dispatch(
    updateIntl({ lang, messages: langs[lang] })
  )

  return next()
}

export const clientInit = addClientIntl

const ReduxIntlProvider = ({ children }) => {
  const intl = useClientSelector((s)  => s.intl)
  return (
    <IntlProvider key={intl.lang} locale={intl.lang} messages={intl.messages}>
      {children}
    </IntlProvider>
  )
}

const renderIntlProvider = async (ctx, next) =>
  <ReduxIntlProvider>
    {await next()}
  </ReduxIntlProvider>

export const reactRoot = renderIntlProvider
