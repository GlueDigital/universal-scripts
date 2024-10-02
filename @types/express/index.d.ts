import * as express from 'express'
import { StatsCompilation } from 'webpack/types'
import { HelmetServerState } from 'react-helmet-async'

declare global {
  namespace Express {
    interface Request {
      clientStats: StatsCompilation
      assets: {
        scripts: string[],
        styles: string[]
      }
      helmetContext: HelmetServerState
    }
  }
}