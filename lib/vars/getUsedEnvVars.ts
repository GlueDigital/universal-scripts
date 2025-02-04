import fs from 'node:fs'
import path from 'node:path'
import { parseSync } from '@swc/core'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appDirectory = fs.realpathSync(process.cwd())

const SCAN_DIR = path.resolve(appDirectory, 'src');

function getJSFiles(dir: string, fileList: string[] = []) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getJSFiles(filePath, fileList)
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

export function extractUsedEnvVariables() {
  const usedEnvVars = new Set()

  getJSFiles(SCAN_DIR).forEach(file => {
    const code = fs.readFileSync(file, 'utf-8')
    try {
      const ast = parseSync(code, {
        syntax: file.endsWith('.ts') || file.endsWith('.tsx') ? 'typescript' : 'ecmascript',
        jsx: true,
        tsx: true,
        target: 'esnext',
      });

      function traverse(node) {
        if (node && typeof node === 'object') {
          if (
            node.type === 'MemberExpression' &&
            node.object.type === 'MemberExpression' &&
            node.object.object.type === 'Identifier' &&
            node.object.object.value === 'process' &&
            node.object.property.type === 'Identifier' &&
            node.object.property.value === 'env' &&
            node.property.type === 'Identifier'
          ) {
           usedEnvVars.add(node.property.value)
          }

          for (const key in node) {
            traverse(node[key])
          }
        }
      }

      traverse(ast)
    } catch (error) {
      console.error(`Error parsing file: ${file}`, error)
    }
  });

  return Array.from(usedEnvVars)
}