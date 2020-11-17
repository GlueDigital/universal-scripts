const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())

const enhancer = (opts = {}, config) => {
  if (opts.id === 'client') {
    // Add a polyfills bundle, with either the ones picked by the user,
    // or some sane defaults
    const userPolyfills = path.resolve(appDirectory, 'src', 'polyfills.js')
    const polyfills = fs.existsSync(userPolyfills)
      ? userPolyfills
      : path.resolve(__dirname, '..', 'client', 'polyfills.js')
    config.entry.polyfills = [polyfills]
  }

  return config
}

module.exports = {
  webpack: enhancer
}
