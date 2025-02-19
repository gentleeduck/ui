import { Table } from '@/registry/default/ui/ShadcnUI/table'
import { DropdownMenuOptionsDataType } from '@/registry/default/ui/dropdown-menu'
import { ScrollArea } from '@/registry/default/ui/scroll-area'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import React from 'react'
import { Button, LabelType } from '../button'
import { sortArray } from './table.lib'

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced` context.
// ------------------------------------------------------------------------------------------------

export interface DuckTableProviderProps<TColumnName extends string[]>
  extends React.HTMLAttributes<HTMLDivElement> {
  table_columns: readonly TableColumnType[]
  table_rows: TableContentDataType<TColumnName>[]
}

export type DuckTableContextType<TColumnName extends string[]> = {
  table_columns: readonly TableColumnType[]
  table_rows: TableContentDataType<TColumnName>[]
  search: TableSearchStateType
  setSearch: React.Dispatch<React.SetStateAction<TableSearchStateType>>
  sortBy: Set<TableSortByStateType<TColumnName>>
  setSortBy: React.Dispatch<
    React.SetStateAction<Set<TableSortByStateType<TColumnName>>>
  >
}

export type TableSortByStateType<TColumnName extends string[]> = {
  label: TColumnName[number]
  type: 'asc' | 'desc' | 'not sorted'
}

export interface TableSearchStateType {
  query: string
  queryBy: string[]
}

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced` Components.
// ------------------------------------------------------------------------------------------------

export interface DuckTableProps
  extends React.ComponentPropsWithoutRef<typeof Table> {
  wrapper?: React.ComponentPropsWithoutRef<typeof ScrollArea>
}

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced, hence i use them to get the types.
// ------------------------------------------------------------------------------------------------

/**
 * Extracts the `label` property from an array of `TableColumnType` objects
 * and returns a tuple of string literals representing the column labels.
 *
 * ### Type Safety Guidelines:
 * 1. Ensure the `columns` array is defined as `const` to preserve type inference.
 * 2. Use `readonly TableColumnType[]` to enforce immutability and proper inference.
 *
 * #### Inferring Labels as a Union
 * - Append `[number]` to the type to extract a union of possible labels.
 * ```ts
 * type ColumnLabel = GetColumnLabel<typeof columns>[number]; // 'Name' | 'Age' | 'Email'
 * ```
 *
 * #### Defining Columns and Extracting Labels
 * ```ts
 * // Define columns as a strongly typed readonly array
 * const columns = [
 *   { label: "Name" },
 *   { label: "Age" },
 *   { label: "Email" }
 * ] as const satisfies readonly TableColumnType[];
 *
 * // Extract column labels as a tuple of string literals
 * type ColumnLabels = GetColumnLabel<typeof columns>; // ['Name', 'Age', 'Email']
 * ```
 */
export type GetColumnLabel<TColumn extends readonly TableColumnType[]> = {
  -readonly [K in keyof TColumn]: `${TColumn[K]['label']}`
}

/**
 * Defines the column type for a table based on a dynamic set of column names.
 *
 * ### Type Safety Guidelines:
 * 1. Define the columns array as `const` to infer the most precise type.
 * 2. Ensure the type satisfies `readonly string[]` to preserve strict type checking.
 *
 * #### Inferring Column Names as a Union
 * - Append `[number]` to the type to infer a union of possible column names.
 * ```ts
 * type ColumnName = TColumnName[number]; // Infers as a union of column names
 * ```
 *
 * #### Defining Columns and Extracting Names
 * ```ts
 * // Define column names as a strongly typed readonly array
 * const columnNames = ['name', 'age', 'email'] as const;
 *
 * // Extract column names as a union type
 * type ColumnName = typeof columnNames[number]; // 'name' | 'age' | 'email'
 * ```
 *
 * #### Example Usage
 * ```ts
 * type MyTableColumns = TableContentDataType<typeof columnNames>;
 *
 * const columns: MyTableColumns = {
 *   name: { label: "Full Name", children: "firstName", icon: { name: "user" } },
 *   age: { label: "Age", icon: { name: "calendar" } },
 *   email: { label: "Email Address" }
 * };
 * ```
 */
export type TableContentDataType<TColumnName extends readonly string[]> = {
  [key in TColumnName[number]]: TableColumnType & {
    children?: TColumnName[number]
    icon?: IconProps
  }
}

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced, constants.
// ------------------------------------------------------------------------------------------------

export type TableColumnSortableType = React.ComponentPropsWithoutRef<
  typeof Button
> & { children: 'asc' | 'desc' | 'not sorted' }

// ------------------------------------------------------------------------------------------------

export interface TableColumnType<TSort extends boolean = true>
  extends Partial<React.HTMLProps<HTMLTableCellElement>> {
  label: string
  sortable?: boolean
  showLabel?: boolean
  currentSort?: TSort extends true ? 'asc' | 'desc' | 'not sorted' : never
}

export interface TableDropdownMenuOptionsType<T extends boolean> {
  sortArray: typeof sortArray
  setHeaders: React.Dispatch<React.SetStateAction<TableColumnType[]>>
  headers: TableColumnType[]
  tableData: TableContentDataType<T>[]
  setTableData: React.Dispatch<React.SetStateAction<TableContentDataType<T>[]>>
  data: TableContentDataType<T>[]
  idx: number
  column: TableColumnType
}

export interface TableColumnType extends React.HTMLProps<HTMLTableCellElement> {
  // TODO: bro what the fuck is this, the old code looks bloated af.
  // FIX: make sure to sue these in the feture
  withLabel?: Omit<LabelType, 'showCommand' | 'showLabel'>
  withIcon?: React.ReactNode
}
// ------------------------------------------------------------------------------------------------
//NOTE: not used yet.
export type TableDataFilteredType<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export interface TablePaginationStateType {
  pageSize: number
  pageIndex: number
}

export interface TableSelectionStateType {
  rowSelected: Record<string, unknown>[]
}

export type ColumnsViewedStateType<T extends Record<string, unknown>> =
  TableColumnType<T> | null

export type OrderStateType = {
  orderBy: string
  orderDir: 'asc' | 'desc'
}
