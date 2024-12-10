const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const PostCssUrl = require('postcss-url')
const postcssCascadeLayers = require('@csstools/postcss-cascade-layers');
const PostCssPresetEnv = require('postcss-preset-env')
const PostCssNested = require('postcss-nested')
const PostCssNormalize = require('postcss-normalize')

const enhancer = (opts = {}, config) => {
  // Extraneous builds don't usually need css support
  if (opts.id !== 'client' && opts.id !== 'server' && !opts.css) return config

  // Easy access to current build config
  const isServerSide = opts.id === 'server'
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const transformAssetUrl = (asset) => {
    const isRootImport = asset.url[0] === '/' && asset.url[1] !== '/'
    return isRootImport ? '~src/static' + asset.url : asset.url
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        ident: 'postcss',
        to: 'src/static',
        plugins: [
          PostCssPresetEnv({
            autoprefixer: { grid: true },
            features: {
              'nesting-rules': true,
            },
          }),
          PostCssNested(),
          postcssCascadeLayers(),
          PostCssUrl({ url: transformAssetUrl }),
          PostCssNormalize(),
        ]
      }
    }
  }

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      sassOptions: {
        includePaths: [path.resolve('appDirectory', 'src', 'styles')]
      }
    }
  }

  const sassChain = [
    {
      loader: 'css-loader',
      options: { sourceMap: true, importLoaders: 2 }
    },
    postcssLoader,
    sassLoader
  ]
  const cssChain = [
    {
      loader: 'css-loader',
      options: { sourceMap: true, importLoaders: 1 }
    },
    postcssLoader
  ]

  if (!isServerSide) {
    const styleLoaderOptions = {}
    if (opts.css?.insert) styleLoaderOptions.insert = opts.css.insert
    const styleLoader = {
      loader: 'style-loader',
      options: styleLoaderOptions
    }
    sassChain.unshift(styleLoader)
    cssChain.unshift(styleLoader)
  }

  config.module.rules.push({
    test: /\.(scss|sass)$/,
    use: sassChain
  })
  config.module.rules.push({
    test: /\.css$/,
    use: cssChain
  })

  if (!isServerSide) {
    // Production builds get optimized CSS
    if (isProd) {
      config.optimization.minimizer.push(
        new CssMinimizerPlugin()
      )
    }

    // Non-watch builds get CSS on a separate file
    if (!isWatch) {
      config.module.rules.filter((rule) =>
        rule.use && rule.use.find((entry) =>
          entry.loader === 'css-loader')
      ).forEach((rule) => {
        rule.use = [MiniCssExtractPlugin.loader, ...rule.use.slice(1)]
      })

      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css'
        })
      )
    }
  }

  return config
}

module.exports = {
  webpack: enhancer
}
