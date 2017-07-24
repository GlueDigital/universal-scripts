'use strict'

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())

module.exports = (isServerSide) => {
  let config = {
    name: isServerSide ? 'server' : 'client',
    target: isServerSide ? 'node' : 'web',
    output: {
      path: path.resolve(
        appDirectory, 'build', isServerSide ? 'server' : 'client'),
      pathinfo: true,
      filename: isServerSide ? 'server.js' : 'main.js',
      publicPath: '/'
    },
    resolve: {
      alias: {
        'any-promise': 'core-js/fn/promise' // Prevents warning on webpack
      },
      extensions: ['.js', '.jsx', '.json'],
      modules: [
        path.resolve(__dirname, '..', 'node_modules'),
        path.resolve(appDirectory, 'node_modules'),
        appDirectory
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({ quiet: true }),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV === 'development',
        __PROD__: process.env.NODE_ENV === 'production',
        __SERVER__: isServerSide,
        __CLIENT__: !isServerSide
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('babel-preset-react-app')],
            cacheDirectory: true
          }
        }
      ]
    }
  }

  if (isServerSide) {
    config.entry = [
      path.resolve(__dirname, '..', 'server', 'lib', 'routerMiddleware')
    ]
  } else {
    config.entry = [
      'webpack-hot-middleware/client?name=client',
      path.resolve(__dirname, '..', 'client', 'init'),
      path.resolve(appDirectory, 'src', 'index.js')
    ]
  }

  return config
}
