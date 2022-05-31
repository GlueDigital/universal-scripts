import compose from 'koa-compose'
import config from '#js.conf.d'

// Simple system to trigger middleware-like hooks
const triggerHook = name => (ctx, initial) =>
  config[name] && config[name].reduceRight(
    (thisNext, hook) => () => hook(ctx, thisNext),
    () => initial
  )()

const triggeringMiddleware = (ctx, next) => {
  ctx.triggerHook = triggerHook
  return next()
}

export const startup = () => Promise.all(config.startup?.map(x => x()))

export default compose([triggeringMiddleware, ...config.serverMiddleware])
