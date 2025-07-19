import React from 'react'
import { createStore } from './store'

/**
 * A global singleton fallback store used when no Provider wraps your app.
 */
let defaultStore: ReturnType<typeof createStore> | undefined

/**
 * React Context to supply a local store instance.
 */
const StoreContext = React.createContext<ReturnType<typeof createStore> | undefined>(undefined)

/**
 * Hook to retrieve the current store. Priority: options.store > context > global singleton.
 */
export function useStore(options?: { store?: ReturnType<typeof createStore> }) {
  const contextStore = React.useContext(StoreContext)
  if (options?.store) return options.store
  if (contextStore) return contextStore
  if (!defaultStore) defaultStore = createStore()
  return defaultStore
}

/**
 * Provider component to inject a local store into React tree.
 */
export function Provider({ children, store }: { children: React.ReactNode; store?: ReturnType<typeof createStore> }) {
  const storeRef = React.useRef<ReturnType<typeof createStore>>(store)
  if (!storeRef.current) storeRef.current = store || createStore()

  return React.createElement(
    StoreContext.Provider,
    {
      value: store || storeRef.current,
    },
    children,
  )
}
