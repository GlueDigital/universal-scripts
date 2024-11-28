#!/usr/bin/env node

// This script just executes the appropiate script on the scripts folder.
import spawn from 'cross-spawn'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const script = process.argv[2]
const args = process.argv.slice(3)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const scriptPath = resolve(__dirname, '../scripts/', script)

// Can be executed with this line
await import(`../scripts/${script}.js`)

const result = spawn.sync(
  'node',
  [scriptPath, ...args],
  { stdio: 'inherit' }
)

process.exit(result.status)
