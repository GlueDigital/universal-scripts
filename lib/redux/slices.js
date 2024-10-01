import { createSlice } from '@reduxjs/toolkit'
import { cleanup } from './actions'

const requestSlice = createSlice({
  name: 'request',
  initialState: null,
  reducers: {
    requestInit(state, action) {
      return action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(cleanup, (state) => {
      return null
    })
  }
})

export const { requestInit } = requestSlice.actions
export const requestReducer = requestSlice.reducer

const intlSlice = createSlice({
  name: 'intl',
  initialState: {},
  reducers: {
    updateIntl(state, action) {
      return action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(cleanup, (state) => {
      state.lang = state.lang
    })
    builder.addDefaultCase(state => {
      return state || { lang: 'en', messages: {} }
    })
  }
})

export const { updateIntl } = intlSlice.actions
export const intlReducer = intlSlice.reducer