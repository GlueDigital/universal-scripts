const chalk = require('chalk');
const fs = require('fs');
const koa = require('koa');
const koaStatic = require('koa-static');
const koaWebpack = require('koa-webpack');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const port = process.env.PORT || 3000;

// We need to hot-reload routerMiddleware, but we're the ones building it.
let routerMiddleware = null
const initRouterMiddleware = (compiler, koaWebpackInstance) => {
  const mfs = koaWebpackInstance.dev.fileSystem;
  compiler.plugin('done', stats => {
    const filename = path.resolve(appDirectory, 'build', 'server', 'server.js');
    const newMiddleware = mfs.readFileSync(filename);
    routerMiddleware = eval(newMiddleware.toString()); // Eeeek!
  })
}
const routerMiddlewareProxy = (ctx, next) => {
  if (routerMiddleware) {
    return routerMiddleware(ctx, next);
  } else {
    console.log('Request received, but no middleware loaded yet');
  }
}


module.exports = (compiler, appPath) => {
  console.log(chalk.green('Starting server.'));
  const app = new koa()

  // Enable DEV middlewares, and add watcher to update our routerMiddleware
  const koaWebpackInstance = koaWebpack({
    compiler: compiler,
    dev: {
      publicPath: '/',
      quiet: true
    }
  })
  app.use(koaWebpackInstance)
  initRouterMiddleware(compiler, koaWebpackInstance)

  // Serve static files (but a file server would be better)
  app.use(koaStatic(path.resolve(appDirectory, 'src', 'static'), {}));

  // Add our server-side-rendering middleware
  app.use(routerMiddlewareProxy);

  // Wrap it up
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
}