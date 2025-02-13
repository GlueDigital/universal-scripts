import { fileURLToPath } from 'url'
import { dirname, resolve, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const appDirectory = fs.realpathSync(process.cwd())

const regex = /^(@[^/]+\/)?universal-plugin[^/]+$/

export function findUniversalPlugins() {
  const nodeModulesPath = resolve(appDirectory, 'node_modules')

  const folders = fs.readdirSync(nodeModulesPath, {
    withFileTypes: true
  })

  const universalPlugins = folders.filter(
    (dirent) => dirent.isDirectory() && regex.test(dirent.name)
  )

  const names = universalPlugins.map((dirent) =>
    join(nodeModulesPath, dirent.name)
  )

  return names
}
