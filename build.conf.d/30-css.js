const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PostCssUrl = require('postcss-url')
const autoprefixer = require('autoprefixer')
const CssLoader = require.resolve('css-loader')

const enhancer = (opts = {}, config) => {
  const isServerSide = opts.isServerSide
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const cssLoader = {
    loader: CssLoader,
    options: { sourceMap: true, importLoaders: 1 }
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
      sassOptions: {
        includePaths: [path.resolve('appDirectory', 'src', 'styles')]
      }
    }
  }

  const sassChain = [cssLoader, postcssLoader, sassLoader]
  const cssChain = [cssLoader, postcssLoader]

  if (!isServerSide) {
    const styleLoader = { loader: require.resolve('style-loader') }
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
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }]
          }
        })
      )
    }

    // Non-watch builds get CSS on a separate file
    if (!isWatch) {
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
    }
  }

  return config
}

module.exports = {
  webpack: enhancer
}
