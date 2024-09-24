const optimization = {
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      priority: -5,
      name: 'vendors',
      chunks: "initial",
      reuseExistingChunk: true,
      minSize: 0,
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true,
    },
    defaultVendors: false,
    reactPackage: {
      test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
      name: 'vendor_react',
      chunks: "all",
      priority: 10,
     }
  }
}


const enhancer = (opts = {}, config) => {
  const isWatch = opts.isWatch

  if (opts.id === 'server') {
    if (!isWatch) {
      config.optimization.splitChunks = optimization
    } else {
      config.optimization.splitChunks = {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            reuseExistingChunk: true,
          }
        }
      }
    }

    return config
  }

  if (opts.id === 'client') {
    config.optimization.splitChunks = optimization
    if (isWatch) {
      config.optimization.runtimeChunk = 'single'
    }

    return config
  }

  return config
}

module.exports = {
  webpack: enhancer
}