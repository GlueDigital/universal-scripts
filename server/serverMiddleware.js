import config from '#js.conf.d'

// Simple system to trigger middleware-like hooks
const triggerHook = name => (req, res, initial) =>
  config[name] && config[name].reduceRight(
    (thisNext, hook) => () => hook(req, res, thisNext),
    () => initial
  )()

const triggeringMiddleware = (req, res, next) => {
  req.triggerHook = triggerHook
  return next()
}

export const startup = () => config.startup && Promise.all(config.startup.map(x => x()))

export const rawConfig = config

export default [triggeringMiddleware, ...config.serverMiddleware]
