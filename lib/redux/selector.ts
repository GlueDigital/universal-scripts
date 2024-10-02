import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { ServerRootState, ClientRootState } from './types'

export const useServerSelector: TypedUseSelectorHook<ServerRootState> = useSelector
export const useClientSelector: TypedUseSelectorHook<ClientRootState> = useSelector