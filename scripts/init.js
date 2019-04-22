'use strict'

// Copy the template and get everything ready for developing.

const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync

module.exports = (
  appPath,
  appName,
  verbose,
  originalDirectory,
  template
) => {
  const ownPath = path.join(appPath, 'node_modules', 'universal-scripts')
  const appPackage = require(path.join(appPath, 'package.json'))
  const ownPackage = require(path.join(ownPath, 'package.json'))

  // Setup the package.json
  appPackage.scripts = {
    start: 'NODE_PATH=./node_modules universal-scripts start',
    build: 'NODE_PATH=./node_modules universal-scripts build',
    serve: 'node build/server/server.js',
    lint: 'eslint src',
    'heroku-postbuild': 'npm run build'
  }

  appPackage.engines = {
    node: '>=7.6'
  }

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  )

  // Determine if we should use yarn or npm
  let shouldUseYarn
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    shouldUseYarn = true
  } catch (e) {
    shouldUseYarn = false
  }

  // Install our peer dependencies
  const cmd = shouldUseYarn ? ['yarn', 'add'] : ['npm', 'install']
  if (!shouldUseYarn) {
    cmd.push('--save')
  }
  for (const peerDependency of Object.keys(ownPackage.peerDependencies)) {
    const ownVersion = ownPackage.peerDependencies[peerDependency]
    const version = ownVersion.split(' || ').pop()
    cmd.push(peerDependency + '@' + version)
  }
  execSync(cmd.join(' '), { stdio: 'inherit' })

  // Copy the template
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, 'template')

  fs.copySync(templatePath, appPath)

  // After copying tasks
  fs.renameSync(
    path.resolve(appPath, 'gitignore'),
    path.resolve(appPath, '.gitignore')
  )

  // Done!
  console.log(chalk.green.bold('Init completed.') + ' Now you might want to run:')
  console.log(chalk.gray('  $ ') + chalk.cyan('cd ' + appName + ' && npm start'))
}
