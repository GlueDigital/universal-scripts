const chalk = require('chalk');
const webpack = require('webpack');

const configs = [
  require('../config/webpack.config.client.js'),
  require('../config/webpack.config.server.js')
];

module.exports = function() {
  console.log(chalk.green('Build started.'));
  const compiler = webpack(configs);
  compiler.plugin('invalid', () => {
    console.log('\n' + chalk.yellowBright('Compiling...'));
  });
  compiler.plugin('done', stats => {
    const messages = stats.toJson({}, true);
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
    } else if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
    } else {
      console.log(chalk.green('Compiled successfully.'));
    }
    console.log(stats.toString({
      colors: true,
      chunks: false,
      modules: false
    }));
  });
  return compiler;
}
