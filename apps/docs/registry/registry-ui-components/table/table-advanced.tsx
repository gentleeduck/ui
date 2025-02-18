import React from 'react'
import { cn } from '@/lib'
import {
  ColumnsViewedStateType,
  DuckTableContext,
  DuckTableProviderProps,
  OrderStateType,
  TablePaginationStateType,
  TableSearchStateType,
  TableSelectionStateType,
} from './table-advanced.types'
import { PAGE_INDEX, PAGE_SIZE } from './table.constants'

export const DuckTableProvider = <Column extends Record<string, unknown>>({
  children,
  className,
  ...props
}: DuckTableProviderProps) => {
  const [pagination, setPagination] = React.useState<TablePaginationStateType>({
    pageSize: PAGE_SIZE,
    pageIndex: PAGE_INDEX,
  })

  const [selection, setSelection] = React.useState<TableSelectionStateType>({
    rowSelected: [],
  })

  const [search, setSearch] = React.useState<TableSearchStateType>({
    query: '',
    queryBy: [],
  })

  const [columnsViewed, setColumnsViewed] = React.useState<
    ColumnsViewedStateType<Column> | never[]
  >([])

  // const [order, setOrder] = React.useState<OrderStateType[]>([])

  return (
    <DuckTableContext.Provider
      value={{
        // pagination,
        // setPagination,
        // selection,
        // setSelection,
        search,
        setSearch,
        // columnsViewed: columnsViewed as ColumnsViewedStateType<Column>[],
        // setColumnsViewed: setColumnsViewed as React.Dispatch<
        //   React.SetStateAction<ColumnsViewedStateType<Column>[]>
        // >,
        // order,
        // setOrder,
      }}
    >
      <div className={cn(`w-full flex flex-col gap-4`, className)} {...props}>
        {children}
      </div>
    </DuckTableContext.Provider>
  )
}
 
