Getting started
---------------

Creating a Universal Scripts project is very easy.
If you have [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) available (comes with npm 5.2+), just do:
> npx create-react-app \-\-scripts-version universal-scripts &lt;_app-name_&gt;

Alternatively, you can install [Create React App](https://github.com/facebookincubator/create-react-app) following the project instructions, then do:
> create-react-app \-\-scripts-version universal-scripts &lt;_app-name_&gt;

Either way, when it finishes you'll have a project ready to start developing.
Enter the project folder and run:
> npm start

It will start a development server on _localhost:3000_, watching for changes in any files on your project, and live-reloading them, similar to other Create React App projects.


Folder structure
----------------

Your new project already contains some predefined folders:

- `src/locales`: Your app translations. The first key on the index will be the default language.
- `src/routes`: The index will be the root component of your app. Use react-router to manage routing.
- `src/static`: Add your static assets (images, fonts, etc.), and they will get copied to the output root.
- `src/store`: Home of your Redux actions and reducers. At `reducers.js` you should export an object to pass to combineReducers to build the root reducer.
- `src/styles`: Your stylesheets get loaded from the index.sass, so import them from there.


Next steps
----------

Now let's see how to handle [data fetching](data-fetching) both on the client and the server.
