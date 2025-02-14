import getConfig from '../../config.js'

export const triggerHook = (name) => async (initialConfig, opts) =>
  ((await getConfig(opts.id))[name] ?? []).reduce(
    (stylesConfig, enhancer) => enhancer(stylesConfig, opts),
    initialConfig
  )
