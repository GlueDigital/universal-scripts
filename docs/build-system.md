The build system
----------------

This section details how Webpack is configured for generating your project's build. Familiarity with Webpack configuration is assumed.

### Build modes
Webpack is configured in _multi build_ mode to create two builds: a _client_ bundle, and a _server_ bundle.
Each of these bundles also has two modes: the _watch_ mode, used on `npm start`, and the _build_ mode, used on `npm run build` and when deployed.

When in _watch_ mode, no files get written to disk, and both client and server access them from memory directly, thanks to the [webpack dev middleware](https://github.com/webpack/webpack-dev-middleware). When generating a _build_ instead, each bundle goes in a different folder on the `build/` dir.

Using the _multi build_ mode reduces the number of filesystem watchers needed, and should make things faster. It also makes possible for the same dev middleware to keep track of both builds, which makes server-side HMR work the same way as client-side HMR.

### Client build
The client build has an entrypoint to start the React rendering, which is provided as part of this package, and another entrypoint which points to your app's `src/index.js` file, so you can add your own initialization code. When on _watch_ mode, another entrypoint is added with the HMR code from webpack-hot-middleware.

### Server build
The server build is a bit harder. When on watch mode, the watch script runs `server/main.js` itself, and it is the one who starts the compiler, which has the `routerMiddleware` as the entrypoint, so the server can hot-reload it from memory through the compiler. On the other hand, for the _build_ mode, the server can't be the one running the compiler, as we want to compile first and run it later. For this reason, this build has the server as the entrypoint, and it gets bundled with the routerMiddleware, without the HMR code.

### The router middleware
To do the server-side rendering, the router middleware takes the following steps:
- Collect the asset list (either from the dev middleware, on _watch_ mode, or from the `webpack-assets.json` generated on _build_ mode).
- Pass the request through the react-router to find the correct route to render.
- Trigger any data-fetching functions required by components.
- Render the route.
- Use react-helmet to extract any headers generated during the render.
- Mix such headers with the assets from the first step, and build the final HTML.

### Static assets
The files on `src/static` are served from that folder directly during _watch_ mode, as we don't need to keep them in memory. When generating a _build_ mode bundle, they get copied directly to the build folder.

When referenced from CSS, images and fonts get a suffix with a part of the file contents hash, for cache-busting.


Next steps
----------

After learning about the build system, we're ready for the last step: [deploying to a platform](deploying).
