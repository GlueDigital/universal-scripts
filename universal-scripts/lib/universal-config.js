import { join } from 'path'
import { realpathSync } from 'fs'

const appDirectory = realpathSync(process.cwd())

export async function getUniversalConfig(name) {
  try {
    const config = (await import(join(appDirectory, 'universal.config.mjs')))
      .default
    if (typeof config !== 'object') {
      console.warn(
        "Warning: 'universal.config.mjs' does not export a default object"
      )
      return {}
    }
    return config[name] ?? null
  } catch {
    return null
  }
}

export async function getPluginsConfig(name) {
  try {
    const config = await import(join(appDirectory, 'universal.config.mjs'))
    console.log({ config })
    const pluginsConfig = config['plugins']
    if (!pluginsConfig) return {}
    if (typeof pluginsConfig !== 'object') {
      console.warn(
        "Warning: 'plugins' in 'universal.config.mjs' does not export an object"
      )
      return {}
    }
    const pluginConfig = pluginsConfig[name] || {}
    if (typeof pluginConfig !== 'object') {
      console.warn(
        `Warning: ${name} plugin in 'universal.config.mjs' does not export an object`
      )
      return {}
    }
    return pluginConfig
  } catch {
    return {}
  }
}
