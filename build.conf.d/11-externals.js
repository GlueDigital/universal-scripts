const enhancer = (_, config) => {
  if (config.target === 'node') {
    // Don't bundle node_modules for the server: node can access it directly
    config.externals = [
      require('webpack-node-externals')({
        allowlist: ['universal-scripts', 'js.conf.d-webpack/src']
      })
    ]
  }
  return config
}

module.exports = {
  webpack: enhancer
}
