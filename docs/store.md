Redux Store
-----------

Your project is preconfigured with a Redux store, available both at the server and the client.


### Reducers

The store has a [combineReducers](https://redux.js.org/api/combinereducers/) as the root reducer, and you can add your reducers to it by exporting an object from `src/store/reducers.js`.

In addittion to your reducers, there are a few already preconfigured:

- `intl`: Your locale settings, managed by [react-intl-redux](https://www.npmjs.com/package/react-intl-redux)
- `useFetch`: The request cache for [ruse-fetch](https://www.npmjs.com/package/ruse-fetch)
- `req`: (server only) Info about the request being rendered, such as the source ip or headers

You can override them by creating a key with the same name, but things can fail if you break their contract.


### Middlewares

If you need to add any extra Redux middlewares to the store, you can create `src/store/middlewares.js` and export an array of middlewares to configure them. The [thunk](https://github.com/reduxjs/redux-thunk) middleware will be added automatically.


### Actions

There are some actions that get dispatched during various stages of the render process, which can be used on your reducers:

- `REQUEST_INIT`: Dispatched before starting rendering. Contains info about the request being rendered.
- `CLEANUP`: Dispatched after render, but before serializing the store. Allows cleaning up any info that should not be serialized and sent to the client.

You can import their action types like this:

```javascript
import { CLEANUP } from 'universal-scripts'
```


Next steps
----------

Now that you know how the store works, you can learn more about the [build system](build-system).
