const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())
const pkg = require(path.join(appDirectory, 'package.json'))

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
  if (opts.id === 'client') {
    definitions['process.env'] = {}
    for (const key in process.env) {
      definitions['process.env.' + key] = JSON.stringify(process.env[key])
    }
  }

  if (!config.plugins) config.plugins = []
  config.plugins.push(new webpack.DefinePlugin(definitions))

  return config
}

module.exports = {
  webpack: enhancer
}
