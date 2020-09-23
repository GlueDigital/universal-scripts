Introduction
------------

_Universal Scripts_ is an alternative configuration for [Create React App](https://github.com/facebookincubator/create-react-app), designed for production sites that need features such as:

- Server-Side Rendering (aka. _universal rendering_)
- Internationalization with react-intl
- HTML head customization with react-helmet-async
- Redux state container
- Sass (and SCSS) support
- And of course, everything on React Scripts: ES6 & TypeScript support, React Router, etc.

Everything on a single package, easy to keep updated, and ready to deploy to your favourite platform.


But... why?
-----------

When learning, Create React App is a nice way to kickstart your projects, as you can forget about handing Webpack and Babel configs, dependency updates, etc., but the defaults are designed for an easy learning experience, at the expense of some features that are needed in a modern web application.

Server side rendering is a must for a production site, so your visitors can get the content much faster instead of waiting looking at an empty screen while your JS downloads and processes. It also helps make the page more accesible to crawlers and other tools that don't yet understand JS-only sites, like most Opengraph extractors.

Internationalization is needed on any site targeting a broad audience from multiple countries, but it is useful even for single-language pages, as it helps keeping strings organized, and number and date formatting consistent.

[Redux](https://redux.js.org/) helps keep state organized and predictable, and is a great fit when working with universal rendering, as it allows easy state serialization to send initial content to the client.

And we also included a few other goodies, like [Sass](https://sass-lang.com/), the best known CSS extension language, or [react-helmet-async](https://github.com/staylor/react-helmet-async), a way of managing the document head.


Sounds good?
------------

Head to the [Getting Started](getting-started) section to try it.
