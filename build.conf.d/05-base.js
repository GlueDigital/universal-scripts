import fs from 'fs'
import { resolve, dirname } from 'path'
import webpackPackage from 'webpack'
import JsconfdPlugin from 'js.conf.d-webpack'
import DirectoryNamedWebpackPlugin from 'directory-named-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { fileURLToPath } from 'url'
import { SwcMinifyWebpackPlugin } from 'swc-minify-webpack-plugin'
import { EnvReloadPlugin } from '../lib/vars/EnvPlugin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { ProgressPlugin } = webpackPackage

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
    performance: { hints: false },
    output: {
      path: resolve(
        appDirectory, 'build', id),
      pathinfo: true,
      filename: isClientSide ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isClientSide ? '[name].[contenthash].js' : '[name].js',
      publicPath: process.env.SUBDIRECTORY || '/',
      clean: true
    },
    resolve: {
      extensions: ['.wasm', '.mjs', '.ts', '.js', '.tsx', '.jsx', '.json', '.sass', '.scss', '.css'],
      modules: [
        resolve(__dirname, '..', 'node_modules'),
        resolve(appDirectory, 'node_modules'),
        appDirectory
      ],
      plugins: [
        new DirectoryNamedWebpackPlugin({
          honorIndex: true,
          exclude: /node_modules/
        })
      ],
      alias: {
        "@components": resolve(process.cwd(), "src/components"),
        "@utils": resolve(process.cwd(), "src/utils"),
        "@routes": resolve(process.cwd(), "src/routes"),
        "@static": resolve(process.cwd(), "src/static"),
        "@hooks": resolve(process.cwd(), "src/hooks"),
        "src": resolve(process.cwd(), "src")
      }
    },
    plugins: [
      new ProgressPlugin(),
      new JsconfdPlugin({
        folders: [
          resolve(__dirname, '..', 'runtime.conf.d'),
          resolve(__dirname, '..', 'runtime.conf.d', id),
          resolve(appDirectory, 'runtime.conf.d'),
          resolve(appDirectory, 'runtime.conf.d', id)
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
      isClientSide && new EnvReloadPlugin()
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx|mjs)$/,
          exclude: /node_modules\/(?!universal-scripts)/,
          loader: 'swc-loader',
          options: {
            jsc: {
              preserveAllComments: true, // Needed for webpack anotations
              parser: {
                syntax: 'typescript',
                jsx: true,
                tsx: true,
                dynamicImport: true,
                topLevelAwait: true
              },
              transform: {
                react: {
                  runtime: 'automatic',  // Equivalent to '@babel/preset-react'
                  refresh: !isProd && isClientSide  // Equivalent to React Refresh
                }
              },
              target: "es2022", // Similar to @babel/preset-env
              externalHelpers: true,  // Equivalent to '@babel/plugin-transform-runtime'
            },
          }
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
      minimize: isProd,
      minimizer: [new SwcMinifyWebpackPlugin()],
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

export const webpack = enhancer
