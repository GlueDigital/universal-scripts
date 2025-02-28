import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const enhancer = (opts = {}, config) => {
  if (!opts.ssg || opts.id !== 'server') return config

  const serverPath = resolve(__dirname, '..', 'server')

  config.entry.server = [resolve(serverPath, 'ssg-main')]

  return config
}

export const webpack = enhancer
