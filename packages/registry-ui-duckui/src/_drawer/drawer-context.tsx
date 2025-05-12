import React from 'react'

export const NestedDrawerContext = React.createContext({
  activeLevel: 0,
  setActiveLevel: (level: number) => {},
})

export const NestedDrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeLevel, setActiveLevel] = React.useState(0)
  return <NestedDrawerContext.Provider value={{ activeLevel, setActiveLevel }}>{children}</NestedDrawerContext.Provider>
}

export const useNestedDrawerContext = () => React.useContext(NestedDrawerContext)
