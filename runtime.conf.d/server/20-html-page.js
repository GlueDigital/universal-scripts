import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import path from 'path'
import fs from 'fs'
import defaultHeaders from '../../lib/header'
import renderHtmlLayout from '../../lib/render-html-layout'

const basename = process.env.SUBDIRECTORY || '/'

let chunks = []
if (!__WATCH__) {
  const fname = path.resolve('build', 'client', 'webpack-chunks.json')
  chunks = JSON.parse(fs.readFileSync(fname)).entrypoints
}

let index = false
if (!__WATCH__ && !__SSR__) {
  const fname = path.resolve('build', 'client', 'index.htm')
  index = fs.readFileSync(fname)
}

const generateHtml = async (req, res, next) => {
  // Estos contendrán los scripts y estilos que se incluirán en la página.
  const scripts = []
  const styles = []
  const reqBasename = req.basename || basename

  // Si el middleware DEV tiene algunos assets, añádelos.
  let assets = []
  if (!__WATCH__) {
    assets = chunks
  } else if (req.clientStats) {
    req.clientStats.entrypoints.main.assets.forEach(asset => {
      assets = assets.concat(asset.name)
    })
  }

  for (const asset of assets) {
    if (asset.endsWith('.js') && asset !== 'polyfills.js') {
      scripts.push(reqBasename + asset)
    } else if (asset.endsWith('.css')) {
      styles.push(`<link rel="stylesheet" href="${reqBasename + asset}" />`)
    }
  }

  // Hacer visibles nuestros recursos para otros middlewares también
  req.assets = { scripts, styles }
  res.status(200)

  req.helmetContext = {}

  // Ejecuta cualquier otro middleware
  await next()

  // Obtener los headers de react-helmet
  const head = req.helmetContext.helmet
  res.write(renderHtmlLayout(head, styles))

  // Añadir el stream, si existe, desde la renderización
  if (req.stream) {
    res.status(200)
    req.stream.pipe(res)
    res.end()
  } else {
    res.end()
  }
}

const staticHtml = async (req, res, next) => {
  // Usamos un HTML preconstruido
  await next()
  res.type('text/html')
  res.send(index) // 'index' debe ser el HTML preconstruido
}

export const serverMiddleware = index ? staticHtml : generateHtml

const addDefaultHeaders = async (req, res, next) =>
  <HelmetProvider context={req.helmetContext}>
    {defaultHeaders(req.store)}
    {await next()}
  </HelmetProvider>

export const reactRoot = addDefaultHeaders
