export interface DuckTableType<T> {
  // Listeners
  onUpdate(fn: () => void): () => void

  // Data management
  getRawData(): DuckTableRow<T>[]
  setData(data: DuckTableRow<T>[]): void

  // Pagination
  setPageSize(size: number): void
  setPage(page: number): void
  nextPage(): void
  lastPage(): void
  prevPage(): void
  firstPage(): void
  getPage(): DuckTableRow<T>[]
  getTotalPages(): number

  // Filtering & Sorting
  setFilters(filters: DuckTableFilterFn<T>[]): void
  setSort(sort: DuckTableColumnSort<T>[]): void

  // Selection & Expansion
  toggleSelect(id: string): void
  toggleExpand(id: string): void
  getSelectedRows(): DuckTableRow<T>[]
  getExpandedRows(): DuckTableRow<T>[]

  // Column visibility
  toggleColumnVisibility(column: keyof T): void
  isColumnVisible(column: keyof T): boolean
  getVisibleColumns(): (keyof T)[]

  // Export
  exportCSV(): string
  exportJSON(): string
}

export type DuckTableRow<T> = T & { id: string }

export type DuckTableSortDirection = 'asc' | 'desc'

export interface DuckTableColumnSort<T> {
  column: keyof T
  direction: DuckTableSortDirection
}

export type DuckTableFilterFn<T> = (row: DuckTableRow<T>) => boolean

export interface DuckTableOptions<T> {
  data: DuckTableRow<T>[]
  pageSize?: number
  initialSort?: DuckTableColumnSort<T>[]
}

export type DuckTableChangeKey =
  | 'page'
  | 'sort'
  | 'filter'
  | 'data'
  | 'selection'
  | 'expansion'
  | 'columnVisibility'
  | 'all'
export type Listener = (key: DuckTableChangeKey) => void
