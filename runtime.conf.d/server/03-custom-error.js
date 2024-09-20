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

const handleErrors = async (err, req, res, next) => {
  // Loguea el error con la pila
  console.error(chalk.red('Error during render:\n') + err.stack)

  // Establece el estado HTTP a 500 (Internal Server Error)
  res.status(500)

  // Si existe una página de error personalizada (customError500), la usamos
  if (customError500) {
    res.send(customError500)
  }
  // Si estamos en un entorno de desarrollo (__DEV__), mostrar el stack del error
  else if (__DEV__) {
    res.send(
      '<h1>Internal Server Error</h1>\n' +
      '<p>An exception was caught during page rendering:</p>\n' +
      '<pre>' + err.stack + '</pre>'
    )
  }
  // Si no hay una página personalizada ni estamos en desarrollo, mostrar un mensaje genérico
  else {
    res.send('<h1>Internal Server Error</h1>')
  }
}

export const serverErrorMiddleware = handleErrors
