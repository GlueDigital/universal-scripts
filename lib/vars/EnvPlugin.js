import fs from 'fs';
import { parseSync } from '@swc/core';

// SLOWER
export class ExtractEnvKeysPlugin {
  constructor() {
    const appDirectory = fs.realpathSync(process.cwd());
    this.rootDir = `${appDirectory}/src`;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ExtractEnvKeysPlugin', (compilation, callback) => {
      const usedEnvVars = new Set();

      console.time("EXECTION TIME")

      Object.keys(compilation.assets).forEach((filename) => {
        if (!filename.endsWith('.js')) return;

        const source = compilation.assets[filename].source();

        try {
          const ast = parseSync(source, {
            syntax: 'ecmascript',
            target: 'es2022',
            jsx: true,
            tsx: true
          });

          function getEnvVarName(node) {
            if (node.type === 'MemberExpression' && node.property?.type === 'Identifier') {
              return node.property.value;
            }
            return null;
          }

          function traverse(node, parent = null) {
            if (node && typeof node === 'object') {
              if (
                node.type === 'MemberExpression' &&
                node.object.type === 'MemberExpression' &&
                node.object.object.type === 'Identifier' &&
                node.object.object.value === 'window' &&
                node.object.property.type === 'Identifier' &&
                node.object.property.value === '___INITIAL_STATE__' &&
                node.property.type === 'Identifier' &&
                node.property.value === 'env'
              ) {
                // Si el padre es otro MemberExpression, seguimos hasta obtener la clave
                let currentNode = parent;
                while (currentNode && currentNode.type === 'MemberExpression') {
                  const envKey = getEnvVarName(currentNode);
                  if (envKey) {
                    usedEnvVars.add(envKey);
                    break;
                  }
                  currentNode = currentNode.parent; // Subimos un nivel más
                }
              }

              for (const key in node) {
                if (typeof node[key] === 'object' && node[key] !== null) {
                  traverse(node[key], node);
                }
              }
            }
          }

          traverse(ast);
        } catch (error) {
          console.error(`Error analizando ${filename}:`, error);
        }
      });

      console.timeEnd("EXECTION TIME")

      console.log('Variables de entorno usadas:', Array.from(usedEnvVars));
      callback();
    });
  }
}

// 2nd FASTER

/**
 * import fs from 'fs'

export class ExtractEnvKeysPlugin {

  constructor() {
    const appDirectory = fs.realpathSync(process.cwd())
    this.rootDir = `${appDirectory}/src`
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ExtractEnvKeysPlugin', (compilation, callback) => {
      const usedEnvVars = new Set();
      const envRegex = /window\.___INITIAL_STATE__\.env\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
      console.time("EXECUTION TIME")
      Object.keys(compilation.assets).forEach((filename) => {
        if (filename.endsWith('.js')) {
          const source = compilation.assets[filename].source();
          // if (source.includes('window.___INITIAL_STATE__')) {
          //   console.log(source)
          // }
          let match;
          while ((match = envRegex.exec(source)) !== null) {
            usedEnvVars.add(match[1]);
          }
        }
      });

      console.timeEnd("EXECUTION TIME")
      console.log('Variables de entorno usadas:', Array.from(usedEnvVars));

      callback();
    });
  }
}
 */

// FASTER

/**
 * import fs from 'fs';
import { parseSync } from '@swc/core';

export class ExtractEnvKeysPlugin {
  constructor() {
    const appDirectory = fs.realpathSync(process.cwd());
    this.rootDir = `${appDirectory}/src`;
  }

  apply(compiler) {
    const usedEnvVars = new Set();

      console.time("EXECUTION TIME")

    compiler.hooks.compilation.tap('ExtractEnvKeysPlugin', (compilation) => {
      compilation.hooks.succeedModule.tap('ExtractEnvKeysPlugin', (module) => {
        if (!module.resource || !module.resource.startsWith(this.rootDir)) return;
        if (!module.resource.match(/\.(js|jsx|ts|tsx)$/)) return;

        const source = module.originalSource()?.source();
        if (!source) return;

        try {
       
          const ast = parseSync(source, {
            syntax: 'ecmascript',
            target: 'es2022',
          });

          function traverse(node, parent = null) {
            if (node && typeof node === 'object') {
              if (
                node.type === 'MemberExpression' &&
                node.object.type === 'MemberExpression' &&
                node.object.object.type === 'Identifier' &&
                node.object.object.value === 'process' &&
                node.object.property.type === 'Identifier' &&
                node.object.property.value === 'env'
              ) {
                // Si el padre es otro MemberExpression, seguimos hasta obtener la clave
                usedEnvVars.add(node.property.value)
              }

              for (const key in node) {
                if (typeof node[key] === 'object' && node[key] !== null) {
                  traverse(node[key], node);
                }
              }
            }
          }

          traverse(ast);
        } catch (error) {
          console.error(`Error analizando ${filename}:`, error);
        }
      })
    });
    console.timeEnd("EXECUTION TIME")

    compiler.hooks.done.tap('ExtractEnvKeysPlugin', () => {
      console.log('Variables de entorno usadas:', Array.from(usedEnvVars));
    });

  }
}
 */

/**
 *
import fs from 'fs';
import { parseSync } from '@swc/core';
import webpack from 'webpack';
const { Compilation, sources } = webpack

export class ExtractEnvKeysPlugin {
  constructor() {
    const appDirectory = fs.realpathSync(process.cwd());
    this.rootDir = `${appDirectory}/src`;
  }

  apply(compiler) {
    const usedEnvVars = new Set();

      console.time("EXECUTION TIME")

    compiler.hooks.compilation.tap('ExtractEnvKeysPlugin', (compilation) => {
      compilation.hooks.succeedModule.tap('ExtractEnvKeysPlugin', (module) => {
        if (!module.resource || !module.resource.startsWith(this.rootDir)) return;
        if (!module.resource.match(/\.(js|jsx|ts|tsx)$/)) return;

        const source = module.originalSource()?.source();
        if (!source) return;

        try {
       
          const ast = parseSync(source, {
            syntax: 'ecmascript',
            target: 'es2022',
          });

          function traverse(node) {
            if (node && typeof node === 'object') {
              if (
                node.type === 'MemberExpression' &&
                node.object.type === 'MemberExpression' &&
                node.object.object.type === 'Identifier' &&
                node.object.object.value === 'process' &&
                node.object.property.type === 'Identifier' &&
                node.object.property.value === 'env'
              ) {
                // Si el padre es otro MemberExpression, seguimos hasta obtener la clave
                usedEnvVars.add(node.property.value)
              }

              for (const key in node) {
                if (typeof node[key] === 'object' && node[key] !== null) {
                  traverse(node[key]);
                }
              }
            }
          }

          traverse(ast);
        } catch (error) {
          console.error(`Error analizando ${filename}:`, error);
        }
      })

      compilation.hooks.processAssets.tap({
        name: 'ExtractEnvKeysPlugin',
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        additionalAssets: true
      }, (assets) => {
        const envVarsJs = `const usedVariablesWithoutValues = ${JSON.stringify(Array.from(usedEnvVars))};
        const variablesWithValues = Object.fromEntries(Object.entries(${JSON.stringify(process.env)}).filter(([key]) => usedVariablesWithoutValues.includes(key)));
        window.__INITIAL_VARS__ = variablesWithValues;
        console.log(variablesWithValues);
        console.log(usedVariablesWithoutValues);`;
        compilation.emitAsset('envVarsJs.js', new sources.RawSource(envVarsJs))
      })
    });
    console.timeEnd("EXECUTION TIME")

    

  }
}
 */