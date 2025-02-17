import { resolve, join } from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())

const regex = /^(@[^/]+\/)?universal-plugin[^/]+$/

export function findUniversalPlugins() {
  const nodeModulesPath = resolve(appDirectory, 'node_modules')

  const folders = fs.readdirSync(nodeModulesPath, {
    withFileTypes: true
  })

  let universalPlugins = folders
    .filter((dirent) => regex.test(dirent.name))
    .map((dirent) => join(nodeModulesPath, dirent.name))

  const namespaces = folders.filter(
    (dirent) => dirent.isDirectory() && dirent.name.startsWith('@')
  )

  namespaces.forEach((namespace) => {
    const namespacePath = join(nodeModulesPath, namespace.name)
    const subFolders = fs
      .readdirSync(namespacePath, { withFileTypes: true })
      .filter((dirent) => regex.test(`${namespace.name}/${dirent.name}`))
      .map((dirent) => join(namespacePath, dirent.name))

    universalPlugins = [...universalPlugins, ...subFolders]
  })

  return universalPlugins
}

export function filterPluginsWithSubdir(plugins, subdir) {
  return plugins.filter((pluginPath) => {
    const testDirPath = join(pluginPath, subdir)
    return fs.existsSync(testDirPath) && fs.statSync(testDirPath).isDirectory()
  })
}
