import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import PostCssUrl from 'postcss-url'
import postcssCascadeLayers from '@csstools/postcss-cascade-layers'
import PostCssPresetEnv from 'postcss-preset-env'
import PostCssNested from 'postcss-nested'
import PostCssNormalize from 'postcss-normalize'
import getConfig from '../config.js'

const getInitialStyleConfig = (opts) => {
  const isServerSide = opts.id === 'server'

  const transformAssetUrl = (asset) => {
    const isRootImport = asset.url[0] === '/' && asset.url[1] !== '/'
    return isRootImport ? '~src/static' + asset.url : asset.url
  }

  const cssLoader = {
    loader: 'css-loader',
    options: { sourceMap: true, importLoaders: 1 }
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
              'nesting-rules': true
            }
          }),
          PostCssNested(),
          postcssCascadeLayers(),
          PostCssUrl({ url: transformAssetUrl }),
          PostCssNormalize()
        ]
      }
    }
  }

  const styleLoaderOptions = {}
  if (opts.css?.insert) styleLoaderOptions.insert = opts.css.insert

  const styleLoader = isServerSide
    ? undefined
    : {
        loader: 'style-loader',
        options: styleLoaderOptions
      }

  return {
    loaders: [styleLoader, cssLoader, postcssLoader].filter(Boolean),
    exts: ['css']
  }
}

const enhancer = async (opts = {}, config) => {
  // Extraneous builds don't usually need css support
  if (opts.id !== 'client' && opts.id !== 'server' && !opts.css) return config

  // Easy access to current build config
  const isServerSide = opts.id === 'server'
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'

  const triggerHook = (name) => async (initialConfig, opts) =>
    (await getConfig(opts.id))[name].reduce(
      (stylesConfig, enhancer) => enhancer(stylesConfig, opts),
      initialConfig
    )

  const initialStyleConfig = getInitialStyleConfig(opts)

  const extraStyles = await triggerHook('stylesExtras')(
    initialStyleConfig,
    opts
  )

  const stylesChain = extraStyles.loaders.filter(Boolean)
  const testRule = new RegExp(`\\.(${extraStyles.exts.join('|')})$`)

  config.module.rules.push({
    test: testRule,
    use: stylesChain
  })

  if (!isServerSide) {
    // Production builds get optimized CSS
    if (isProd) {
      config.optimization.minimizer.push(new CssMinimizerPlugin())
    }

    // Non-watch builds get CSS on a separate file
    if (!isWatch) {
      config.module.rules
        .filter(
          (rule) =>
            rule.use && rule.use.find((entry) => entry.loader === 'css-loader')
        )
        .forEach((rule) => {
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

export const webpack = enhancer
