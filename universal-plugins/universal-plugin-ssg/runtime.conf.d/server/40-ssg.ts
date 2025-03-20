import fs from 'fs'
import { Server } from 'http'
import { AddressInfo } from 'net'
import { resolve, join, dirname, basename } from 'path'

const makeRequests = async (port: number) => {
  let routes = []

  try {
    // @ts-expect-error Resolved in runtime
    const { getStaticRoutes } = await import('src/routes/static-routes.mjs')
    const result = await getStaticRoutes()

    if (!Array.isArray(result)) {
      throw new Error('getStaticRoutes() did not return an array')
    }

    routes = result.filter((route) => route && typeof route === 'string')
    console.log('Routes loaded:', routes)
  } catch (error) {
    console.warn('Error loading static routes:', error)
  }

  const pathStaticSites = resolve(process.cwd(), 'static-sites')

  try {
    if (!fs.existsSync(pathStaticSites)) {
      fs.mkdirSync(pathStaticSites, { recursive: true })
    }
  } catch (error) {
    console.error('Error creating static-sites directory:', error)
    return
  }

  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:${port}/${route}`)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch http://localhost:${port}/${route}: ${response.statusText}`
        )
      }

      const data = await response.text()

      const safePath = route.replace(/^\/|\/$/g, '') || 'index'

      const fullPath = join(pathStaticSites, safePath)
      const dirPath = dirname(fullPath)
      const fileName = `${basename(fullPath)}.html`

      fs.mkdirSync(dirPath, { recursive: true })

      fs.writeFileSync(join(dirPath, fileName), data, {
        encoding: 'utf-8'
      })

      console.log(`✅ Successfully saved ${fileName}`)
    } catch (error) {
      console.error(`❌ Error requesting ${route}:`, error)
    }
  }
}

export const appAfter = (server: Server) => {
  if (
    typeof __SSG__ === 'undefined' ||
    (typeof __SSG__ === 'boolean' && !__SSG__)
  )
    return
  const port = (server.address() as AddressInfo).port
  makeRequests(port).then(() => {
    server.close()
    process.exit(0)
  })
}
