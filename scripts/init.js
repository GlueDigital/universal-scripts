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
  // Determine the template to use
  // If it is cra-template, override it with built-in
  const isDefaultTemplate = (!template || template === 'cra-template')
  const templateName = isDefaultTemplate ? 'cra-template-universal' : template
  const templatePath = path.dirname(
    require.resolve(templateName + '/package.json', { paths: [appPath] })
  )
  const templateInfo = require(path.join(templatePath, 'template.json'))

  // Setup the package.json
  const appPackage = require(path.join(appPath, 'package.json'))
  const templatePackage = templateInfo.package || {}

  appPackage.scripts = {
    start: 'universal-scripts start',
    build: 'universal-scripts build',
    test: 'universal-scripts test',
    serve: 'node build/server/server.js',
    lint: 'eslint src',
    'heroku-postbuild': 'npm run build',
    ...templatePackage.scripts
  }

  appPackage.engines = {
    node: '22'
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

  // Install dependencies
  const cmd = shouldUseYarn ? ['yarn', 'add'] : ['npm', 'install', '--save']
  const cmdDev = shouldUseYarn ? ['yarn', 'add', '-D'] : ['npm', 'install', '-D']

  const toInstallDeps = Object.entries(templatePackage.dependencies)
  const toInstallDevDeps = Object.entries(templatePackage.devDependencies)

  if (toInstallDeps.length) {
    console.log('Installing template dependencies...')
    cmd.push(...toInstallDeps.map(([dependency, version]) =>
      dependency + '@' + version
    ))
    execSync(cmd.join(' '), { stdio: 'inherit' })
  } else {
    console.log('Template has no dependencies; skipping install...')
    console.log(templateInfo)
  }

  if (toInstallDevDeps.length) {
    console.log('Installing template dev dependencies...')
    cmdDev.push(...toInstallDevDeps.map(([dependency, version]) =>
      dependency + '@' + version
    ))
    execSync(cmdDev.join(' '), { stdio: 'inherit' })
  } else {
    console.log('Template has no dependencies; skipping install...')
    console.log(templateInfo)
  }

  // Copy the template
  console.log('Copying template files...')
  fs.copySync(path.join(templatePath, 'template'), appPath)

  const filesToRename = ['gitignore', 'eslintrc', 'prettierrc', 'prettierignore']

  // After copying tasks
  filesToRename.forEach((file) => {
    try {
      fs.renameSync(
        path.resolve(appPath, file),
        path.resolve(appPath, '.' + file)
      )
    } catch (err) {
    }
  })

  // Uninstall template
  console.log('Removing template package...')
  const rmCmd = shouldUseYarn ? ['yarn', 'remove'] : ['npm', 'uninstall']
  rmCmd.push(isDefaultTemplate ? 'cra-template' : templateName)
  try {
    execSync(rmCmd.join(' '), { stdio: 'inherit' })
  } catch (e) {
    console.log('Removing template failed.')
  }

  // Done!
  console.log(chalk.green.bold('Init completed.') + ' Now you might want to run:')
  console.log(chalk.gray('  $ ') + chalk.cyan('cd ' + appName + ' && npm start'))
}
