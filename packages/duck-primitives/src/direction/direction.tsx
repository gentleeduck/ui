import * as React from 'react'
import type { IDirection } from './direction.types'

const DIRECTION_DICTIONARY = {
  ltr: 'ltr',
  rtl: 'rtl',
} as const

const DirectionContext = React.createContext<IDirection.Kind | undefined>(undefined)

const DirectionProvider: React.FC<IDirection.IProviderProps> = (props) => {
  const { dir, children } = props
  return (
    <DirectionContext.Provider value={dir}>
      <div
        dir={dir}
        style={{
          direction: dir,
        }}>
        {children}
      </div>
    </DirectionContext.Provider>
  )
}

function useDirection(localDir?: IDirection.Kind): IDirection.Kind {
  const globalDir = React.useContext(DirectionContext)
  return localDir || globalDir || 'ltr'
}

const Provider = DirectionProvider

export { DIRECTION_DICTIONARY, DirectionContext, DirectionProvider, Provider, useDirection }
