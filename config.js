import fs from 'fs'
import path from 'path'
import jsconfd from 'js.conf.d'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const arrayMerger = (current, add) => {
  for (const key of Object.keys(add)) {
    current[key] = current[key] || []
    current[key].push(add[key])
  }
  return current
}

// Load the config directories, using array merger
const appDirectory = fs.realpathSync(process.cwd())
const libConfig = path.resolve(__dirname, 'build.conf.d')
const userConfig = path.resolve(appDirectory, 'build.conf.d')

export default async function getConfig(target) {
  const specificUserConfig = path.resolve(userConfig, target)
  const config = await jsconfd([libConfig, userConfig, specificUserConfig], {
    merge: arrayMerger
  })
  return config
}
