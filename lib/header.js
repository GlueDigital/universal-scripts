import React from 'react'
import Helmet from 'react-helmet'

// These are the default headers that can be overriden on app code.
export const defaultHeaders = (store) => {
  const state = store.getState()
  const lang = state.intl.locale
  return (
    <Helmet>
      <html lang={lang} />
      <meta charSet="utf-8" />
      <meta name="viewport"
        content="width=device-width,minimum-scale=1,initial-scale=1" />
    </Helmet>
  )
}

export default defaultHeaders
