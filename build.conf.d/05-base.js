const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const JsconfdPlugin = require('js.conf.d-webpack')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd())

const enhancer = (opts = {}) => {
  const id = opts.id
  const isClientSide = id === 'client'
  const isProd = process.env.NODE_ENV === 'production'

  const config = {
    name: id,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    target: isClientSide ? 'web' : 'node',
    mode: isProd ? 'production' : 'development',
    performance: { hints: 'warning' },
    output: {
      path: path.resolve(
        appDirectory, 'build', id),
      pathinfo: true,
      filename: !isClientSide ? '[name].js' : '[name].[contenthash].js',
      chunkFilename: isClientSide ? '[name].[contenthash].js' : '[name].js',
      publicPath: process.env.SUBDIRECTORY || '/'
    },
    resolve: {
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
      ],
      alias: {
        "@components": path.resolve(process.cwd(), "src/components")
      }
    },
    plugins: [
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
      }),
      !isProd && isClientSide && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          exclude: /node_modules\/(?!universal-scripts)/,
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3
                }
              ],
              "@babel/preset-react",
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              !isProd && isClientSide && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          }
        }, {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules\/(?!universal-scripts)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ["@babel/preset-env", '@babel/preset-typescript', "@babel/preset-react"],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  !isProd && isClientSide && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              }
            }
          ]
        },
        {
          test: /\.(jpg|png|gif|webp|svg|ico|avif|mp4|webm)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name].[contenthash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name].[contenthash][ext]'
          }
        },
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
