import fs from 'fs'
import path from 'path'
import webpackPackage from 'webpack'

const { DefinePlugin } = webpackPackage

const appDirectory = fs.realpathSync(process.cwd())

const pkg = (
  await import(path.join(appDirectory, 'package.json'), {
    assert: { type: 'json' }
  })
).default

const enhancer = (opts = {}, config) => {
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'
  const ssr = !pkg.universalOptions || !pkg.universalOptions.noSsr

  const definitions = {
    __BUILD__: opts.id,
    __PROD__: isProd,
    __DEV__: !isProd,
    __SERVER__: opts.id === 'server',
    __CLIENT__: opts.id === 'client',
    __WATCH__: isWatch,
    __SSR__: ssr
  }

  if (!config.plugins) config.plugins = []
  if (opts.id === 'client') {
    config.plugins.push(
      new DefinePlugin({
        ...definitions,
        'process.env': 'window.__ENV_VARS__'
      })
    )
  } else {
    config.plugins.push(new DefinePlugin(definitions))
  }

  return config
}

export const webpack = enhancer
