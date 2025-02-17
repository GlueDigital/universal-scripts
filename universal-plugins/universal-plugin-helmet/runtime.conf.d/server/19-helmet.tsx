import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Request, Response } from 'express'
import { ReactNode } from 'react'
import { defaultHeaders } from '../../lib/headers'

export const extraHead = (req, res) => {
  const head = req.helmetContext.helmet
  return head
}

const addHelmet = async (
  req: Request,
  res: Response,
  next: () => Promise<ReactNode>
) => {
  if (!req.helmetContext) {
    req.helmetContext = {
      helmet: null
    }
  }
  return (
    <HelmetProvider context={req.helmetContext}>
      <Helmet>{defaultHeaders(req.store)}</Helmet>
      {await next()}
    </HelmetProvider>
  )
}

export const reactRoot = addHelmet
