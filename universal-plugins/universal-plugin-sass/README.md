<p align="center">
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/LICENSE">
    <img alt="test" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/issues/new">
    <img alt="test" src="https://img.shields.io/npm/v/@gluedigital/universal-plugin-sass.svg?style=flat" />
  </a>

</p>
<p align="center">
  <a href="https://www.npmjs.com/package/universal-scripts">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/@gluedigital/universal-plugin-sass">
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/universal-plugins/universal-plugin-sass/package.json">
    <img alt="node current" src="https://img.shields.io/node/v/@gluedigital/universal-plugin-sass">
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

# Universal Plugin Sass

This is a plugin for the [`universal-scripts`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-scripts) framework. It enables support for [`Sass`](https://sass-lang.com/), allowing you to use `.scss` or `.sass` files in your Universal project.

## Features

- Enables Sass (`.scss` and `.sass` file support) for styling.
- Compatible with CSS Modules for scoped styling.
- Works with Webpack-based builds in Universal projects.
- Allows better organization of styles and reusable variables.

## Installation

To install the plugin, run:

```sh
yarn add @gluedigital/universal-plugin-sass
```

If using npm

```sh
npm install @gluedigital/universal-plugin-sass
```

Then you can

```{sass}
// styles/index.sass
body
  background-color: #f4f4f4
  font-family: Arial, sans-serif
```

Import it in your application:

```typescript
import "./styles/index.sass"

const App = () => <div>Welcome to My App</div>

export default App
```
