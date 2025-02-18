import { resolve } from 'path'

/**
 * @param {{ loaders: loader[], exts: string[] }} styleConfig [styleLoader, cssLoader, postCssLoader]
 * @param {*} opts General opts for build
 * @returns updated loaders and extensions
 */
export function stylesExtras(styleConfig, opts) {
  const [css] = styleConfig
  const { loaders } = css

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      sassOptions: {
        includePaths: [resolve('appDirectory', 'src', 'styles')]
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
