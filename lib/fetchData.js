/**
 * Utils to deal with static fetchData methods on universal react apps.
 *
 * On isomorphic/universal react apps, routes might need to fetch data from
 * external services both on the client and the server, depending on where
 * they are rendering. Having routable components expose a static fetchData
 * method is a simple way of implementing this.
 *
 * This implementation provides some helpers to call the fetchData methods.
 * Those methods have the following signature:
 *   static fetchData(props, dispatch, state) { ... }
 * Where:
 *   - props: The component props
 *   - dispatch: The store dispatch function
 *   - state: Ther store current state
 * The return value can be either:
 *   - A thunk: a function that takes the dispatch func and returns a promise
 *   - A promise
 *   - A value (including undefined)
 *
 * On the server side, the page won't be sent to the client until all the
 * promises get resolved.
 */

/**
 * Return an array with the required fetchData promises for any router props.
 */
const getPromises = (props, store) => {
  const requiredPromises = []
  props.routes.forEach((route, idx) => {
    let comp = route.component
    while (comp.WrappedComponent) comp = comp.WrappedComponent
    if (comp.fetchData) {
      let result = comp.fetchData(props, store.dispatch, store.getState())
      if (typeof result === 'function') {
        result = result(store.dispatch)
      }
      requiredPromises.push(Promise.resolve(result))
    }
  })
  return requiredPromises
}

let isFirstRender = true

/**
 * Client-side fetchData implementation as a react-router middleware.
 * Triggers on route change, except for the first loaded route,
 * which was already loaded at server side.
 * Calls the methods, but doesn't wait for any promise.
 */
export const fetchMiddleware = (store) => ({
  renderRouterContext: (child, props) => {
    if (isFirstRender) {
      isFirstRender = false
      return child
    }
    // Check if children have any pending fetchData
    getPromises(props, store)
    return child
  }
})

/**
 * Server-side fetchData implementation.
 * In adittion to waiting on the promises, we gather all results and those which
 * are objects get merged on a single object via Object.assign. This allows some
 * communication back to the router middleware, so they can trigger secondary
 * effects (setting cookies, redirections, etc).
 */
export const waitForPromises = (props, store) => {
  const requiredPromises = getPromises(props, store)
  return Promise.all(requiredPromises)
    .then((values) => {
      const ret = {}
      values.forEach((value) => {
        if (typeof value === 'object') Object.assign(ret, value)
      })
      return ret
    })
}
