'use strict'
process.env.NODE_ENV = 'test'

process.on('unhandledRejection', err => { throw err })

require('dotenv').config()

const path = require('path')
const fs = require('fs')
const jest = require('jest')
const argv = process.argv.slice(2)

const config = {
  roots: ['<rootDir>/src'],
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

argv.push('--config', JSON.stringify(config))

jest.run(argv)
