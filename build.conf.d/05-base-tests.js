const path = require('path')
const fs = require('fs')

const enhancer = (opts = {}) => {
  const config = {
    roots: ['<rootDir>/src'],
    moduleDirectories: ['node_modules', '.'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': path.resolve(__dirname, '../lib/jest/babelTransform')
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'
    ],
    moduleNameMapper: {
      '\\.(css|sass|scss)$': path.resolve(__dirname, '../lib/jest/emptyMock.js'),
      '\\.(gif|jpg|jpeg|png|ttf|eot|svg)$': path.resolve(__dirname, '../lib/jest/emptyMock.js')
    },
    setupFilesAfterEnv: []
  }

  const setupFiles = ['src/setupTests.ts', 'src/setupTests.js']
  setupFiles.forEach(f => {
    if (fs.existsSync(f)) config.setupFilesAfterEnv.push('<rootDir>/' + f)
  })

  return config
}

module.exports = {
  test: enhancer
}
