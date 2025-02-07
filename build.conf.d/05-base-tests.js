import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const enhancer = () => {
  const config = {
    roots: ['<rootDir>/src'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': path.resolve(
        __dirname,
        '../lib/jest/swcTransform'
      )
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'
    ],
    moduleNameMapper: {
      '\\.(css|sass|scss)$': path.resolve(
        __dirname,
        '../lib/jest/styleMock.js'
      ),
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        path.resolve(__dirname, '../lib/jest/fileMock.js'),
      '^@components(.*)$': '<rootDir>/src/components$1',
      '^@routes(.*)$': '<rootDir>/src/routes$1',
      '^@static(.*)$': '<rootDir>/src/static$1',
      '^@hooks(.*)$': '<rootDir>/src/hooks$1',
      '^@utils(.*)$': '<rootDir>/src/utils$1'
    },
    setupFilesAfterEnv: []
  }

  const setupFiles = ['src/setupTests.ts', 'src/setupTests.js']
  setupFiles.forEach((f) => {
    if (fs.existsSync(f)) config.setupFilesAfterEnv.push('<rootDir>/' + f)
  })

  return config
}

export const test = enhancer
