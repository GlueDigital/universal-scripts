Introduction
------------

_Universal Scripts_ is an alternative configuration for [Create React App](https://github.com/facebookincubator/create-react-app), designed for production sites that need features such as:

- Server-Side Rendering (aka. _universal rendering_)
- Internationalization
- Redux state container
- SASS (or SCSS) support
- And of course, everything on React Scripts: ES6 support, React Router, etc.

Everything on a single package, easy to keep updated, and ready to deploy to your favourite platform.


But... why?
-----------

Create React App is a nice way to kickstart your projects, and to forget about handing Webpack config, dependency updates, etc., but the defaults are designed for an easy learning experience, at the expense of some features that are needed in a modern SPA.

Server side rendering is a must for a production site, so your visitors don't have to wait looking at an empty screen while your JS downloads and processes, and to make it more accesible to crawlers and other tools that don't yet understand JS-only sites.

Internationalization is needed on any site targeting a broad audience from multiple countries, but it is useful even for single-language pages, as it helps keeping strings organized, and number and date formatting consistent.

And the other tools have nice pages explaining why they are useful on many big projects.


Sounds good?
------------

Head to the [Getting Started](getting-started) section to try it.
