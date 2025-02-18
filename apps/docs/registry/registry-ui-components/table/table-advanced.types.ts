import React from 'react'
import { ScrollArea } from '@/registry/default/ui/scroll-area'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import { TableHeaderType } from './table.types'
import { Table } from '@/registry/default/ui/ShadcnUI/table'

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced` context.
// ------------------------------------------------------------------------------------------------

export interface DuckTableProviderProps<TColumnName extends string[]>
  extends React.HTMLAttributes<HTMLDivElement> {
  table_columns: readonly TableHeaderType[]
  table_rows: TableContentDataType<TColumnName>[]
}

export type DuckTableContextType<TColumnName extends string[]> = {
  table_columns: readonly TableHeaderType[]
  table_rows: TableContentDataType<TColumnName>[]
  search: TableSearchStateType
  setSearch: React.Dispatch<React.SetStateAction<TableSearchStateType>>
}

export interface TableSearchStateType {
  query: string
  queryBy: string[]
}

export interface DuckTableProps
  extends React.ComponentPropsWithoutRef<typeof Table> {
  wrapper?: React.ComponentPropsWithoutRef<typeof ScrollArea>
}

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced` context, hence i use them to get the types.
// ------------------------------------------------------------------------------------------------

/**
 * Defines the column type for a table.
 *
 * ### Type Safety Guidelines:
 * 1. Define the columns array as `const` to infer the most precise type.
 * 2. Ensure the type satisfies `readonly TableColumnType[]` for full type safety.
 *
 * #### Inferring Type as a Union
 * - Append `[number]` to the type to infer a union of possible labels.
 * ```ts
 * const label: GetColumnLabel<typeof columns>[number] = 'label'; // or any other column label
 * ```
 *
 * #### Defining Columns and Extracting Labels
 * ```ts
 * // Define columns as a strongly typed readonly array
 * const columns = [...] as const as readonly TableColumnType[];
 * const label: GetColumnLabel<typeof columns> = ['label', 'title', 'status', 'priority'];
 * ```
 */
export type GetColumnLabel<TColumn extends readonly TableHeaderType[]> = {
  -readonly [K in keyof TColumn]: `${TColumn[K]['label']}`
}
export type TableContentDataType<TColumnName extends string[]> = {
  [key in keyof TColumnName]: TableDataKey & {
    children?: TColumnName[number]
    icon?: IconProps
  }
}

// ------------------------------------------------------------------------------------------------
//NOTE: not used yet.
export type TableDataFilteredType<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export interface TableDataKey extends React.HTMLProps<HTMLTableCellElement> {
  // TODO: bro what the fuck is this, the old code looks bloated af.
  // FIX: make sure to sue these in the feture
  // withLabel?: Omit<LabelType, 'showCommand' | 'showLabel'>
  // withIcon?: React.ReactNode
}
export const DuckTableContext =
  React.createContext<DuckTableContextType<any> | null>(null)

export interface TablePaginationStateType {
  pageSize: number
  pageIndex: number
}

export interface TableSelectionStateType {
  rowSelected: Record<string, unknown>[]
}

export type ColumnsViewedStateType<T extends Record<string, unknown>> =
  TableHeaderType<T> | null

export type OrderStateType = {
  orderBy: string
  orderDir: 'asc' | 'desc'
}
