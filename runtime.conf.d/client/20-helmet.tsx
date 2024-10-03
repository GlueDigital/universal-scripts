import { HelmetProvider } from 'react-helmet-async'
import defaultHeaders from '../../lib/header'
import { ClientRoot } from '../../lib/redux/types'

const addDefaultHeaders: ClientRoot = async (ctx, next) => {
  return (
    <HelmetProvider context={ctx.helmetContext}>
      {defaultHeaders(ctx.store)}
      {await next()}
    </HelmetProvider>
  )
}


export const reactRoot = addDefaultHeaders
