import { resolve } from 'path'
import { getPluginsConfig } from 'universal-scripts/lib/universal-config.js'

/**
 * @param {{ loaders: loader[], exts: string[] }} styleConfig [styleLoader, cssLoader, postCssLoader]...
 * @param {*} opts General opts for build
 * @returns updated loaders and extensions
 */
export async function stylesExtras(styleConfig, opts) {
  const [css] = styleConfig
  const { loaders } = css

  const sassConfig = await getPluginsConfig('sass')

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      sassOptions: {
        includePaths: [resolve('appDirectory', 'src', 'styles')],
        quietDeps: true,
        exclude: ['import'],
        ...sassConfig
      }
    }
  }

  return [
    ...styleConfig,
    {
      loaders: [...loaders, sassLoader].filter(Boolean),
      exts: ['scss', 'sass']
    }
  ]
}
