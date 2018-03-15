Getting started
---------------

Creating a Universal Scripts project is very easy.
If you have [Yarn](https://yarnpkg.com) already installed, just do:
> yarn create react-app -- --scripts-version universal-scripts &lt;_app-name_&gt;

Alternatively, you can install [Create React App](https://github.com/facebookincubator/create-react-app) following the project instructions, then do:
> create-react-app --scripts-version universal-scripts &lt;_app-name_&gt;

Either way, when it finishes you'll have a project ready to start developing.
Enter the project folder and run:
> yarn start

It will start a development server on _localhost:3000_, watching for changes in any files on your project, and live-reloading them, similar to other Create React App projects.


Folder structure
----------------

On your new project there are a couple folders already. Here is their meaning:

- `src/locales`: Your app translations. The first key on the index will be the default one.
- `src/routes`: Describe your routes (using [React Router 3](https://github.com/ReactTraining/react-router/blob/v3.2.0/docs/guides/RouteConfiguration.md) syntax) on the index.
- `src/static`: Add your static assets (images, fonts, etc.), and they will get copied to the output root.
- `src/store`: Home of your Redux actions and reducers. The reducers.js controls which key will be handled by which reducer.
- `src/styles`: Your stylesheets get loaded from the main.sass, so import them from there.


Next steps
----------

Now let's see how to handle [data fetching](data-fetching) both on the client and the server.
