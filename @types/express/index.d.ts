import * as express from 'express'
import { StatsCompilation } from 'webpack/types'
import { HelmetServerState } from 'react-helmet-async'
import { StaticRouterContext } from 'react-router'
import { PipeableStream } from 'react-dom/server'
import { ReactNode } from 'react'

declare global {
  namespace Express {
    interface Request {
      clientStats: StatsCompilation
      assets: {
        scripts: string[],
        styles: string[]
      }
      helmetContext: {
        helmet: HelmetServerState
      }
      renderCtx: StaticRouterContext
      stream: PipeableStream
      triggerHook: (name: string) => (req: Request, res: Response, initial: boolean) => ReactNode
    }
  }
}