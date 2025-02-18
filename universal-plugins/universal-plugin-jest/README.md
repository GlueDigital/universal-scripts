<p align="center">
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/LICENSE">
    <img alt="test" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/issues/new">
    <img alt="test" src="https://img.shields.io/npm/v/@gluedigital/universal-plugin-jest.svg?style=flat" />
  </a>

</p>
<p align="center">
  <a href="https://www.npmjs.com/package/universal-scripts">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/@gluedigital/universal-plugin-jest">
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/universal-plugins/universal-plugin-jest/package.json">
    <img alt="node current" src="https://img.shields.io/node/v/@gluedigital/universal-plugin-jest">
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

# Universal Plugin Jest

This is a plugin for the [`universal-scripts`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-scripts) framework. It provides configuration for running tests with [`Jest`](https://jestjs.io/) in Universal-based projects.

## Features

- Preconfigured setup for running tests with Jest.
- Supports unit and integration testing in React applications.
- Fully compatible with TypeScript and [`SWC`](https://swc.rs/) for faster builds.
- Works with `@testing-library/react` and `@testing-library/jest-dom` for component testing (optional).

## Installation

To install the plugin, run:

```sh
yarn add @gluedigital/universal-plugin-jest
```

If using npm

```sh
npm install @gluedigital/universal-plugin-jest
```

Now you can execute the tests with:

```sh
yarn test
```

If using npm

```sh
npm run test
```

If you need to test React components, you can install `@testing-library/react` and `@testing-library/jest-dom` for additional utilities:

```sh
yarn add -D @testing-library/react @testing-library/jest-dom
```

If using npm

```sh
npm install -D @testing-library/react @testing-library/jest-dom
```

Once installed, you can import them in your tests:

```typescript
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyComponent from "./MyComponent";

test("renders the component correctly", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello, Jest!")).toBeInTheDocument();
});
```

## Why Use This Plugin?

- **Plug & Play**: No need for complex Jest configurations—just install and start testing.
- **Performance Optimized**: Uses SWC for faster transformations.
- **Flexible**: Works with both JavaScript and TypeScript projects.
