## Data fetching

Loading external data is one of the most basic needs that has to be adapted for universal apps. Universal Scripts is integrated with [ruse-fetch](https://www.npmjs.com/package/ruse-fetch), which provides a modern way of fetching data, making use of fetch and Suspense.

Everything is already configured, so you can use it just like this:

```javascript
import React from 'react'
import { useFetch } from 'ruse-fetch'

const Home = () => {
  const res = useFetch('https://reqres.in/api/users')
  return (
    <ul>
      {res.data.map((u) => (
        <li key={u.id}>u.first_name</li>
      ))}
    </ul>
  )
}
```

To handle the loading state, use `<Suspense>`, and to handle API errors, you can use a error boundary.

When rendering the page on the server, it will wait for all useFetch hooks, rendering the page with them already resolved. The responses will be sent to the client, so it doesn't have to repeat them on initial render. Any subsequent calls (eg. after clicking a Link) will be performed on the client.

You can learn more about the library on their [page](https://www.npmjs.com/package/ruse-fetch).

## Next steps

Now that you can easily do API calls, you might want to learn more about the [store](store).
