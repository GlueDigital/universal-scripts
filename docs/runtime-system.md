The runtime system
------------------

When the bundles get run on the client or the server, they perform a lot of tasks to render your application.


### Runtime config

The runtime works similarly to the build system, using [js.conf.d-webpack](https://www.npmjs.com/package/js.conf.d-webpack) for modularity and ease of customization. The folder to add or override pieces of the runtime is `src/runtime.conf.d`, and you can create subfolders for `client` or `server` if you need them to run different code.

To learn more about the pieces that are included by default, you can check the `runtime.conf.d` folder on this project's root.


### Hooks

To determine when and how to call each runtime piece, we use a hook system. To use it, each file can have some special exports that get called on different moments of the application lifecycle. If multiple files export a hook, they will be used on file priority order. Hooks follow the Koa middleware spec, receiving a shared context, and a next function pointer.

The following hooks are available:
- `serverMiddleware`: (Server only) Adds a middleware to the internal Koa server.
- `clientInit`: (Client only) Gets called as part of the initialization process.
- `reactRoot`: Builds the root component for React, allowing multiple wrappers to be added to it.

The `33-lang` module is a good example which uses all hooks, to learn more about them.


Next steps
----------

After learning about the runtime system, we're ready for the last step: [deploying to a platform](deploying).
