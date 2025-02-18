import React from 'react'
import { TableDataKey, TableHeaderType } from './table.types'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import { TableDataType } from '@/registry/default/example/TableAdvancedDemo'

const columns: TableHeaderType[] = [
  {
    label: 'label',
    className: 'w-[130px]',
    sortable: false,
  },
  {
    label: 'title',
    className: 'w-[300px]',
    sortable: true,
    showLabel: false,
  },
  {
    label: 'label',
    className: 'w-[140px]',
    sortable: true,
    currentSort: 'not sorted',
  },
  {
    label: 'status',
    sortable: true,
    // showLabel: true,
    className: 'w-[145px]',
  },
  {
    label: 'priority',
    className: 'w-[170px]',
    sortable: true,
  },
] as const

export type DuckTableContextType<TRow extends Record<string, unknown>> = {
  table_data: TRow[]
  search: TableSearchStateType
  setSearch: React.Dispatch<React.SetStateAction<TableSearchStateType>>
  // pagination: TablePaginationStateType
  // setPagination: React.Dispatch<React.SetStateAction<TablePaginationStateType>>
  // selection: TableSelectionStateType
  // setSelection: React.Dispatch<React.SetStateAction<TableSelectionStateType>>
  // columnsViewed: ColumnsViewedStateType<Column>[] | undefined
  // setColumnsViewed:
  //   | React.Dispatch<React.SetStateAction<ColumnsViewedStateType<Column>[]>>
  //   | undefined
  // order: OrderStateType[]
  // setOrder: React.Dispatch<React.SetStateAction<OrderStateType[]>>
}

export type TableContentDataType<TKey extends Record<string, unknown>> = {
  [key in keyof TKey]: { children?: TKey[key]; icon?: IconProps }
}

export type TableDataFilteredType<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

type O<T extends { label: string }[]> = {
  [K in keyof T]: T[K]['label']
}

type H = O<typeof columns>
const hi: H = {}

const hi: DuckTableContextType<
  TableContentDataType<typeof columns>
>['table_data'] = []

export const DuckTableContext =
  React.createContext<DuckTableContextType<any> | null>(null)

export interface DuckTableProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {}
export interface TablePaginationStateType {
  pageSize: number
  pageIndex: number
}

export interface TableSelectionStateType {
  rowSelected: Record<string, unknown>[]
}

export interface TableSearchStateType {
  query: string
  queryBy: string[]
}
export type ColumnsViewedStateType<T extends Record<string, unknown>> =
  TableHeaderType<T> | null

export type OrderStateType = {
  orderBy: string
  orderDir: 'asc' | 'desc'
}
