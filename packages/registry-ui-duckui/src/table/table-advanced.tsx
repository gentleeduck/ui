import React from 'react'

export type DuckTableContextType = {}
export const DuckTableContext = React.createContext<DuckTableContextType | null>(null)

export function useDuckTable() {
  const context = React.useContext(DuckTableContext)
  if (!context) {
    throw new Error('useTableProvider must be used within an TableProvider')
  }
  return context
}

export function DuckTable({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <DuckTableContext.Provider value={{}}>
      <div {...props} duck-table="">
        {children}
      </div>
    </DuckTableContext.Provider>
  )
}
