//@ts-noCheck

import { ComboboxType } from '@/registry/default/ui/combobox'
import { ContextMenuOptionsType } from '@/registry/default/ui/context-menu'
import { DropdownMenuOptionsDataType, DropdownMenuOptionsType } from '@/registry/default/ui/dropdown-menu'
import { ScrollArea } from '@/registry/default/ui/scroll-area'
import { IconType, LabelType } from '../button'
import { TableCell, TableFooter, TablePaginationStateType } from './table'
import { sortArray } from './table.lib'

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
export type Order = 'asc' | 'desc' | 'not sorted'

export interface TableDropdownMenuOptionsType<T extends Record<string, any>, C extends boolean> {
  sortArray: typeof sortArray
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType<T, C>[]>>
  headers: TableHeaderType<T, C>[]
  tableData: TableContentDataType<T>[]
  setTableData: React.Dispatch<React.SetStateAction<TableContentDataType<T>[]>>
  data: TableContentDataType<T>[]
  idx: number
  column: TableHeaderType<T, C>
}

export interface TableHeaderType<C extends boolean = true> extends Partial<React.HTMLProps<HTMLTableCellElement>> {
  label: string
  sortable?: boolean
  showLabel?: boolean
  currentSort?: C extends true ? 'asc' | 'desc' | 'not sorted' : never
  // dropdownMenuOptions?: C extends true
  //   ? DropdownMenuOptionsDataType<TableDropdownMenuOptionsType<T, C>>[]
  //   : never
}

export interface TableHeaderActionsProps<T extends Record<string, unknown>, K extends boolean> {
  header: TableHeaderType<T, K>[]
  headers: TableHeaderType<T, K>[]
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType<T, K>[]>>
}

// TableHeaderOptions
export interface TableHeaderOptionsType<T extends Record<string, any>, C extends boolean> {
  sortArray: typeof sortArray
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType<T, C>[]>>
  headers: TableHeaderType<T, C>[]
  tableData: TableContentDataType<T>[]
  setTableData: React.Dispatch<React.SetStateAction<TableContentDataType<T>[]>>
  data: TableContentDataType<T>[]
  idx: number
  column: TableHeaderType<T, C>
}

// TableCustomBody
export interface TableCustomBodyProps<
  T extends Record<string, unknown>,
  Y extends keyof Record<string, unknown>,
  C extends boolean,
> {
  headers: TableHeaderType<T, C>[]
  resultArrays: TableContentDataType<T>[][]
  paginationState: PaginationState
  selection: boolean
  selected: TableContentDataType<T>[]
  setSelected: React.Dispatch<React.SetStateAction<TableContentDataType<T>[]>>
  dropdownMenu: DropdownMenuOptionsType<TableHeaderOptionsType<T, C>>
  contextMenu: ContextMenuOptionsType<TableHeaderOptionsType<T, C>>
  filtersData: ComboboxType<Extract<keyof C, string>, Y>[] | undefined
}

// TableCustomFooter

// TablePagination

export interface TableDataKey extends React.HTMLProps<HTMLTableCellElement> {
  withLabel?: Omit<LabelType, 'showCommand' | 'showLabel'>
  withIcon?: React.ReactNode
}
export interface TableCaptionType extends React.HTMLProps<HTMLTableCaptionElement> {}
export interface TablePaginationsType extends React.HTMLProps<HTMLDivElement> {
  groupSize: number
  activePage?: number
  showPageCount?: boolean
  showSelectCount?: boolean
  showNavigation?: boolean
  showGroup?: boolean
}

export interface PaginationState {
  activePage: number
  groupSize: number
}

export interface TablePaginationType<C extends Record<string, any> = Record<string, string>> {
  selected: TableContentDataType<C>[]
  setValue: React.Dispatch<React.SetStateAction<string[]>>
  value: string[]
  tableData: TableContentDataType<C>[]
  paginations?: TablePaginationsType
  resultArrays: TableContentDataType<C>[][]
  paginationState: PaginationState
  setPaginationState: React.Dispatch<React.SetStateAction<PaginationState>>
}

// TableCustomView
