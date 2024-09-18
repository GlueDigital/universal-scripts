const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const getConfig = require('../config')

const appDirectory = fs.realpathSync(process.cwd())
const pkg = require(path.join(appDirectory, 'package.json'))

const writeAssetsToJson = (statsClient) => {
  const target = path.resolve(
    process.cwd(), 'build', 'client', 'webpack-chunks.json')
  const client = statsClient
  console.log(Object.values(client.entrypoints).map(e => e.assets).reduce((acc, val) => acc.concat(val), []))
  const entrypoints = Object.values(client.entrypoints)
    .map(e => e.assets)
    .reduce((acc, val) => acc.concat(val), []) // .flat()
    .filter(e => !e.name.endsWith('.map'))
  const content = {
    assets: client.assets.map((a) => a.name),
    entrypoints
  }
  fs.writeFileSync(target, JSON.stringify(content))
  console.log(chalk.green('Wrote webpack-chunks.json'))
}

module.exports = (opts = {}) => {
  const isWatch = !!opts.isWatch

  // Prepare the different build configs (client and server)
  const buildConfigBuilder = (opts) => {
    const config = getConfig(opts.id)
    return config.webpack.reduce((cfg, enhancer) => enhancer(opts, cfg), {})
  }

  const builds = ['client', 'server']
  if (pkg.universalOptions && pkg.universalOptions.extraBuilds) {
    builds.push(...pkg.universalOptions.extraBuilds)
  }

  const buildConfigs = builds.map(target =>
    buildConfigBuilder({
      id: target,
      isWatch
    })
  )

  console.log(chalk.green('Build started.'))
  const compiler = webpack(buildConfigs)
  const plugin = { name: 'universal-scripts' }
  compiler.hooks.invalid.tap(plugin, () => {
    console.log('\n' + chalk.yellowBright('Compiling...'))
  })
  compiler.hooks.done.tap(plugin, stats => {
    const statsJson = stats.toJson()
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
        writeAssetsToJson(stats.toJson().children[0])
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
