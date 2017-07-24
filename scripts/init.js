'use strict'

// Copy the template and get everything ready for developing.

const fs = require('fs-extra')
const path = require('path')

module.exports = (
  appPath,
  appName,
  verbose,
  originalDirectory,
  template
) => {
  const ownPath = path.join(appPath, 'node_modules', 'universal-scripts')
  const appPackage = require(path.join(appPath, 'package.json'))

  // Setup the package.json
  appPackage.scripts = {
    start: 'universal-scripts start',
    build: 'universal-scripts build'
  }

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  )

  // Copy the template
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, 'template')

  fs.copySync(templatePath, appPath)

  // Done!
  console.log('Init completed. Now you might want to run:')
  console.log('  $ cd ' + appName + ' && npm start')
}
