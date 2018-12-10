const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const config = require('../config/webpack.config.js')

const writeAssetsToJson = (stats) => {
  const target = path.resolve(
    process.cwd(), 'build', 'client', 'webpack-chunks.json')
  const content = { assets: stats.children[0].assets.map((a) => a.name) }
  fs.writeFileSync(target, JSON.stringify(content))
  console.log(chalk.green('Wrote webpack-chunks.json'))
}

module.exports = (opts = {}) => {
  const isWatch = !!opts.isWatch

  const appDirectory = fs.realpathSync(process.cwd())
  const externalConfigWebpack = path.resolve(appDirectory, 'src/config/webpack.config.patch.js')
  const enhancedConfig = (opts) => fs.existsSync(externalConfigWebpack)
    ? require(externalConfigWebpack)(config(opts), opts) : config(opts)

  const configs = [
    enhancedConfig({
      isWatch: isWatch
    }),
    enhancedConfig({
      isServerSide: true,
      isWatch: isWatch
    })
  ]

  console.log(chalk.green('Build started.'))
  const compiler = webpack(configs)
  const plugin = { name: 'universal-scripts' }
  compiler.hooks.invalid.tap(plugin, () => {
    console.log('\n' + chalk.yellowBright('Compiling...'))
  })
  compiler.hooks.done.tap(plugin, stats => {
    const statsJson = stats.toJson({}, true)
    if (statsJson.errors.length) {
      console.log(chalk.red('Failed to compile.'))
    } else {
      if (statsJson.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.'))
      } else {
        console.log(chalk.green('Compiled successfully.'))
      }
      if (!isWatch) {
        // When not using the watch mode (dev server), we need to
        // write the chunk info somewhere for the server to read it.
        writeAssetsToJson(statsJson)
      }
    }
    console.log(stats.toString({
      colors: true,
      chunks: false,
      modules: false,
      entrypoints: false
    }))
  })
  return compiler
}
