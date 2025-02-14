## Getting started

Creating a Universal Scripts project is very easy.
Using [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b), just do:

> npx create-react-app \-\-scripts-version universal-scripts &lt;_app-name_&gt;

When it finishes you'll have a project ready to start developing.
Enter the project folder and run:

> npm start

It will start a development server on _localhost:3000_, watching for changes in any files on your project, and live-reloading them, similar to other Create React App projects.

## Folder structure

Your new project already contains some predefined folders:

- `src/locales`: Your app translations. The first key on the index will be the default language.
- `src/routes`: The index will be the root component of your app. Use react-router to manage routing.
- `src/static`: Add your static assets (images, fonts, etc.), and they will get copied to the output root.
- `src/store`: Home of your Redux actions and reducers. At `reducers.js` you should export an object to pass to combineReducers to build the root reducer.
- `src/styles`: Your stylesheets get loaded from the index.sass, so import them from there.

## TypeScript

If you would rather use TypeScript, you can create your project using our alternate TypeScript template, by doing:

> npx create-react-app \-\-scripts-version universal-scripts \-\-template universal-ts &lt;_app-name_&gt;

All the config and structure is exactly the same, but using TypeScript.

## Custom templates

Just like stock Create React App, we support the use of custom templates during project init.

Not all CRA templates will be compatible, though: they must contain the required entrypoints provided in our base template, [cra-template-universal](https://github.com/GlueDigital/cra-template-universal). If you want to create your custom template, we recommend using it as a starting point.

## Next steps

Now let's see how to handle [data fetching](data-fetching) both on the client and the server.
