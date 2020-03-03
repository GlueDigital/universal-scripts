const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const JsconfdPlugin = require('js.conf.d-webpack')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd())

const enhancer = (opts = {}) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const side = isServerSide ? 'server' : 'client'

  const config = {
    name: isServerSide ? 'server' : 'client',
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    target: isServerSide ? 'node' : 'web',
    mode: isProd ? 'production' : 'development',
    performance: { hints: false },
    output: {
      path: path.resolve(
        appDirectory, 'build', isServerSide ? 'server' : 'client'),
      pathinfo: true,
      filename: isServerSide ? 'server.js' : (bundle) =>
        bundle.chunk.name === 'polyfills' ? 'polyfills.js' : '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
      publicPath: process.env.SUBDIRECTORY || '/'
    },
    resolve: {
      alias: {
        'any-promise': 'core-js/fn/promise' // Prevents warning on webpack
      },
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json', '.sass', '.scss', '.css'],
      modules: [
        path.resolve(__dirname, '..', 'node_modules'),
        path.resolve(appDirectory, 'node_modules'),
        appDirectory
      ],
      plugins: [
        new DirectoryNamedWebpackPlugin({
          honorIndex: true,
          exclude: /node_modules/
        })
      ]
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new JsconfdPlugin({
        folders: [
          path.resolve(__dirname, '..', 'runtime.conf.d'),
          path.resolve(__dirname, '..', 'runtime.conf.d', side),
          path.resolve(appDirectory, 'runtime.conf.d'),
          path.resolve(appDirectory, 'runtime.conf.d', side)
        ],
        merge: (current, add) => {
          for (const key of Object.keys(add)) {
            current[key] = current[key] || []
            current[key].push(add[key])
          }
          return current
        }
      })
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
          test: /\.(jpg|png|gif|webp|mp4|webm|svg|ico|woff|woff2|otf|ttf|eot)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: '[path][name].[ext]?[md5:hash:hex:8]',
            emitFile: false,
            context: 'src/static'
          }
        }
      ]
    },
    optimization: { minimizer: [] }
  }

  if (isServerSide) {
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
    // Don't bundle node_modules for the server: node can access it directly
    config.externals = [
      require('webpack-node-externals')({
        whitelist: ['universal-scripts', 'js.conf.d-webpack/src']
      })
    ]
  } else {
    // Add our render entrypoint
    config.entry = {
      main: [
        path.resolve(__dirname, '..', 'client', 'init')
      ]
    }

    // No async vendor bundles
    config.optimization = config.optimization || {}
    config.optimization.splitChunks = {
      cacheGroups: {
        vendors: {
          reuseExistingChunk: true
        }
      }
    }

    if (!isWatch) {
      // Copy static assets to output dir
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

module.exports = {
  webpack: enhancer
}
