import { IntlProvider } from 'react-intl'
import { updateIntl } from '../../lib/redux/slices'
import { useAppSelector } from '../../lib/redux/selector'
import { ClientInit, ClientRoot } from '../../lib/redux/types'

// @ts-ignore
import langs from 'src/locales'
import { ReactNode } from 'react'



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

const ReduxIntlProvider = ({ children }: { children: ReactNode }) => {
  const intl = useAppSelector((s)  => s.intl)
  return (
    <IntlProvider key={intl.lang} locale={intl.lang} messages={intl.messages}>
      {children}
    </IntlProvider>
  )
}

const renderIntlProvider: ClientRoot = async (ctx, next) =>
  <ReduxIntlProvider>
    {await next()}
  </ReduxIntlProvider>

export const reactRoot = renderIntlProvider
