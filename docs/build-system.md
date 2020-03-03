The build system
----------------

This section details how Webpack is configured for generating your project's build. Familiarity with Webpack configuration is assumed.


### Build config

All the build config is managed with [js.conf.d](https://www.npmjs.com/package/js.conf.d). This allows us to split the config on multiple files, each dealing with different functionalities, and also makes it possible to add new configs by just creating a file on the `build.conf.d` folder of the project. You can even override the built-in config by naming your file like the piece you want to replace.

To learn more about the config pieces that are included by default, you can check the `build.conf.d` folder on this project's root.


### Build modes

Webpack is configured in _multi build_ mode to create two builds: a _client_ bundle, and a _server_ bundle.
Each of these bundles also has two modes: the _watch_ mode, used on `npm start`, and the _build_ mode, used on `npm run build` and when deployed.

When in _watch_ mode, no files get written to disk, and both client and server access their bundles from memory directly, thanks to the [webpack dev middleware](https://github.com/webpack/webpack-dev-middleware). When generating a _build_ instead, each bundle goes in a different folder on the `build/` dir.

Using the _multi build_ mode reduces the number of filesystem watchers needed, and should make things faster. It also makes possible for the same dev middleware to keep track of both builds, which makes server-side HMR work the same way as client-side HMR.


### Client build

There are two different bundles for the client side:
- `polyfills`: Loaded only on browsers which require them, before starting rendering. Can be overriden by creating `src/polyfills.js` on your project.
- `main`: Deals with everything else, including initialization and rendering. Can be configured with the runtime config system.


### Server build

The server build varies depending on the selected mode. When on watch mode, we run `server/main.js` with Node, and it starts the compiler with `serverMiddleware` as the entrypoint, so the server can hot-reload it from memory through the compiler. On the other hand, for the _build_ mode the server can't be the one running the compiler, as we want to compile first and run the bundle later. For this reason, this build has `server/main.js` as the entrypoint, and it gets bundled directly with the `serverMiddleware`, without the HMR code.


### Static assets
The files on `src/static` are served from that folder directly during _watch_ mode, as we don't need to keep them in memory. When generating a _build_ mode bundle, they get copied directly to the build folder.

When referenced from CSS, images and fonts get a suffix with a part of the file contents hash, for cache-busting.


Next steps
----------

The build system makes it possible to run code on the client and server, but to learn more about that code, you can check the [runtime system](runtime-system).
