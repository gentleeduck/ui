import React from 'react'
import { TableContext } from './table'
import { type TableContextType } from './table.type'

export const useTable = (): TableContextType | null => {
  const context = React.useContext(TableContext)
  if (!context) {
    throw new Error('useTableProvider must be used within an TableProvider')
  }
  return context
}
