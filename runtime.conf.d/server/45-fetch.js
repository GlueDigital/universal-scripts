// Make fetch globally available (ie: polyfill) for easy use
import fetch from 'node-fetch'

if (!global.fetch) {
  global.fetch = fetch
  global.Response = fetch.Response
  global.Headers = fetch.Headers
  global.Request = fetch.Request
}
