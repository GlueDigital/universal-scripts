import { createSlice } from '@reduxjs/toolkit'
import { cleanup, updateIntl } from './actions'

const requestSlice = createSlice({
  name: 'request',
  initialState: null,
  reducers: {
    requestInit:  (state, action) => {
      state.req = action.payload
    }
  },
  extraReducers: {
    [cleanup]: (state) => {
      state.req = null
    }
  }
})

export const { requestInit } = requestSlice.actions
export const requestReducer = requestSlice.reducer

const intlSlice = createSlice({
  name: 'intl',
  initialState: undefined,
  reducers: {
    updateIntl: (state, action) => {
      const { lang, messages } = action.payload
      state.intl.locale = lang
      state.intl.messages = messages
      },
  },
  extraReducers: (builder) => {
    builder.addCase(cleanup, (state) => {
      state.intl.locale = state.locale
    })
    builder.addDefaultCase(state => {
      state.intl = state.itnl || { locale: 'en', messages: {} }
    })
  }
})

export const { updateIntl } = intlSlice.actions
export const intlReducer = intlSlice.reducer