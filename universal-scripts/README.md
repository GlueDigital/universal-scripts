<p align="center">
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/LICENSE">
    <img alt="test" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/issues/new">
    <img alt="test" src="https://img.shields.io/npm/v/universal-scripts.svg?style=flat" />
  </a>

</p>
<p align="center">
  <a href="https://www.npmjs.com/package/universal-scripts">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/universal-scripts">
  </a>
  <a href="https://github.com/GlueDigital/universal-scripts/blob/master/universal-scripts/package.json">
    <img alt="node current" src="https://img.shields.io/node/v/universal-scripts">
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

# Universal Scripts

Universal Scripts is a highly flexible framework for React projects, offering advanced features such as Server-Side Rendering (SSR) and internationalization (i18n). It allows you to extend or override existing configurations, giving you complete control over your setup.

- Server-Side Rendering.
- TypeScript support with support for custom alias.
- Internationaliztion with [`react-intl`](https://github.com/ericf/react-intl),
- Metadata management with [`react-helmet-async`](https://github.com/staylor/react-helmet-async).
- Redux state management with [`redux-toolkit`](https://github.com/reduxjs/redux-toolkit) with types.
- Integrated with [`ruse-fetch`](https://github.com/GlueDigital/ruse-fetch) to provide a modern way of fetching data with `Suspense`.
- Use [`SWC`](https://github.com/swc-project/swc) for better performance.
- Hot Reload in Server and Client, including .env file.

## Project Structure

You can use the pre-built templates, such as the TypeScript template, or create your own to match your preferences. Below are the main folders defined in the default template:

- `src/locales`: Store your translations, the first key in `index.ts` is the default language.
- `src/routes`: The index file serves as the root component, where you can define your application routes with `react-router`.
- `src/static`: Contains static assets like images, fonts, etc. These files will be copied to the build.
- `src/store`: In `reducers.ts`, you need to add your slices to reducersList and place your slices inside the `slices` folder.
- `src/styles`: The main entry point for styles.

These are the default folders, but you can create additional ones such as components, hooks, contexts, and more. Additionally, the tsconfig file includes predefined aliases, which you can customize or extend as needed.

## Plugins

This documentation describes the configuration of the following universal pre-installed plugins in a project:

### [`universal-plugin-helmet`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-plugins/universal-plugin-helmet)

This plugin introduces configuration for [`react-helmet-async`](https://github.com/staylor/react-helmet-async), enabling efficient metadata management in React applications.

#### Features:

    - Enables full functionality of react-helmet-async.
    - Allows dynamic <head> management in a React application.
    - Improves SEO optimization and accessibility.

### [`universal-plugin-jest`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-plugins/universal-plugin-jest)

This plugin configures [`Jest`](https://github.com/jestjs/jest), to run your test suites.

#### Features:

    - Configures Jest for unit and integration testing.
    - Use SWC for better performance.

### Custom Plugins

In addition to the pre-installed plugins, you can create your own plugins or use other existing ones, such as the [`universal-plugin-sass`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-plugins/universal-plugin-sass) for Sass support.

If you want to use for example [`universal-plugin-sass`](https://github.com/GlueDigital/universal-scripts/tree/master/universal-plugins/universal-plugin-sass) you just have to install this as a dependency. And universal will recognize them without any configuration.

```bash
yarn add universal-plugin-sass
```

## Data Fetching

Universal is already configured to use [`ruse-fetch`](https://github.com/GlueDigital/ruse-fetch), where is to simple to fetch data.

```typescript
import { useFetch } from 'ruse-fetch'

const Users = () => {
  const users = useFetch('https://reqres.in/api/users')
  return (
    <ul>
      {users.data.map((u) => (
        <li key={u.id}>u.first_name</li>
      ))}
    </ul>
  )
}

const Home = () => {
  return (
    <section>
      ...
      <Suspense fallback={<span>Loading...</span>}>
        <Users>
      </Suspense>
      ...
    </section>
  )
}

```

## Integration with Redux Toolkit

To maintain a structured and scalable Redux store in your application, follow this setup.

### Folder Structure

Inside the store directory, use the slices folder where all your Redux slices will be stored. Then, import all slices into the central reducers file.

This ensures that Universal will automatically recognize all slice types and include them in the store, providing full type safety.

### Using useAppSelector

With `useAppSelector`, you can access the fully-typed Redux store, including elements provided by Universal.

#### Example: Language Selector Component

```typescript

import { updateIntl, useAppDispatch, useAppSelector } from 'universal-scripts'
import locales from 'src/locales'

function SelectLanguage() {
  const locale = useAppSelector((state) => state.intl.lang)
  const dispatch = useAppDispatch()

  const changeLang = (event) => {
    const lang = event.target.value
    dispatch(
      updateIntl({
        lang,
        messages: locales[lang]
      })
    )
  }

  return (
    <select value={locale} onChange={changeLang}>
      {Object.keys(locales).map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
```

## Enviroment Variables

Environment variables are declared in the .env file. These variables are not included in the generated build by default, ensuring that sensitive information is not stored in the build. The variables are read during the application startup and are sent from the server to the client. Only variables that start with `PUBLIC_` are passed from the server to the client. If server-side rendering (SSR) is disabled, the variables are still sent to the client in the same way.

If you modify the `.env` file in development, Universal will automatically perform a hot reload with the updated variable values. In production mode, you only need to restart the app to apply the new variables—there’s no need to rebuild the app to see the changes.

## Inner Structure

This section explains how the main folders work in Universal. The core is built around [`js.conf.d`](https://github.com/mancontr/js.conf.d), which allows us to split the configuration into multiple files. This approach makes it possible to create new configurations or even override the built-in ones.

- **`build.conf.d`** – Contains everything related to the Webpack bundling process.
- **`runtime.conf.d`** – Manages configurations related to the runtime of the application, such as redux, render....
- **`lib`** – Provides common functionality and utilities.
- **`scripts`** – Contains scripts defined in the `scripts` section of `package.json`, used for automation and task execution.
- **`server`** – The main entry point for the server, containing all configurations for Express and middleware setup.
- **`client`** – The main entry point for the client-side application.

With this structure configurations in this way, Universal enables modular, maintainable, and customizable setups. 🚀

Check out the [documentation](https://gluedigital.github.io/universal-scripts) to explore all features or follow the [getting started](https://gluedigital.github.io/universal-scripts/getting-started) guide.
