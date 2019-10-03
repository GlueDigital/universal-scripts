const TerserPlugin = require('terser-webpack-plugin')

const enhancer = (opts = {}, config) => {
  const isProd = process.env.NODE_ENV === 'production'

  // Production builds get minified JS
  if (!opts.isServerSide && isProd) {
    config.optimization.minimizer.push(
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    )
  }

  return config
}

module.exports = {
  webpack: enhancer
}
