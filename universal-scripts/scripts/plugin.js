import {
  findUniversalPlugins,
  findScriptInPlugin
} from '../lib/find-scripts.js'
import spawn from 'cross-spawn'

const args = process.argv.slice(3)

const pluginScriptPath = findScriptInPlugin(
  findUniversalPlugins(),
  process.argv[2]
)

console.log(pluginScriptPath)

const result = spawn.sync('node', [pluginScriptPath, ...args], {
  stdio: 'inherit'
})

process.exit(result.status)
