Adding an API server
--------------------

Sometimes you don't want to spawn another server just for the API calls, and just want to integrate it on the same Node server you already have. This is as simple as it can get with Universal Scripts.

Add a file with your [Koa](http://koajs.com/) middleware on `src/routes/serverRoutes.js` and it will be added to the Koa instance powering your project. This file will never be loaded from client-side, so you can call any Node module, like database access modules or filesystem reads.

For example:
```javascript
import KoaRouter from 'koa-router'

const router = KoaRouter()

router.get('/api/getUserInfo', async (ctx, next) => {
  ctx.body = { name: 'Test' } // Call anything from here
})

export default router.routes()
```


Next steps
----------

You have your API, an app that calls it, and everything goes great. Now might be a nice moment to learn more about how the [build system](build-system) works behind the scenes.
