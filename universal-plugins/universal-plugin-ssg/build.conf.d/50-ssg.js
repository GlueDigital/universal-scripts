import fs from 'fs'
import { resolve, join } from 'path'

const appDirectory = fs.realpathSync(process.cwd())

export const extraDefinitions = async (definitions, opts = {}) => {
  return { ...definitions, __SSG__: opts?.ssg ?? false }
}

const makeRequests = async (port) => {
  let routes = []

  try {
    const { getStaticRoutes } = await import(
      `${appDirectory}/src/routes/static-routes.mjs`
    )
    routes = await getStaticRoutes()
  } catch (error) {
    routes = ['/']
    console.warn('Error loading static routes:', error)
  }

  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:${port}/${route.path}`)
      const data = await response.text()
      const path = resolve(appDirectory, 'static-sites')
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
      fs.writeFileSync(join(path, `${route.name}.html`), data, {
        encoding: 'utf-8'
      })
    } catch (error) {
      console.error(`Error requesting ${route.path}:`, error)
    }
  }
}

export const appAfter = (server) => {
  if (
    typeof __SSG__ === 'undefined' ||
    (typeof __SSG__ === 'boolean' && !__SSG__)
  )
    return
  const port = server.address().port
  makeRequests(port).then(() => {
    server.close()
    process.exit(0)
  })
}
