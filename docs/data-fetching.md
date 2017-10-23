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

Cookies and redirects
---------------------

Sometimes you need to set a cookie or do a redirect depending on the result of a `fetchData` call on the server, for example when performing authentication. To implement this, the server will analyse the value the promise resolves to, and if it is an object, will look for a `__serverDirectives` key, which is another object that can contain:
 - A `cookies` array, containing objects for each cookie to create, with fields: name, value, and any other options that [ctx.cookies](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxcookiessetname-value-options) can handle.
 - A `redirect` string, with the destination of a redirection.


Next steps
----------

Now that you can easily do API calls, you might want to [add an API server](api-server) to your project.
