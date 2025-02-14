import swcJest from '@swc/jest'

export default swcJest.createTransformer({
  jsc: {
    parser: {
      syntax: 'typescript',
      jsx: true,
      tsx: true
    },
    transform: {
      react: {
        runtime: 'automatic' // Equivalent to '@babel/preset-react'
      }
    },
    target: 'es2022', // Similar to @babel/preset-env
    externalHelpers: true // Equivalent to '@babel/plugin-transform-runtime'
  },
  swcrc: false,
  configFile: false
})
