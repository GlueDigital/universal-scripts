// Optional server-only routes hook
const handleServerRoutes = (() => {
  const req = require.context('src/routes', false, /^\.\/serverRoutes$/)
  if (req.keys().length) return req(req.keys()[0]).default
})()

const serverRoutes = async (ctx, next) => {
  if (handleServerRoutes) {
    await handleServerRoutes(ctx, next)
  }
  await next()
}

export const serverMiddleware = serverRoutes
