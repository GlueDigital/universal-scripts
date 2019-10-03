const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const JsconfdPlugin = require('js.conf.d-webpack')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const PostCssUrl = require('postcss-url')
const autoprefixer = require('autoprefixer')

const appDirectory = fs.realpathSync(process.cwd())

const enhancer = (opts = {}) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const styleLoader = {
    loader: require.resolve('style-loader')
  }

  const cssLoader = {
    loader: require.resolve('css-loader'),
    query: { sourceMap: true, importLoaders: 1 }
  }

  const transformAssetUrl = (asset) => {
    if (asset.url.indexOf('//') !== -1) return asset.url
    return '~src/static' + asset.url
  }

  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      to: 'src/static',
      plugins: () => [
        PostCssUrl({ url: transformAssetUrl }),
        autoprefixer()
      ]
    }
  }

  const sassLoader = {
    loader: require.resolve('sass-loader'),
    options: {
      sourceMap: true,
      includePaths: [path.resolve('appDirectory', 'src', 'styles')]
    }
  }

  const sassChain = [cssLoader, postcssLoader, sassLoader]
  const cssChain = [cssLoader, postcssLoader]
  if (!isServerSide) {
    sassChain.unshift(styleLoader)
    cssChain.unshift(styleLoader)
  }

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
      extensions: ['.js', '.jsx', '.json'],
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
      new webpack.DefinePlugin(definitions),
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
          test: /\.(scss|sass)$/,
          use: sassChain
        }, {
          test: /\.css$/,
          use: cssChain
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
        whitelist: ['universal-scripts', 'js.conf.d-webpack/src/__virtual-conf.js']
      })
    ]
  } else {
    // Add our render entrypoint, and the user custom one
    config.entry = {
      main: [
        path.resolve(appDirectory, 'src', 'index.js'),
        path.resolve(__dirname, '..', 'client', 'init')
      ]
    }
    // Add a polyfills bundle, with either the ones picked by the user,
    // or some sane defaults
    const userPolyfills = path.resolve(appDirectory, 'src', 'polyfills.js')
    const polyfills = fs.existsSync(userPolyfills)
      ? userPolyfills
      : path.resolve(__dirname, '..', 'client', 'polyfills.js')
    config.entry.polyfills = [polyfills]

    // No async vendor bundles
    config.optimization = config.optimization || {}
    config.optimization.splitChunks = {
      cacheGroups: {
        vendors: {
          reuseExistingChunk: true
        }
      }
    }

    // Production builds get minified JS
    if (isProd) {
      config.optimization.minimizer = [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            output: {
              comments: false
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }]
          }
        })
      ]
    }

    if (!isWatch) {
      // Non-watch builds get CSS on a separate file
      config.module.rules.filter((rule) =>
        rule.use && rule.use.find((entry) =>
          entry.loader === require.resolve('css-loader'))
      ).forEach((rule) => {
        rule.use = [MiniCssExtractPlugin.loader, ...rule.use.slice(1)]
      })
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css'
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

module.exports = {
  webpack: enhancer
}
