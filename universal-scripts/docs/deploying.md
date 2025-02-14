## Deploying to a platform

Deploying an Universal Scripts app is very easy on most platforms.

### Heroku

The project is already configured for deployiment at Heroku and any other system based on their buildpacks, like Dokku. Just push your code to the server, and it will generate a build and serve it.

### Other platforms

If you use any other platform, just configure it so that Node is available, and run the following commands:

- Before build: npm install
- Build: npm run build
- Execute: npm run serve

### Static build

Generating a static build to be served with a static file server is not officially supported, as you'd lose the server-side rendering benefits, but if you still want to do it, the process would be something like:

- Generate a standard build (ie: `npm run build`)
- Create a index.htm which loads the JS and CSS assets listed at `build/client/webpack-chunks.json`
- Configure your web server to serve the `build/client` folder, and reply to all unknown routes with the index.htm file.

The generated code will compensate for the missing initial state and DOM nodes, and the page will work.

### Subdirectory

The build system allows configuring a build (or watch mode) to run inside a subdirectory. Just set the ENV var `SUBDIRECTORY` to the absolute path of the app subdirectory (ie: `/client/`). Relative URLs are unsupported, as they would change meaning depending on which route gets loaded.
