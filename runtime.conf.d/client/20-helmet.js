import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import defaultHeaders from '../../lib/header'

const addDefaultHeaders = async (ctx, next) => {
  return (
    <HelmetProvider context={ctx.helmetContext}>
      {defaultHeaders(ctx.store)}
      {await next()}
    </HelmetProvider>
  )
}


export const reactRoot = addDefaultHeaders
