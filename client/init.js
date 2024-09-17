import config from '#js.conf.d'

// Simple system to trigger middleware-like hooks
const triggerHook = name => (ctx, initial) =>
  config[name] && config[name].reduceRight(
    (thisNext, hook) => () => hook(ctx, thisNext),
    () => initial
  )()

const initialize = () => {
  const ctx = { triggerHook }
  triggerHook('clientInit')(ctx, false)
}

initialize()

// Enable HMR
if (module.hot) {
  module.hot.accept()
}
