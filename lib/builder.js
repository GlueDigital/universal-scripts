const chalk = require('chalk');
const webpack = require('webpack');

const configs = [
  require('../config/webpack.config.server.js'),
  require('../config/webpack.config.client.js')
];

module.exports = function() {
  console.log(chalk.green('Build started.'));
  const compiler = webpack(configs);
  compiler.plugin('invalid', () => {
    console.log('Compiling...');
  });
  compiler.plugin('done', stats => {
    const messages = stats.toJson({}, true);
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log(messages.errors.join('\n\n'));
      return;
    } else if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log(messages.warnings.join('\n\n'));
    } else {
      console.log(chalk.green('Compiled successfully.'));
      console.log(stats.toString({
        colors: true,
        chunks: false,
        modules: false
      }));
    }
  });
  return compiler;
}
