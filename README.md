[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/GlueDigital/universal-scripts/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/universal-scripts.svg?style=flat)](https://www.npmjs.com/package/universal-scripts)
[![Build Status](https://travis-ci.org/GlueDigital/universal-scripts.svg?branch=master)](https://travis-ci.org/GlueDigital/universal-scripts)
[![Dependencies](https://david-dm.org/GlueDigital/universal-scripts.svg)](https://david-dm.org/GlueDigital/universal-scripts)


Universal Scripts
=================

Alternative configuration for [Create React App](https://github.com/facebookincubator/create-react-app), with enhanced functionality, including server-side rendering and internationalization.

- [Read the documentation](https://gluedigital.github.io/universal-scripts)
- Migrating from v1? Check the [migration guide](https://gluedigital.github.io/universal-scripts/migration)
- [Report an issue](https://github.com/GlueDigital/universal-scripts/issues/new)


Quick start
-----------

If you have any maintained version of Node (at least v10) and NPM, just run:

```bash
npx create-react-app --scripts-version universal-scripts my-app
cd my-app
npm start
```

Then go to [http://localhost:3000](http://localhost:3000) to see your app.


Why Use This?
-------------

Create React App is the best way of keeping the build config out of your project, and makes build dependencies easier to manage, as you'll only need to care about a single package. But the default configuration is geared towards showing React to novices, and is missing some functionality required for bigger apps.

You could "_eject_", as they call it, and fine-tune your config, but this is hard, and loses many of the benefits of CRA. Many people [fork React Scripts](https://medium.com/@kitze/configure-create-react-app-without-ejecting-d8450e96196a), so they can add support for the bits they need while keeping the config out. We decided to make a full rewrite, as our config was very different from the default one, but it still works with CRA, giving you all of its benefits.

Want to see all that it can do for your projects? Check the [docs](https://gluedigital.github.io/universal-scripts), or just skip to the [getting started](https://gluedigital.github.io/universal-scripts/getting-started) guide.
