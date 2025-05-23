import { IntlProvider } from 'react-intl'
import { updateIntl } from '../../lib/redux/slices'
import { NextFunction, Request, Response } from 'express'
import { useServerSelector } from '../../lib/redux/selector'
import { ReactNode } from 'react'
// @ts-expect-error Imported from the project
import langs from 'src/locales'

const addIntl = async (req: Request, res: Response, next: NextFunction) => {
  // Determine language
  const availableLangs = Object.keys(langs)
  let lang = req.acceptsLanguages(availableLangs) || availableLangs[0]
  const forceLang = req.cookies['lang']
  if (forceLang && availableLangs.indexOf(forceLang) >= 0) lang = forceLang

  // Set it
  if (req.store) req.store.dispatch(updateIntl({ lang, messages: langs[lang] }))

  return await next()
}

export const serverMiddleware = addIntl

const ReduxIntlProvider = ({ children }: { children: ReactNode }) => {
  const intl = useServerSelector((s) => s.intl)
  return (
    <IntlProvider key={intl.lang} locale={intl.lang} messages={intl.messages}>
      {children}
    </IntlProvider>
  )
}

const renderIntlProvider = async (
  req: Request,
  res: Response,
  next: () => Promise<ReactNode>
) => <ReduxIntlProvider>{await next()}</ReduxIntlProvider>

export const reactRoot = renderIntlProvider
