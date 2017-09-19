'use strict'

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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

  const sassChain = [ cssLoader, sassLoader ]
  const cssChain = [ cssLoader ]
  if (!isServerSide) {
    sassChain.unshift(styleLoader)
    cssChain.unshift(styleLoader)
  }

  const definitions = {
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
    __SERVER__: isServerSide,
    __CLIENT__: !isServerSide,
    __WATCH__: isWatch
  }
  if (!isServerSide) {
    definitions['process.env'] = {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
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
      filename: isServerSide ? 'server.js' : 'main.[hash].js',
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
      new webpack.DefinePlugin(definitions),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /universal-scripts\/node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('babel-preset-react-app')],
            cacheDirectory: true
          }
        }, {
          test: /\.(scss|sass)$/,
          use: sassChain
        }, {
          test: /\.css$/,
          use: cssChain
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
    // Don't bundle node_modules for the server: node can access it directly
    config.externals = [require('webpack-node-externals')()]
  } else {
    // Add our render entrypoint, and the user custom one
    config.entry = [
      path.resolve(__dirname, '..', 'client', 'init'),
      path.resolve(appDirectory, 'src', 'index.js')
    ]
    // On watch mode, add the WHM client to do HMR
    if (isWatch) {
      config.entry.unshift('webpack-hot-middleware/client?name=client')
    }
    // Production builds get minified JS
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false
        }
      }))
    }
    // Non-watch builds get CSS on a separate file
    if (!isWatch) {
      config.module.rules.filter((rule) =>
        rule.use && rule.use.find((entry) =>
          entry.loader === require.resolve('css-loader'))
      ).forEach((rule) => {
        const [first, ...rest] = rule.use
        rule.use = ExtractTextPlugin.extract({ fallback: first, use: rest })
      })
      config.plugins.push(
        new ExtractTextPlugin({
          filename: '[name].[contenthash].css',
          allChunks: true
        })
      )
    }
  }

  return config
}
