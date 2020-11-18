const fs = require('fs')
const path = require('path')
const jsconfd = require('js.conf.d')

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

const getConfig = (target) => {
  const specificUserConfig = path.resolve(userConfig, target)
  const config = jsconfd([libConfig, userConfig, specificUserConfig], { merge: arrayMerger })
  return config
}

module.exports = getConfig
