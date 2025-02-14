import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

export class EnvReloadPlugin {
  constructor() {
    this.envPath = path.resolve(process.cwd(), '.env')
  }

  apply(compiler) {
    let recompiling = false

    compiler.hooks.afterPlugins.tap('ReloadDotenvPlugin', () => {
      fs.watchFile(this.envPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime && !recompiling) {
          recompiling = true

          console.log('🔄 File .env changed, reloading vars...')

          dotenv.config({ path: this.envPath, override: true })

          if (compiler.watching) {
            compiler.watching.invalidate(() => {
              console.log('♻ Webpack recompiling with new .env vars')

              if (compiler.webpackHotMiddleware) {
                compiler.webpackHotMiddleware.publish({ action: 'reload-page' })
              }

              setTimeout(() => (recompiling = false), 1000)
            })
          }
        }
      })
    })
  }
}
