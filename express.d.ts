import * as express from 'express'

declare global {
  namespace Express {
    interface Request {
      customProperty?: string
      anotherProperty?: number
    }
  }
}