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
        "@components": path.resolve(process.cwd(), "src/components"),
        "@utils": path.resolve(process.cwd(), "src/utils"),
        "@routes": path.resolve(process.cwd(), "src/routes"),
        "@static": path.resolve(process.cwd(), "src/static"),
        "@hooks": path.resolve(process.cwd(), "src/hooks"),
        "src": path.resolve(process.cwd(), "src")
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
      !isProd && isClientSide && new ReactRefreshWebpackPlugin({
        overlay: false
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules\/(?!universal-scripts)/,
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',  // Usa 'ecmascript' si no usas TypeScript
                jsx: true,
                tsx: true
              },
              transform: {
                react: {
                  runtime: 'automatic',  // Equivalente a '@babel/preset-react' con runtime automático
                  refresh: !isProd && isClientSide  // Equivalente a React Refresh
                }
              },
              target: "es2021", // Similar a @babel/preset-env, ajusta según tu objetivo
              externalHelpers: true,  // Equivalente a '@babel/plugin-transform-runtime'
            },
            minify: isProd,  // SWC puede minificar el código en producción
          }
        },
        {
          test: /\.(jpg|png|gif|webp|svg|ico|avif|mp4|webm)$/i,
          type: 'asset',
          generator: {
            filename: 'static/[name].[contenthash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset',
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
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
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
