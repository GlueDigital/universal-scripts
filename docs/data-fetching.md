Data fetching
-------------

Loading external data, such as from an external API, is one of the most basic needs that has to be adapted for universal apps. Universal Scripts implements a simple solution based on Promises, designed to work with Redux actions.

To get started, add a static `fetchData` method to any component:

```javascript
export class Home extends React.Component {
  static fetchData = () => {
    // Your code here
  }
}
```

From this function you can do any async process, including calling external endpoints with `fetch`, and return a promise or a [thunk](https://github.com/gaearon/redux-thunk).

When rendering the page on the server, all fetchData functions will be called, and it will wait until all promises get resolved. After the results are available, and the store got updated with any thunk's actions, the render will begin.

On the client it works exactly the same, except that on the first load no fetchData is called, as they got called already from the server.


Example
-------

This example calls an API using fetch, saves the results to the store, and uses them on a component.

On your component (eg. `src/routes/Home/Home.js`)
```jsx
import React from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from 'src/store/actions/user'

export class Home extends React.Component {
  static fetchData = () => {
    return getUserInfo()
  }

  render = () => (
    <div>Hello, {this.props.user.name}.</div>
  )
}

// For the sake of brevity, we'll add the Redux wrapper here directly.
const mapStateToProps = (state) => ({ user: state.user })
const HomeContainer = connect(mapStateToProps)(Home)
export default HomeContainer
```

On your action (`src/store/actions/user.js`):
```javascript
const GET_USER_INFO = 'GET_USER_INFO'

export const getUserInfo = () => async (dispatch) {
  const response = await fetch('/api/getUserInfo')
  const result = await response.json()
  dispatch({
    type: GET_USER_INFO,
    payload: result
  })
}
```

On your reducer (`src/store/reducers/user.js`):
```javascript
import { GET_USER_INFO } from '../actions/user'

export default (state = {}, action) => {
  if (action.type === GET_USER_INFO) return action.payload
  return state
}
```

Error handling
--------------

If a `fetchData` method throws an error, we abort rendering and show a server error page. On DEV mode, this page will contain the error details, while in PROD mode it will show a generic error message.

To customize this behaviour, you can:
 - Catch the error in your `fetchData` method, if you want to render the route anyway
 - Define a `error500` key on your router file, with the path to a static HTML error page, and it will be served instead of the generic error.
    Example:
    ```javascript
    export const error500 = 'src/static/assets/error500.htm'
    ```



Cookies and redirects
---------------------

Sometimes you need to set a cookie or do a redirect depending on the result of a `fetchData` call on the server, for example when performing authentication. To implement this, the server will analyse the value the promise resolves to, and if it is an object, will look for a `__serverDirectives` key, which is another object that can contain:
 - A `cookies` array, containing objects for each cookie to create, with fields: name, value, and any other options that [ctx.cookies](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxcookiessetname-value-options) can handle.
 - A `redirect` string, with the destination of a redirection.
 - A `status` number, with the desired HTTP status for this request.


Accessing server request
------------------------

On the server side, sometimes you need access to the request headers, or the source ip. To make them available to your code, we dispatch a `REQUEST_INIT` action at the beginning of each request, and a reducer adds them on the store under the `req` key. Before sending the store to the client, we remove this key to reduce page size, as this info isn't usually useful on the client.

If you need access to this info in the client, or want to set some other reducer values depending on the request info, you can use that action on your reducers too.


Store cleanup
-------------

Just before serializing the store on the server to send it to the client, we dispatch the `CLEANUP` action, to give reducers an opportunity to cleanup any values that you don't want to send to the client. This feature is used by the intl reducer to prevent sending the messages in the store, and by the request reducer to remove the request info.

To use this action on your reducers, just do something like:
```javascript
import { CLEANUP } from 'universal-scripts'

const myReducer = (store, action) => {
  switch (action.type) {
    case CLEANUP:
      return null // Your cleaned up value here
    // Other actions handling
    default:
      return state
  }
}
```


Middlewares
-----------

If you need to add any extra Redux middlewares to the store, you can create `src/store/middlewares.js` and export an array of middlewares to configure them. The thunk middleware will be added automatically.

If you need to add a middleware to React Router at the client (like the scroll middleware), just export a `routerMiddlewares` array from the routes index, and they will be loaded.


Next steps
----------

Now that you can easily do API calls, you might want to [add an API server](api-server) to your project.
