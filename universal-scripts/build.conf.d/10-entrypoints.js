import fs from 'fs'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpackPackage from 'webpack'
import { fileURLToPath } from 'url'

const { HotModuleReplacementPlugin } = webpackPackage

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appDirectory = fs.realpathSync(process.cwd())

const enhancer = (opts = {}, config) => {
  const isWatch = opts.isWatch

  if (opts.id === 'server') {
    // For the in-memory server side HMR, we need to run the server outside
    // of the build, as it will contain the dev server, and do HMR for the part
    // which is built.
    // But when doing a static build, we want the entire server on the output.
    const serverPath = path.resolve(__dirname, '..', 'server')
    if (isWatch) {
      config.entry = {
        server: [path.resolve(serverPath, 'serverMiddleware')]
      }
      config.output.libraryTarget = 'commonjs2'
    } else {
      config.entry = {
        server: [path.resolve(serverPath, 'main')]
      }
    }

    return config
  }

  if (opts.id === 'client') {
    // Add our render entrypoint
    config.entry = {
      main: [path.resolve(__dirname, '..', 'client', 'init')]
    }

    if (!isWatch) {
      // Copy static assets to output dir
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(appDirectory, 'src', 'static'),
              to: path.resolve(appDirectory, 'build', 'client')
            }
          ]
        })
      )
    } else {
      config.plugins.push(new HotModuleReplacementPlugin())
      config.entry.main.push(
        'webpack-hot-middleware/client?reload=true&noInfo=true'
      )
    }
    return config
  }

  // For other extraneous builds, add some sane defaults,
  // even if they will most likely be overriden
  config.entry = {
    main: [path.resolve(appDirectory, 'src', opts.id)]
  }

  return config
}

export const webpack = enhancer
