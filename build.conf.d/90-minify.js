const TerserPlugin = require('terser-webpack-plugin')

const enhancer = (_, config) => {
  const isProd = process.env.NODE_ENV === 'production'

  // Production builds get minified JS
  if (isProd) {
    config.optimization.minimize = true
    config.optimization.minimizer.push(
      new TerserPlugin()
    )
  }

  return config
}

module.exports = {
  webpack: enhancer
}
