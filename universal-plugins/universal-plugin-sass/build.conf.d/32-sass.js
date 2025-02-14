import { resolve } from 'path'

/**
 * @param {{ loaders: loader[], exts: string[] }} styleConfig [styleLoader, cssLoader, postCssLoader]
 * @param {*} opts General opts for build
 * @returns updated loaders and extensions
 */
export function stylesExtras(styleConfig, opts) {

  const { exts, loaders } = styleConfig

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      sassOptions: {
        includePaths: [resolve('appDirectory', 'src', 'styles')]
      }
    }
  }

  return ({
    loaders: [...loaders, sassLoader],
    exts: [...exts, 'scss', 'sass'],
  })
}