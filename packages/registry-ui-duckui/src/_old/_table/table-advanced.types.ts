// @ts-noCheck

import React from 'react'
import { Button, LabelType } from '../button'
import { ScrollArea } from '../scroll-area'
import { Table, TableBody } from './table'
import { sortArray } from './table.lib'

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced` context.
// ------------------------------------------------------------------------------------------------

export interface DuckTableProviderProps<TColumnName extends string[]> extends React.HTMLAttributes<HTMLDivElement> {
  table_columns: readonly TableColumnType[]
  table_rows: TableContentDataType<TColumnName>[]
}

export type DuckTableContextType<TColumnName extends string[]> = {
  tableColumns: Map<string, TableColumnType>
  setTableColumns: React.Dispatch<React.SetStateAction<Map<string, TableColumnType>>>
  tableRows: TableContentDataType<TColumnName>[]
  selectedRows: Set<TableContentDataType<TColumnName>>
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<TableContentDataType<TColumnName>>>>
  search: TableSearchStateType
  setSearch: React.Dispatch<React.SetStateAction<TableSearchStateType>>
}

export type TableSortByStateType<TColumnName extends string[]> = {
  label: TColumnName[number]
  type: React.HTMLProps<HTMLDivElement>['aria-sort']
}

export interface TableSearchStateType {
  query: string
  queryBy: string[]
}

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced` Components.
// ------------------------------------------------------------------------------------------------

/**
 * Interface for the `DuckTable` component
 */
export interface DuckTableProps extends React.ComponentPropsWithoutRef<typeof Table> {
  wrapper?: React.ComponentPropsWithoutRef<typeof ScrollArea>
}

/**
 * Interface for the `DuckTableHeader` component
 */
export interface DuckTableHeaderProps {}

/**
 * Interface for the `DuckTableHeadCheckbox` component
 */
export interface DuckTableHeadCheckboxProps extends React.HTMLProps<HTMLDivElement> {}

/**
 * Interface for the `DuckTableRowCheckbox` component
 */
export interface DuckTableRowCheckboxProps<TColumnName extends readonly TableColumnType[]>
  extends React.HTMLProps<HTMLDivElement> {
  tableRow: TableContentDataType<GetColumnLabel<TColumnName>>
}

/**
 * Interface for the `DuckTableHeadSelectable` component
 */
export interface DuckTableHeadSelectableProps<TSort extends boolean = true> extends React.HTMLProps<HTMLDivElement> {
  column: TableColumnType<TSort>
  label: string
  showLabel?: boolean | undefined
}

/**
 * Interface for the `DuckTableBody` component
 */
export interface DuckTableBodyProps extends React.ComponentPropsWithoutRef<typeof TableBody> {}

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
    icon?: React.ReactNode
  }
}

/**
 * **Utility Type: Mutable**
 * Converts all properties of a type `T` from readonly to mutable.
 *
 * @template T - The type to make mutable.
 *
 * @example
 * ```ts
 * type ReadonlyUser = { readonly name: string; readonly age: number };
 * type MutableUser = Mutable<ReadonlyUser>;
 * // Result:
 * // {
 * //   name: string;
 * //   age: number;
 * // }
 * ```
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
} & {}

/**
 * **Utility Type: Immutable**
 * Converts all properties of a type `T` from mutable to readonly.
 *
 * @template T - The type to make immutable.
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type ReadonlyUser = Immutable<User>;
 * // Result:
 * // {
 * //   readonly name: string;
 * //   readonly age: number;
 * // }
 * ```
 */
export type Immutable<T> = {
  readonly [K in keyof T]: T[K]
} & {}

/**
 * **Utility Type: Mapped**
 * A type that directly maps all keys of a given type `T` to themselves.
 *
 * @template T - The type to map.
 *
 * @example
 * ```ts
 * type User = { name: string; age: number };
 * type MappedUser = Mapped<User>;
 * // Result (Same as User):
 * // {
 * //   name: string;
 * //   age: number;
 * // }
 * ```
 */
export type Mapped<T> = {
  [K in keyof T]: T[K]
} & {}

// ------------------------------------------------------------------------------------------------
// NOTE:  These types are used for the `table-advanced, constants.
// ------------------------------------------------------------------------------------------------

export type TableColumnSortableType = React.ComponentPropsWithoutRef<typeof Button> & {
  children: React.HTMLProps<HTMLDivElement>['aria-sort']
}

// ------------------------------------------------------------------------------------------------

export interface TableColumnType<TSort extends boolean = true> extends Partial<React.HTMLProps<HTMLTableCellElement>> {
  label: string
  sortable?: boolean
  showLabel?: boolean
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

export type ColumnsViewedStateType<T extends Record<string, unknown>> = TableColumnType<T> | null

export type OrderStateType = {
  orderBy: string
  orderDir: 'asc' | 'desc'
}
