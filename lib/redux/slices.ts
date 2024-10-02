import { createSlice } from '@reduxjs/toolkit'
import { cleanup } from './actions'
import { IncomingHttpHeaders } from 'node:http'

interface ReqState {
  headers: IncomingHttpHeaders
  origin: string
  path: string
  ip: string
  cookies: Record<string, string>
}

const initialReqState: ReqState = null

const requestSlice = createSlice({
  name: 'request',
  initialState: initialReqState,
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

interface IntlState {
  lang: string
  messages: Record<string, string>
}

const initialIntlState: IntlState = {
  lang: 'en',
  messages: {}
}

const intlSlice = createSlice({
  name: 'intl',
  initialState: initialIntlState,
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