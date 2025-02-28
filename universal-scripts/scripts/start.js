import 'dotenv/config'

// Babel will complain if no NODE_ENV. Set it if needed.
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const builder = (await import('../lib/builder.js')).default
const compiler = await builder({ isWatch: true })

global.__WATCH__ = true // Signal to server that we're doing HMR
const server = (await import('../server/main.js')).default
server(compiler)
