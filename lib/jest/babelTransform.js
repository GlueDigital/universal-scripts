const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer({
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3
      }
    ],
    "@babel/preset-typescript",
    [
      "@babel/preset-react",
      {
        runtime: 'automatic'
      },
    ]
  ],
  babelrc: false,
  configFile: false,
})
