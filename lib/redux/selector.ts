import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ServerRootState, ClientRootState, AppDispatch } from './types'

export const useServerSelector: TypedUseSelectorHook<ServerRootState> =
  useSelector

export const useAppSelector: TypedUseSelectorHook<ClientRootState> = useSelector

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
