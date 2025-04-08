import webpackPackage from 'webpack'
import { triggerHook } from '../lib/plugins/trigger.js'
import { getUniversalConfig } from '../lib/universal-config.js'

const { DefinePlugin } = webpackPackage

const enhancer = async (opts = {}, config) => {
  const isWatch = opts.isWatch
  const isProd = process.env.NODE_ENV === 'production'
  const ssr =
    getUniversalConfig('noSsr') == null ? true : !getUniversalConfig('noSsr')

  const definitions = {
    __BUILD__: opts.id,
    __PROD__: isProd,
    __DEV__: !isProd,
    __SERVER__: opts.id === 'server',
    __CLIENT__: opts.id === 'client',
    __WATCH__: isWatch,
    __SSR__: ssr
  }

  const allDefinitions = await triggerHook('extraDefinitions')(
    definitions,
    opts
  )

  if (!config.plugins) config.plugins = []
  if (opts.id === 'client') {
    config.plugins.push(
      new DefinePlugin({
        ...allDefinitions,
        'process.env': 'window.__ENV_VARS__'
      })
    )
  } else {
    config.plugins.push(new DefinePlugin(allDefinitions))
  }

  return config
}

export const webpack = enhancer
