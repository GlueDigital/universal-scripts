'use strict'

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd())

module.exports = (opts = {}) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const styleLoader = {
    loader: require.resolve('style-loader')
  }

  const cssLoader = {
    loader: require.resolve('css-loader'),
    query: {
      root: 'src/static',
      sourceMap: true,
      minimize: {
        autoprefixer: {
          add: true,
          remove: true,
          browsers: ['last 2 versions']
        },
        discardComments: {
          removeAll: true
        }
      }
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
    __PROD__: isProd,
    __DEV__: !isProd,
    __SERVER__: isServerSide,
    __CLIENT__: !isServerSide,
    __WATCH__: isWatch
  }
  if (!isServerSide) {
    for (const key in process.env) {
      definitions['process.env.' + key] = JSON.stringify(process.env[key])
    }
  }

  let config = {
    name: isServerSide ? 'server' : 'client',
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    target: isServerSide ? 'node' : 'web',
    mode: isProd ? 'production' : 'development',
    output: {
      path: path.resolve(
        appDirectory, 'build', isServerSide ? 'server' : 'client'),
      pathinfo: true,
      filename: isServerSide ? 'server.js' : 'main.[hash].js',
      publicPath: process.env.SUBDIRECTORY || '/'
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
            compact: false,
            cacheDirectory: true
          }
        }, {
          test: /\.(scss|sass)$/,
          use: sassChain
        }, {
          test: /\.css$/,
          use: cssChain
        }, {
          test: /\.(jpg|png|svg|ico|woff|woff2|otf|ttf|eot)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: '[path][name].[ext]?[md5:hash:hex:8]',
            emitFile: false,
            context: 'src/static'
          }
        }
      ]
    }
  }

  if (isServerSide) {
    // For the in-memory server side HMR, we need to run the server outside
    // of the build, as it will contain the dev server, and do HMR for the part
    // which is built.
    // But when doing a static build, we want the entire server on the output.
    const serverPath = path.resolve(__dirname, '..', 'server')
    if (isWatch) {
      config.entry = {
        server: [ path.resolve(serverPath, 'lib', 'routerMiddleware') ]
      }
      config.output.libraryTarget = 'commonjs2'
    } else {
      config.entry = {
        server: [ path.resolve(serverPath, 'main') ]
      }
    }
    // Don't bundle node_modules for the server: node can access it directly
    config.externals = [
      require('webpack-node-externals')()
    ]
  } else {
    // Add our render entrypoint, and the user custom one
    config.entry = {
      main: [
        path.resolve(appDirectory, 'src', 'index.js'),
        path.resolve(__dirname, '..', 'client', 'init')
      ]
    }
    // Production builds get minified JS
    if (isProd) {
      config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false
        },
        sourceMap: true,
        comments: false
      }))
    }
    if (!isWatch) {
      // Non-watch builds get CSS on a separate file
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
      // Also copy static assets to output dir
      config.plugins.push(
        new CopyWebpackPlugin([{
          from: path.resolve(appDirectory, 'src', 'static'),
          to: path.resolve(appDirectory, 'build', 'client')
        }])
      )
    }
  }

  return config
}
