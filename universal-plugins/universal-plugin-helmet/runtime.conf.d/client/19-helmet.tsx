import { Helmet, HelmetProvider } from 'react-helmet-async'
import { defaultHeaders } from '../../lib/headers'

const addDefaultHeaders = async (ctx, next) => {
  return (
    <HelmetProvider context={ctx.helmetContext}>
      <Helmet>{defaultHeaders(ctx.store)}</Helmet>
      {await next()}
    </HelmetProvider>
  )
}

export const reactRoot = addDefaultHeaders
