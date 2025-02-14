import { dirname, resolve } from 'path'
import { realpathSync, readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import jest from 'jest'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appDirectory = realpathSync(process.cwd())

const getAliasesFromTSConfig = () => {
  const tsconfigPath = resolve(appDirectory, 'tsconfig.json')

  if (!existsSync(tsconfigPath)) return {}

  const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
  const paths = tsconfig.compilerOptions?.paths || {}

  const aliases = {}
  for (const [key, value] of Object.entries(paths)) {
    const cleanedPath = value[0].replace(/^\.\/?/, '')

    // Convertir a formato compatible con Jest
    const aliasKey = `^${key.replace('/*', '(.*)')}$`
    const aliasValue = `<rootDir>/${cleanedPath.replace('/*', '$1')}`
    aliases[aliasKey] = aliasValue
  }

  return aliases
}

const enhancer = () => {
  const config = {
    roots: ['<rootDir>/src'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': resolve(__dirname, '../lib/swcTransform')
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'
    ],
    moduleNameMapper: {
      '\\.(css|sass|scss)$': resolve(__dirname, '../lib/styleMock.js'),
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        resolve(__dirname, '../lib/fileMock.js'),
      ...getAliasesFromTSConfig()
    },
    setupFilesAfterEnv: []
  }

  const setupFiles = ['src/setupTests.ts', 'src/setupTests.js']
  setupFiles.forEach((f) => {
    if (existsSync(f)) config.setupFilesAfterEnv.push('<rootDir>/' + f)
  })

  const args = [`--config=${JSON.stringify(config)}`]

  return () => jest.run(args)
}

export const test = enhancer
