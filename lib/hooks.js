import { useDispatch, useSelector } from 'react-redux'
const fetch = __CLIENT__ ? window.fetch : require('node-fetch').default

export const useFetch = (key, url, opts) => {
  const dispatch = useDispatch()
  const value = useSelector(s => s.useFetch[key])
  if (!value) {
    // First time; start fetching!
    const fetchPromise = fetch(url, opts)
      .then(res => res.json()
        .then(value => {
          dispatch({ type: 'useFetch/success', key, value })
        })
      )
      .catch(error => {
        dispatch({ type: 'useFetch/error', key, error })
      })

    dispatch({ type: 'useFetch/loading', key, promise: fetchPromise })
    throw fetchPromise
  } else if (value.isLoading) {
    throw value.promise
  } else if (value.isError) {
    throw value.error
  } else if (value.isSuccess) {
    return value.value
  }
}
