const chalk = require('chalk');
const koa = require('koa');

const port = process.env.PORT || 3000;

console.log(chalk.green('Starting server.'));

const app = new koa()
app.listen(port)

console.log(
  chalk.green('Server running at:'),
  chalk.cyan.bold('http://localhost:' + port)
);


/*
let routes = require('src/routes/index');
console.log(routes.createRoutes());

// HMR handling
if (module.hot) {
  module.hot.accept('src/routes/index', () => {
    routes = require('src/routes/index');
  });
}
*/
