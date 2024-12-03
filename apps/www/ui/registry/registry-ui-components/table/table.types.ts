import { ScrollArea } from '@/registry/default/ui/scroll-area'
import { sortArray } from './table.lib'
import { TableCell, TableFooter, TablePaginationStateType } from './table'
import { ComboboxType } from '@/registry/default/ui/combobox'
import { ContextMenuOptionsType } from '@/registry/default/ui/context-menu'
import { DropdownMenuOptionsDataType, DropdownMenuOptionsType } from '@/registry/default/ui/dropdown-menu'
import { LabelType } from '../button'

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

export interface TableDropdownMenuOptionsType<C extends Record<string, any> = Record<string, string>> {
  sortArray: typeof sortArray
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType[]>>
  headers: TableHeaderType[]
  tableData: TableContentDataType<C>[]
  setTableData: React.Dispatch<React.SetStateAction<TableContentDataType<C>[]>>
  data: TableContentDataType<C>[]
  idx: number
  column: TableHeaderType
}

export interface TableHeaderType<T extends Record<string, any> = Record<string, string>, C extends boolean = true>
  extends Partial<React.HTMLProps<HTMLTableCellElement>> {
  label: Extract<keyof T, string>
  sortable?: boolean
  showLabel?: C
  currentSort?: C extends true ? 'asc' | 'desc' | 'not sorted' : never
  dropdownMenuOptions?: C extends true ? DropdownMenuOptionsDataType<TableDropdownMenuOptionsType<T>>[] : never
}

export interface TableHeaderActionsProps<T extends Record<string, unknown>, K extends boolean> {
  header: TableHeaderType<T, K>[]
  headers: TableHeaderType<T, K>[]
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType<T, K>[]>>
}

// TableHeaderOptions
export interface TableHeaderOptionsType<C extends Record<string, any> = Record<string, string>> {
  sortArray: typeof sortArray
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType[]>>
  headers: TableHeaderType[]
  tableData: TableContentDataType<C>[]
  setTableData: React.Dispatch<React.SetStateAction<TableContentDataType<C>[]>>
  data: TableContentDataType<C>[]
  idx: number
  column: TableHeaderType
}

// TableCustomViewHeader
export interface TableCustomViewHeaderProps<
  T extends boolean = false,
  C extends Record<string, any> = Record<string, string>,
> {
  headers: TableHeaderType<T, C>[]
  setHeaders: React.Dispatch<React.SetStateAction<TableHeaderType<T, C>[]>>
  tableData: TableContentDataType<C>[]
  setTableData: React.Dispatch<React.SetStateAction<TableContentDataType<C>[]>>
  selection: boolean
  selected: TableContentDataType<C>[]
  setSelected: React.Dispatch<React.SetStateAction<TableContentDataType<C>[]>>
}

// TableCustomBody
export interface TableCustomBodyProps<
  T extends boolean,
  C extends Record<string, unknown>,
  Y extends keyof Record<string, unknown>,
> {
  headers: TableHeaderType<T, C>[]
  resultArrays: TableContentDataType<C>[][]
  paginationState: PaginationState
  selection: boolean
  selected: TableContentDataType<C>[]
  setSelected: React.Dispatch<React.SetStateAction<TableContentDataType<C>[]>>
  dropdownMenu: DropdownMenuOptionsType<TableHeaderOptionsType<C>>
  contextMenu: ContextMenuOptionsType<TableHeaderOptionsType<C>>
  filtersData: ComboboxType<Extract<keyof C, string>, Y>[] | undefined
}

export type TableDataFilteredType<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

// TableCustomFooter
export interface TableFooterProps extends Partial<React.ComponentPropsWithoutRef<typeof TableFooter>> {
  columns: FooterColumnType[]
}

export type FooterColumnType = Partial<React.ComponentPropsWithoutRef<typeof TableCell>>

// TablePagination
export type TableContentDataType<C extends Record<string, any> = Record<string, string>> = {
  [key in keyof C]: TableDataKey & { children: C[key] }
}

export interface TableType extends Partial<React.ComponentPropsWithoutRef<typeof ScrollArea>> {}
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
export interface TableCustomViewProps<
  T extends boolean = false,
  C extends Record<string, unknown> = Record<string, string>,
  Y extends keyof Record<string, unknown> | string = string,
> {
  wrapper?: React.HTMLProps<HTMLDivElement>
  filters?: ComboboxType<Extract<keyof C, string>, Y>[]
  table?: TableType
  tableContentData: TableContentDataType<C>[]
  selection?: boolean
  header?: TableHeaderType<T, C>[]
  footer?: TableFooterProps
  caption?: TableCaptionType
  pagination?: TablePaginationsType
  viewButton?: boolean
  tableSearch?: boolean
  dropdownMenu?: DropdownMenuOptionsType<TableHeaderOptionsType<C>>
  contextMenu?: ContextMenuOptionsType<TableHeaderOptionsType<C>>
}
