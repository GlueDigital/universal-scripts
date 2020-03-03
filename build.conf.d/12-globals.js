const webpack = require('webpack')

const enhancer = (opts = {}, config) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const definitions = {
    __PROD__: isProd,
    __DEV__: !isProd,
    __SERVER__: !!isServerSide,
    __CLIENT__: !isServerSide,
    __WATCH__: isWatch
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
