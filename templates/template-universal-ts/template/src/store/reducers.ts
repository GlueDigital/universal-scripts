import user from './slices/user'

export const reducerList = {
  // Add your reducers here
  user
}

export type ReducerType = {
  [Key in keyof typeof reducerList]: ReturnType<(typeof reducerList)[Key]>
}


export default reducerList
