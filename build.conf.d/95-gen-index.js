/**
 * Generate a index.htm file on client build if SSR is disabled.
 */
import fs from 'fs'
import path from 'path'

const appDirectory = fs.realpathSync(process.cwd())

const pkg = await import(path.join(appDirectory, 'package.json'), {
  assert: { type: 'json' }
})

const ssr = !pkg.universalOptions || !pkg.universalOptions.noSsr

// The default template can be overriden at src/static/index.htm
const defaultTemplate =
  '<!DOCTYPE html>' +
  '<html>' +
  '<head>' +
  '<meta charset="utf-8" />' +
  '<!-- STYLES -->' +
  '</head>' +
  '<body>' +
  '<div id="root"></div>' +
  '<!-- SCRIPTS -->' +
  '</body>' +
  '</html>'

// The webpack plugin which generates the index
class GenIndexPlugin {
  apply (compiler) {
    this.publicPath = compiler.options.output.publicPath
    compiler.hooks.emit.tap('genindex', this.genIndex.bind(this))
  }

  genIndex (compilation) {
    const publicPath = this.publicPath
    const assets = Object.keys(compilation.assets)

    let template = defaultTemplate
    const templateOverridePath = path.join(appDirectory, 'src', 'static', 'index.htm')
    if (fs.existsSync(templateOverridePath)) {
      template = fs.readFileSync(templateOverridePath).toString()
    }

    const scripts = []
    const styles = []
    for (const asset of assets) {
      if (asset.endsWith('.js') && asset !== 'polyfills.js') scripts.push(asset)
      if (asset.endsWith('.css')) styles.push(asset)
    }

    const scriptsFragment = scripts
      .map((script) => `<script src="${publicPath}${script}"></script>`)
      .join('')
    const stylesFragment = styles
      .map((style) => `<link rel="stylesheet" href="${publicPath}${style}" />`)
      .join('')

    const index = template
      .replace('<!-- SCRIPTS -->', scriptsFragment)
      .replace('<!-- STYLES -->', stylesFragment)

    compilation.assets['index.htm'] = {
      source: () => index,
      size: () => index.length
    }
  }
}

// Register the plugin in the build process, so it gets executed automatically
const enhancer = (opts = {}, config) => {
  if (!ssr && opts.id === 'client' && !opts.isWatch) {
    config.plugins.push(new GenIndexPlugin())
  }
  return config
}

export const webpack = enhancer
