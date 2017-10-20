import React from 'react'
import Helmet from 'react-helmet'

// These are the default headers that can be overriden on app code.
export const defaultHeaders = () => (
  <Helmet>
    <meta charSet="utf-8" />
    <meta name="viewport"
      content="width=device-width,minimum-scale=1,initial-scale=1" />
  </Helmet>
)

export default defaultHeaders
