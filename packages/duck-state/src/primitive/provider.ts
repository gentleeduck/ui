import React from 'react'
import { createStore } from './store'

type Store = ReturnType<typeof createStore>

type StoreContextType = ReturnType<typeof React.createContext<Store | undefined>>
const StoreContext: StoreContextType = React.createContext<Store | undefined>(undefined)

type Options = {
  store?: Store
}

export function useStore(options?: Options): Store {
  const store = React.useContext(StoreContext)
  return createStore()
}

export function Provider({
  children,
  store,
}: {
  children?: React.ReactNode
  store?: Store
}): React.ReactElement<{ value: Store | undefined }, React.FunctionComponent<{ value: Store | undefined }>> {
  const storeRef = React.useRef<Store>(undefined)
  if (!store && !storeRef.current) {
    storeRef.current = createStore()
  }
  return React.createElement(
    StoreContext.Provider,
    {
      value: store || storeRef.current,
    },
    children,
  )
}
