import { useDispatch, useSelector } from 'react-redux'
const fetch = __CLIENT__ ? window.fetch : require('node-fetch').default

export const useFetch = (key, url, opts) => {
  const dispatch = useDispatch()
  const value = useSelector(s => s.useFetch[key])
  if (!value) {
    // First time; start fetching!
    console.log('Starting a promise!')
    const fetchPromise = fetch(url, opts)
    dispatch({ type: 'useFetch/loading', key, promise: fetchPromise })
    fetchPromise
      .then(res =>
        res.json()
          .then(value => dispatch({ type: 'useFetch/success', key, value }))
      )
      .catch(error => dispatch({ type: 'useFetch/error', key, error }))
    throw fetchPromise
  } else if (value.isLoading) {
    throw value.promise
  } else if (value.isError) {
    throw value.error
  } else if (value.isSuccess) {
    return value.value
  }
}
