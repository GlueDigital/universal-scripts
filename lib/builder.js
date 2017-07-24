const chalk = require('chalk')
const webpack = require('webpack')

const config = require('../config/webpack.config.js')

const configs = [config(false), config(true)]

module.exports = () => {
  console.log(chalk.green('Build started.'))
  const compiler = webpack(configs)
  compiler.plugin('invalid', () => {
    console.log('\n' + chalk.yellowBright('Compiling...'))
  })
  compiler.plugin('done', stats => {
    const messages = stats.toJson({}, true)
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'))
    } else if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'))
    } else {
      console.log(chalk.green('Compiled successfully.'))
    }
    console.log(stats.toString({
      colors: true,
      chunks: false,
      modules: false
    }))
  })
  return compiler
}
