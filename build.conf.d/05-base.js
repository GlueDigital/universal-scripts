const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const JsconfdPlugin = require('js.conf.d-webpack')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd())

const enhancer = (opts = {}) => {
  const id = opts.id
  const isClientSide = id === 'client'
  const isProd = process.env.NODE_ENV === 'production'

  const babelOptions = {
    presets: [require.resolve('babel-preset-react-app')],
    sourceType: 'unambiguous',
    compact: false,
    cacheDirectory: true
  }

  const config = {
    name: id,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    target: isClientSide ? 'web' : 'node',
    mode: isProd ? 'production' : 'development',
    performance: { hints: false },
    output: {
      path: path.resolve(
        appDirectory, 'build', id),
      pathinfo: true,
      filename: !isClientSide ? '[name].js' : (bundle) =>
        bundle.chunk.name === 'polyfills' ? 'polyfills.js' : '[name].[hash].js',
      chunkFilename: isClientSide ? '[name].[hash].js' : '[name].js',
      publicPath: process.env.SUBDIRECTORY || '/'
    },
    resolve: {
      alias: {
        'any-promise': 'core-js/fn/promise' // Prevents warning on webpack
      },
      extensions: ['.wasm', '.mjs', '.ts', '.js', '.tsx', '.jsx', '.json', '.sass', '.scss', '.css'],
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
      new webpack.NoEmitOnErrorsPlugin(),
      new JsconfdPlugin({
        folders: [
          path.resolve(__dirname, '..', 'runtime.conf.d'),
          path.resolve(__dirname, '..', 'runtime.conf.d', id),
          path.resolve(appDirectory, 'runtime.conf.d'),
          path.resolve(appDirectory, 'runtime.conf.d', id)
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
          test: /\.(js|jsx)$/,
          exclude: /universal-scripts\/node_modules/,
          loader: require.resolve('babel-loader'),
          options: babelOptions
        }, {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelOptions
            }, {
              loader: require.resolve('ts-loader')
            }
          ]
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
    optimization: {
      minimizer: [],
      splitChunks: {
        cacheGroups: {
          vendors: {
            reuseExistingChunk: true
          }
        }
      }
    }
  }

  return config
}

module.exports = {
  webpack: enhancer
}
