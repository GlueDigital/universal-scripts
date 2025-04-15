// @ts-check

import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

// import nodePlugin from 'eslint-plugin-n'

// Waiting to support eslint 9

// import importPlugin from 'eslint-plugin-import'
// import hooksPlugin from 'eslint-plugin-react-hooks'

export default [
  eslint.configs.recommended,
  // nodePlugin.configs['flat/recommended-script'],
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintPluginPrettier,
  ...compat.config({
    extends: ['plugin:react-hooks/recommended']
  }),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        __DEV__: 'readonly',
        __PROD__: 'readonly',
        __SERVER__: 'readonly',
        __CLIENT__: 'readonly',
        __WATCH__: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
]
