<p align="center">
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/LICENSE">
    <img alt="test" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/issues/new">
    <img alt="test" src="https://img.shields.io/npm/v/@gluedigital/universal-plugin-ssg.svg?style=flat" />
  </a>

</p>
<p align="center">
  <a href="https://www.npmjs.com/package/universal-scripts">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/@gluedigital/universal-plugin-ssg">
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/universal-plugins/universal-plugin-ssg/package.json">
    <img alt="node current" src="https://img.shields.io/node/v/@gluedigital/universal-plugin-ssg">
  </a>
</p>
<p align="center">
  <a href="https://github.com/GlueDigital/universal-scripts/issues/new">
    <img alt="node current" src="https://img.shields.io/badge/Report%20an%20issue-red">
  </a>
  <a href="https://gluedigital.github.io/universal-scripts">
    <img alt="node current" src="https://img.shields.io/badge/Complete%20documentation-orange">
  </a>
</p>

# Universal Plugin SSG

`@gluedigital/universal-plugin-ssg` is a plugin for the [`universal-scripts`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-scripts) framework that enables **Static Site Generation (SSG)**. It automatically generates static HTML files for predefined routes, improving performance and SEO while reducing server load.

## Features

- **Enables Static Site Generation (SSG).**
- **Improves performance** by serving pre-generated static pages.
- **Enhances SEO** by ensuring pages are fully rendered and crawlable by search engines.
- **Reduces server load** by serving static files instead of generating pages dynamically.
- **Supports dynamic route generation** by fetching data before building static pages.

## Installation

To install the plugin, run:

```sh
yarn add @gluedigital/universal-plugin-ssg
```

If using npm

```sh
npm install @gluedigital/universal-plugin-ssg
```

## Configuration

To define which routes should be statically generated, create a file named `static-routes.mjs` inside the **`src/routes/`** directory. This file should export an asynchronous function called `getStaticRoutes`, which returns an array of routes to be generated.

### Example

```js
export async function getStaticRoutes() {
  return ['/', '/dashboard', '/config', '/contact']
}
```

This function can fetch data from a database or an API to dynamically determine which pages need to be generated.

## Usage

To generate the static pages, run the following command:

```sh
yarn plugin ssg
```

or, if using npm:

```sh
npm run plugin ssg
```

This command will generate a production build and create the necessary static files.

## Benefits

- **Faster Load Times** – Pre-rendered static files ensure pages load instantly.
- **Better SEO** – Search engines can easily index fully rendered HTML pages.
- **Lower Server Costs** – Reduced reliance on server processing for rendering.
- **Improved User Experience** – Faster interactions and no delays from server-side processing.
- **Scalability** – Easily handle high traffic without additional server resources.

## Notes

- Ensure `static-routes.mjs` is correctly set up before running the build command.
- Dynamic routes requiring user input (e.g., `/profile/:id`) should be handled differently, as they cannot be pre-generated. If you want to prerender a route like this, in the file `static-routes.mjs` you should return for example a route called `/profile/1`.
- If your application includes frequently changing content, consider using a hybrid approach with both static and dynamic rendering.
