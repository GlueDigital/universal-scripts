import config from '#js.conf.d'
import webpackHotMiddlewareClient from 'webpack-hot-middleware/client.js'

// Simple system to trigger middleware-like hooks
const triggerHook = (name) => (ctx, initial) =>
  config[name] &&
  config[name].reduceRight(
    (thisNext, hook) => () => hook(ctx, thisNext),
    () => initial
  )()

const initialize = () => {
  const ctx = { triggerHook }
  triggerHook('clientInit')(ctx, false)
}

initialize()
// https://github.com/webpack-contrib/webpack-hot-middleware/issues/23
// Enable HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  webpackHotMiddlewareClient.subscribe(function (message) {
    if (message.action === 'reload-page') {
      window.location.reload()
    }
  })
}
