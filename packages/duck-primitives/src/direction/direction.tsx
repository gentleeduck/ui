import * as React from 'react'

type Direction = 'ltr' | 'rtl'

const DIRECTION_DICTIONARY = {
  ltr: 'ltr',
  rtl: 'rtl',
} as const

const DirectionContext = React.createContext<Direction | undefined>(undefined)

interface IDirectionProviderProps {
  children?: React.ReactNode
  dir: Direction
}

const DirectionProvider: React.FC<IDirectionProviderProps> = (props) => {
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

function useDirection(localDir?: Direction): Direction {
  const globalDir = React.useContext(DirectionContext)
  return localDir || globalDir || 'ltr'
}

const Provider = DirectionProvider

export type { Direction, IDirectionProviderProps }
export { DIRECTION_DICTIONARY, DirectionContext, DirectionProvider, Provider, useDirection }
