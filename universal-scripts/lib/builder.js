import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import getConfig from '../config.js'
import { getUniversalConfig } from '../lib/universal-config.js'

const writeAssetsToJson = (statsClient) => {
  const target = path.resolve(
    process.cwd(),
    'build',
    'client',
    'webpack-chunks.json'
  )
  const client = statsClient
  console.log(
    Object.values(client.entrypoints)
      .map((e) => e.assets)
      .reduce((acc, val) => acc.concat(val), [])
  )
  const entrypoints = Object.values(client.entrypoints)
    .map((e) => e.assets)
    .reduce((acc, val) => acc.concat(val), []) // .flat()
    .filter((e) => !e.name.endsWith('.map'))
  const content = {
    assets: client.assets.map((a) => a.name),
    entrypoints
  }
  fs.writeFileSync(target, JSON.stringify(content))
  console.log(chalk.green('Wrote webpack-chunks.json'))
}

export default async function (opts = {}) {
  const isWatch = !!opts.isWatch

  // Prepare the different build configs (client and server)
  const buildConfigBuilder = async (opts) => {
    const config = await getConfig(opts.id)
    return await config.webpack.reduce(async (prevPromise, enhancer) => {
      const cfg = await prevPromise
      return enhancer(opts, cfg)
    }, Promise.resolve({}))
  }

  const builds = ['client', 'server']
  const extraBuilds = await getUniversalConfig('extraBuilds')
  if (
    extraBuilds &&
    Array.isArray(extraBuilds) &&
    extraBuilds.every((b) => typeof b === 'string')
  ) {
    builds.push(...extraBuilds)
  }

  const buildConfigsPromises = builds.map((target) =>
    buildConfigBuilder({
      id: target,
      isWatch,
      ssg: !!opts.ssg
    })
  )

  const buildConfigs = await Promise.all(buildConfigsPromises)

  console.log(chalk.green('Build started.'))
  const compiler = webpack(buildConfigs)
  const plugin = { name: 'universal-scripts' }
  compiler.hooks.invalid.tap(plugin, () => {
    console.log('\n' + chalk.yellowBright('Compiling...'))
  })
  compiler.hooks.done.tap(plugin, (stats) => {
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
    console.log(
      stats.toString({
        colors: true,
        chunks: false,
        modules: false,
        entrypoints: false
      })
    )
  })
  return compiler
}
