import { ReactNode } from 'react'
import { createClientStore, createServerStore } from './store'
import { HelmetServerState } from 'react-helmet-async'

export type ServerRootState = ReturnType<ReturnType<typeof createServerStore>['getState']>
export type ClientRootState = ReturnType<ReturnType<typeof createClientStore>['getState']>
export type AppDispatch = ReturnType<typeof createServerStore>['dispatch']
export type ServerStore = ReturnType<typeof createServerStore>
export type ClientStore = ReturnType<typeof createClientStore>

interface Context {
  helmetContext: {
    helmet: HelmetServerState
  }
  store: ClientStore
  triggerHook: (name: string) => (ctx: Context, initial: boolean) => ReactNode
}

export type ClientInit = (ctx: Context, next: () => ReactNode) => ReactNode | Promise<void>
export type ClientRoot = (ctx: Context, next: () => Promise<ReactNode>) => Promise<ReactNode> | ReactNode