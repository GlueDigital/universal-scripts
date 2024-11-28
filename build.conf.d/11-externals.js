import nodeExternals from 'webpack-node-externals'

const enhancer = (_, config) => {
  if (config.target === 'node') {
    // Don't bundle node_modules for the server: node can access it directly
    config.externals = [
      nodeExternals({
        allowlist: ['universal-scripts', 'js.conf.d-webpack/src']
      })
    ]
  }
  return config
}

export const webpack = enhancer
