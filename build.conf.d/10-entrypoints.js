const fs = require('fs')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())

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
    // For the in-memory server side HMR, we need to run the server outside
    // of the build, as it will contain the dev server, and do HMR for the part
    // which is built.
    // But when doing a static build, we want the entire server on the output.
    const serverPath = path.resolve(__dirname, '..', 'server')
    if (isWatch) {
      // config.optimization.runtimeChunk = 'single'
      config.entry = {
        server: [path.resolve(serverPath, 'serverMiddleware')]
      }
      // config.entry.server.push('webpack-hot-middleware/client?reload=true')
      config.output.libraryTarget = 'commonjs2'
      // config.plugins.push(new webpack.HotModuleReplacementPlugin())
    } else {
      config.entry = {
        server: [path.resolve(serverPath, 'main')]
      }
      config.optimization.splitChunks = optimization
    }

    return config
  }

  if (opts.id === 'client') {
    // Add our render entrypoint
    config.entry = {
      main: [
        path.resolve(__dirname, '..', 'client', 'init')
      ]
    }

    config.optimization.splitChunks = optimization

    if (!isWatch) {
      // Copy static assets to output dir
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(appDirectory, 'src', 'static'),
              to: path.resolve(appDirectory, 'build', 'client')
            }
          ]
        })
      )
    } else {
      config.optimization.runtimeChunk = 'single'
      config.plugins.push(new webpack.HotModuleReplacementPlugin())
      config.entry.main.push('webpack-hot-middleware/client?reload=true')
    }
    return config
  }

  // For other extraneous builds, add some sane defaults,
  // even if they will most likely be overriden
  config.entry = {
    main: [
      path.resolve(appDirectory, 'src', opts.id)
    ]
  }

  return config
}

module.exports = {
  webpack: enhancer
}
