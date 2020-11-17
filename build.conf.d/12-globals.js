const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())
const pkg = require(path.join(appDirectory, 'package.json'))

const enhancer = (opts = {}, config) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'
  const ssr = !pkg.universalOptions || !pkg.universalOptions.noSsr

  const definitions = {
    __PROD__: isProd,
    __DEV__: !isProd,
    __SERVER__: !!isServerSide,
    __CLIENT__: !isServerSide,
    __WATCH__: isWatch,
    __SSR__: ssr
  }
  if (!isServerSide) {
    for (const key in process.env) {
      definitions['process.env.' + key] = JSON.stringify(process.env[key])
    }
  }

  config.plugins.push(new webpack.DefinePlugin(definitions))

  return config
}

module.exports = {
  webpack: enhancer
}
