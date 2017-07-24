'use strict'

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())

module.exports = (opts = {}) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch

  const styleLoader = {
    loader: require.resolve('style-loader')
  }

  const cssLoader = {
    loader: require.resolve('css-loader'),
    query: {
      sourceMap: true,
      minimize: true,
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions']
      },
      discardComments: {
        removeAll: true
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true
    }
  }

  const sassLoader = {
    loader: require.resolve('sass-loader'),
    options: {
      sourceMap: true,
      includePaths: [path.resolve('appDirectory', 'src', 'styles')]
    }
  }

  let config = {
    name: isServerSide ? 'server' : 'client',
    devtool: 'cheap-module-source-map',
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
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV === 'development',
        __PROD__: process.env.NODE_ENV === 'production',
        __SERVER__: isServerSide,
        __CLIENT__: !isServerSide,
        __WATCH__: isWatch
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
        }, {
          test: /\.(scss|sass)$/,
          use: [ styleLoader, cssLoader, sassLoader ]
        }, {
          test: /\.css$/,
          use: [ styleLoader, cssLoader ]
        }
      ]
    }
  }

  if (isWatch) {
    // Only add HMR code when we're watching for code changes
    config.plugins.push(new webpack.HotModuleReplacementPlugin({ quiet: true }))
  }

  if (isServerSide) {
    // For the in-memory server side HMR, we need to run the server outside
    // of the build, as it will contain the dev server, and do HMR for the part
    // which is built.
    // But when doing a static build, we want the entire server on the output.
    const serverPath = path.resolve(__dirname, '..', 'server')
    if (isWatch) {
      config.entry = [ path.resolve(serverPath, 'lib', 'routerMiddleware') ]
    } else {
      config.entry = [ path.resolve(serverPath, 'main') ]
    }
    config.externals = [require('webpack-node-externals')()]
  } else {
    config.entry = [
      'webpack-hot-middleware/client?name=client',
      path.resolve(__dirname, '..', 'client', 'init'),
      path.resolve(appDirectory, 'src', 'index.js')
    ]
  }

  return config
}
