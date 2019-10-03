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

// Helper to load js files w/callback
const loadScript = (src, done) => {
  const js = document.createElement('script')
  js.src = src
  js.onload = () => done()
  js.onerror = () => done()
  document.head.appendChild(js)
}

// Feature detection to check if we need to load the polyfills bundle
const needsPolyfill = () =>
  !window.Map || !window.Set || !window.Promise || !window.Intl ||
  !window.Symbol || !window.Array.prototype.includes ||
  !window.Array.prototype.findIndex || !window.Array.from

// Call initialization now!
if (needsPolyfill()) {
  loadScript('/polyfills.js', initialize)
} else {
  initialize()
}
