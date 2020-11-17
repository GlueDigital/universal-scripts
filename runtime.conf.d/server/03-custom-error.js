import chalk from 'chalk'
import fs from 'fs'

// Optional error 500 page
const customError500 = __SSR__ && (() => {
  const req = require.context('src/routes', false, /^\.\/index$/)
  const keys = req(req.keys()[0])
  if (keys.error500 && fs.existsSync(keys.error500)) {
    return fs.readFileSync(keys.error500, 'utf-8')
  }
})()

const handleErrors = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.error(chalk.red('Error during render:\n') + error.stack)
    ctx.status = 500
    if (customError500) {
      // Use the user-provided error page
      ctx.body = customError500
    } else if (__DEV__) {
      // Provide some better feedback for errors during DEV
      ctx.body =
        '<h1>Internal Server Error</h1>\n' +
        '<p>An exception was caught during page rendering:</p>\n' +
        '<pre>' + error.stack + '</pre>'
    }
  }
}

export const serverMiddleware = handleErrors
