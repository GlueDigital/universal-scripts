import { createSlice } from '@reduxjs/toolkit'

const initialState = { me: {} }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // TODO
  }
})

export const {} = userSlice.actions
export default userSlice.reducer