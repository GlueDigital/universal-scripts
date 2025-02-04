import { NextFunction, Request } from 'express';
import { extractUsedEnvVariables } from 'lib/vars/getUsedEnvVars';

const getAllVariables = async (req: Request, res: Response, next: NextFunction) => {
  const envVars = extractUsedEnvVariables()
  const envWithValues = Object.fromEntries(Object.entries(process.env).filter(([key]) => envVars.includes(key)))
  await next()
}

export const serverMiddleware = getAllVariables