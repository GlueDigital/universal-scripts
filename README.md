[![Build Status](https://travis-ci.org/GlueDigital/universal-scripts.svg?branch=master)](https://travis-ci.org/GlueDigital/universal-scripts)

# Universal Scripts
Alternative scripts and configuration for [Create React App](https://github.com/facebookincubator/create-react-app), with enhaced functionality.

## Why Universal Scripts
When building a real web app, you need a lot of features not found on most "learning" starter kits, such as the one provided by React. This package provides an opinionated alternative with what we believe is the minimum that any modern app needs.

In addition to the features present on React Scripts, it features:
 - Server side rendering (ie: universal), using Koa
 - Internationalization support, with react-intl
 - State management, via Redux

## Usage
If you have yarn, just do:
> yarn create react-app -- --scripts-version universal-scripts &lt;app-name&gt;

Otherwise, you should use the original Create React App.<br>
If you haven't installed it yet, you can do it with:
> npm install -g create-react-app

Then, to create a project, do:
> create-react-app --scripts-version universal-scripts <app-name>

## Fetch Data
If any route or component needs to load external data before rendering, such as making an API call to fetch some data, you can use a static `fetchData` method on the component. The server will call it and if it returns a promise, wait for it before rendering it, while the client will call it on navigation. It will receive the component props, the dispatch function, and the store state, and it can return either a thunk, a promise, or any sync value.

On the server, if you want the route to set cookies or result in a redirect in response to a fetchData method, you can return an object (or a promise resolving to it) with a `__serverDirectives` key, which should be another object, and can contain:
 - A `cookies` array, containing objects for each cookie to create, with fields: name, value, and any other options that ctx.cookies can handle.
 - A `redirect` string, with the destination of a redirection.

For more info, check the [fetchData](lib/fetchData.js) documentation.

## How does it work?
The build process is a bit complex, and most users won't need to bother with the details, but we'll explain them here for power users.

### Build modes
Webpack is configured in *multi build* mode to create two builds: a *client* bundle, and a *server* bundle.
Each of these bundles also has two modes: the *watch* mode, used on `npm start`, and the *build* mode, used on `npm run build` and when deployed.

When in *watch* mode, no files get written to disk, and both client and server access them from memory directly, thanks to the webpack dev middleware. When generating a *build* instead, each bundle goes in a different folder on the `build/` dir.

Using the *multi build* mode reduces the number of filesystem watchers needed, and should make things faster. It also makes possible for the same dev middleware to keep track of both builds, which makes server-side HMR work the same way as client-side HMR.

### Client build
The client build has an entrypoint to start the React rendering, which is provided as part of this package, and another entrypoint which points to your app's `src/index.js` file, so you can add your own initialization code. When on *watch* mode, another entrypoint is added with the HMR code from webpack-hot-middleware.

### Server build
The server build is a bit harder. When on watch mode, the watch script runs `server/main.js` itself, and it is the one who starts the compiler, which has the `routerMiddleware` as the entrypoint, so the server can hot-reload it from memory through the compiler. On the other hand, for the *build* mode, the server can't be the one running the compiler, as we want to compile first and run it later. For this reason, this build has the server as the entrypoint, and it gets bundled with the routerMiddleware, without the HMR code.

### The router middleware
To do the server-side rendering, the router middleware takes the following steps:
- Collect the asset list (either from the dev middleware, on *watch* mode, or from the `webpack-assets.json` generated on *build* mode).
- Pass the request through the react-router to find the correct route to render.
- Trigger any data-fetching functions required by components.
- Render the route.
- Use react-helmet to extract any headers generated during the render.
- Mix such headers with the assets from the first step, and build the final HTML.
